import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MpesaPaymentOptions {
  phoneNumber: string;
  amount: number;
  bookingId?: string;
  accountReference?: string;
  description?: string;
}

export function useMpesa() {
  const [loading, setLoading] = useState(false);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = useCallback(async (options: MpesaPaymentOptions) => {
    setLoading(true);
    setError(null);
    setStatus("pending");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("mpesa-stk-push", {
        body: {
          phone_number: options.phoneNumber,
          amount: options.amount,
          booking_id: options.bookingId,
          account_reference: options.accountReference,
          description: options.description,
        },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setCheckoutRequestId(data.checkout_request_id);
      return data;
    } catch (err: any) {
      setError(err.message);
      setStatus("failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll for payment status
  useEffect(() => {
    if (!checkoutRequestId || status !== "pending") return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("mpesa_transactions")
        .select("status")
        .eq("checkout_request_id", checkoutRequestId)
        .single();

      if (data?.status === "success") {
        setStatus("success");
        clearInterval(interval);
      } else if (data?.status === "failed") {
        setStatus("failed");
        setError("Payment was not completed");
        clearInterval(interval);
      }
    }, 3000);

    // Stop polling after 2 minutes
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (status === "pending") {
        setStatus("failed");
        setError("Payment timed out. Please try again.");
      }
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [checkoutRequestId, status]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setCheckoutRequestId(null);
  }, []);

  return { initiatePayment, status, loading, error, checkoutRequestId, reset };
}
