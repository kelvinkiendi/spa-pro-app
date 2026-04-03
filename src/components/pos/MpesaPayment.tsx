import { useState } from "react";
import { useMpesa } from "@/hooks/useMpesa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, Smartphone } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface MpesaPaymentProps {
  amount: number;
  bookingId?: string;
  description?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function MpesaPayment({ amount, bookingId, description, onSuccess, onClose }: MpesaPaymentProps) {
  const [phone, setPhone] = useState("");
  const { initiatePayment, status, loading, error, reset } = useMpesa();

  const handlePay = async () => {
    if (!phone || phone.length < 9) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      await initiatePayment({
        phoneNumber: phone,
        amount,
        bookingId,
        description: description || "Salon Payment",
      });
      toast.info("STK push sent! Check your phone to complete payment.");
    } catch {
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <Card className="border-green-500/50 bg-green-500/5">
        <CardContent className="pt-6 text-center space-y-3">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
          <h3 className="font-semibold text-lg text-foreground">Payment Successful!</h3>
          <p className="text-muted-foreground text-sm">KES {amount.toLocaleString()} received via M-Pesa</p>
          <Button onClick={() => { reset(); onSuccess?.(); }} className="w-full">Done</Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "failed") {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="pt-6 text-center space-y-3">
          <XCircle className="h-12 w-12 text-destructive mx-auto" />
          <h3 className="font-semibold text-lg text-foreground">Payment Failed</h3>
          <p className="text-muted-foreground text-sm">{error || "Transaction was not completed"}</p>
          <Button onClick={reset} variant="outline" className="w-full">Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-green-600" />
          M-Pesa Payment
        </CardTitle>
        <CardDescription>Pay KES {amount.toLocaleString()} via M-Pesa STK Push</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mpesa-phone">M-Pesa Phone Number</Label>
          <Input
            id="mpesa-phone"
            placeholder="0712345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading || status === "pending"}
            maxLength={13}
          />
          <p className="text-xs text-muted-foreground">Enter the M-Pesa registered phone number</p>
        </div>

        {status === "pending" && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-primary/10 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-foreground">Waiting for payment confirmation...</span>
          </div>
        )}

        <div className="flex gap-2">
          {onClose && (
            <Button variant="outline" onClick={onClose} disabled={loading || status === "pending"} className="flex-1">
              Cancel
            </Button>
          )}
          <Button
            onClick={handlePay}
            disabled={loading || status === "pending" || !phone}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {status === "pending" ? "Awaiting..." : `Pay KES ${amount.toLocaleString()}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
