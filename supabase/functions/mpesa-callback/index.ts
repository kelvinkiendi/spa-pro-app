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
    const body = await req.json();
    const callback = body?.Body?.stkCallback;

    if (!callback) {
      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;

    if (resultCode === 0) {
      // Payment successful - extract metadata
      const items = callback.CallbackMetadata?.Item || [];
      const getMeta = (name: string) => items.find((i: any) => i.Name === name)?.Value;

      await supabaseAdmin
        .from("mpesa_transactions")
        .update({
          status: "success",
          result_code: resultCode,
          result_desc: callback.ResultDesc,
          receipt_number: getMeta("MpesaReceiptNumber"),
          metadata: {
            amount: getMeta("Amount"),
            receipt_number: getMeta("MpesaReceiptNumber"),
            transaction_date: getMeta("TransactionDate"),
            phone_number: getMeta("PhoneNumber"),
          },
        })
        .eq("checkout_request_id", checkoutRequestId);
    } else {
      // Payment failed
      await supabaseAdmin
        .from("mpesa_transactions")
        .update({
          status: "failed",
          result_code: resultCode,
          result_desc: callback.ResultDesc,
        })
        .eq("checkout_request_id", checkoutRequestId);
    }

    return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: "Accepted" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Callback error:", err);
    return new Response(JSON.stringify({ ResultCode: 1, ResultDesc: "Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
