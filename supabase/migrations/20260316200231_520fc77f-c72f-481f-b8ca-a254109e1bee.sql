
-- Clients table for storing client info
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  notes text,
  branch text NOT NULL DEFAULT 'main',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view clients" ON public.clients
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and managers can insert clients" ON public.clients
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'branch_manager'));

CREATE POLICY "Admins and managers can update clients" ON public.clients
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'branch_manager'));

CREATE POLICY "Admins can delete clients" ON public.clients
  FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Walk-in clients table
CREATE TABLE public.walk_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_phone text,
  service text NOT NULL,
  tech_name text NOT NULL,
  branch text NOT NULL DEFAULT 'main',
  status text NOT NULL DEFAULT 'waiting',
  arrived_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.walk_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view walk_ins" ON public.walk_ins
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can insert walk_ins" ON public.walk_ins
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'branch_manager'));

CREATE POLICY "Managers can update walk_ins" ON public.walk_ins
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'branch_manager'));

-- Inventory table
CREATE TABLE public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  stock integer NOT NULL DEFAULT 0,
  min_stock integer NOT NULL DEFAULT 5,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  supplier text,
  branch text NOT NULL DEFAULT 'main',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view inventory" ON public.inventory
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage inventory" ON public.inventory
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can update inventory" ON public.inventory
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'branch_manager'));

-- Inventory usage log
CREATE TABLE public.inventory_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id uuid REFERENCES public.inventory(id) ON DELETE CASCADE NOT NULL,
  quantity_used integer NOT NULL DEFAULT 1,
  used_by text NOT NULL,
  reason text,
  branch text NOT NULL DEFAULT 'main',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.inventory_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view inventory_usage" ON public.inventory_usage
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can log inventory usage" ON public.inventory_usage
  FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'branch_manager'));

-- Updated_at triggers
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_walk_ins_updated_at BEFORE UPDATE ON public.walk_ins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
