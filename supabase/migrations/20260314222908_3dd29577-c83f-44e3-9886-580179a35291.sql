
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);

CREATE POLICY "Anyone can read logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Admins can upload logos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update logos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'logos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete logos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'logos' AND public.has_role(auth.uid(), 'admin'));
