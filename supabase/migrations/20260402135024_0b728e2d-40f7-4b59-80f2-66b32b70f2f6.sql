
-- Services table
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  price numeric NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'General',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services" ON public.services FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add currency to app_settings
ALTER TABLE public.app_settings ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'KES';

-- Allow anon to view app_settings
CREATE POLICY "Anon can view app_settings" ON public.app_settings FOR SELECT TO anon USING (true);
