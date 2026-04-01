
CREATE POLICY "Public can insert bookings" ON public.bookings
  FOR INSERT TO anon
  WITH CHECK (true);
