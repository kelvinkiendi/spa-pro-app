
-- Create bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_phone text,
  service text NOT NULL,
  tech_name text NOT NULL,
  branch text NOT NULL DEFAULT 'main',
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view bookings
CREATE POLICY "Authenticated users can view bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (true);

-- All authenticated users can insert bookings
CREATE POLICY "Authenticated users can insert bookings"
  ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (true);

-- Admins and managers can update bookings
CREATE POLICY "Admins and managers can update bookings"
  ON public.bookings FOR UPDATE TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'branch_manager'::app_role)
  );

-- Only admins can delete bookings
CREATE POLICY "Admins can delete bookings"
  ON public.bookings FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Updated_at trigger
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
