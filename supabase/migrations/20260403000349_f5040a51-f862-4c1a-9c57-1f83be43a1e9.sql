
-- Subscription tiers enum
CREATE TYPE public.subscription_tier AS ENUM ('individual', 'small_salon', 'big_spa', 'enterprise');
CREATE TYPE public.subscription_status AS ENUM ('active', 'trial', 'expired', 'cancelled');

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tier subscription_tier NOT NULL DEFAULT 'individual',
  status subscription_status NOT NULL DEFAULT 'trial',
  max_employees integer NOT NULL DEFAULT 1,
  current_employee_count integer NOT NULL DEFAULT 0,
  price_monthly numeric NOT NULL DEFAULT 29,
  trial_ends_at timestamp with time zone DEFAULT (now() + interval '14 days'),
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage subscriptions" ON public.subscriptions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- M-Pesa transactions table
CREATE TYPE public.mpesa_status AS ENUM ('pending', 'success', 'failed', 'cancelled');

CREATE TABLE public.mpesa_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checkout_request_id text UNIQUE,
  merchant_request_id text,
  receipt_number text,
  phone_number text NOT NULL,
  amount numeric NOT NULL,
  status mpesa_status NOT NULL DEFAULT 'pending',
  result_code integer,
  result_desc text,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  user_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.mpesa_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.mpesa_transactions
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated can insert transactions" ON public.mpesa_transactions
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can manage transactions" ON public.mpesa_transactions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Anon can insert (for callback edge function)
CREATE POLICY "Anon can insert transactions" ON public.mpesa_transactions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon can update transactions" ON public.mpesa_transactions
  FOR UPDATE TO anon USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mpesa_transactions_updated_at BEFORE UPDATE ON public.mpesa_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
