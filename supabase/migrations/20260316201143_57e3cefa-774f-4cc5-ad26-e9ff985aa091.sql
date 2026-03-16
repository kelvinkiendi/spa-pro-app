
CREATE TABLE public.branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  address text,
  phone text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view branches" ON public.branches
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert branches" ON public.branches
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update branches" ON public.branches
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete branches" ON public.branches
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed the default branch
INSERT INTO public.branches (name) VALUES ('main');
