
CREATE TABLE public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_name text NOT NULL DEFAULT 'GlowSpa',
  logo_url text,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read app settings
CREATE POLICY "Anyone can view app_settings" ON public.app_settings
  FOR SELECT TO authenticated USING (true);

-- Only admins can update
CREATE POLICY "Admins can update app_settings" ON public.app_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed with default row
INSERT INTO public.app_settings (app_name) VALUES ('GlowSpa');
