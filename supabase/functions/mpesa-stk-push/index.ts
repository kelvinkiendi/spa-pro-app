import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { phone_number, amount, booking_id, account_reference, description } = await req.json();

    if (!phone_number || !amount) {
      return new Response(JSON.stringify({ error: "phone_number and amount are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Format phone: ensure 254XXXXXXXXX
    const formattedPhone = phone_number.replace(/^0/, "254").replace(/^\+/, "");

    const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY")!;
    const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET")!;
    const shortcode = Deno.env.get("MPESA_SHORTCODE") || "174379";
    const passkey = Deno.env.get("MPESA_PASSKEY") || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const callbackBaseUrl = Deno.env.get("SUPABASE_URL")!;
    const isProduction = Deno.env.get("MPESA_ENVIRONMENT") === "production";

    const baseUrl = isProduction
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

    // Get OAuth token
    const authStr = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${authStr}` },
    });
    const { access_token } = await tokenRes.json();

    if (!access_token) {
      throw new Error("Failed to get M-Pesa access token");
    }

    // Generate timestamp and password
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");
    const password = btoa(`${shortcode}${passkey}${timestamp}`);

    const callbackUrl = `${callbackBaseUrl}/functions/v1/mpesa-callback`;

    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBuyGoodsOnline",
      Amount: Math.ceil(Number(amount)),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: account_reference || "SalonPOS",
      TransactionDesc: description || "Salon Payment",
    };

    const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPayload),
    });

    const stkData = await stkRes.json();

    if (stkData.ResponseCode !== "0") {
      throw new Error(stkData.errorMessage || stkData.ResponseDescription || "STK push failed");
    }

    // Save transaction to DB
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get user from auth header if present
    let userId = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseAdmin.auth.getUser(token);
      userId = data?.user?.id || null;
    }

    await supabaseAdmin.from("mpesa_transactions").insert({
      checkout_request_id: stkData.CheckoutRequestID,
      merchant_request_id: stkData.MerchantRequestID,
      phone_number: formattedPhone,
      amount: Number(amount),
      status: "pending",
      booking_id: booking_id || null,
      user_id: userId,
    });

    return new Response(JSON.stringify({
      success: true,
      checkout_request_id: stkData.CheckoutRequestID,
      merchant_request_id: stkData.MerchantRequestID,
      message: "STK push sent. Check your phone.",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
