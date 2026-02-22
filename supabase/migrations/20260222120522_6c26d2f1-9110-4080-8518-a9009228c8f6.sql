
-- Staff schedules (weekly recurring)
CREATE TABLE public.staff_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tech_name TEXT NOT NULL,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  branch TEXT NOT NULL DEFAULT 'main',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Time-off requests
CREATE TABLE public.time_off_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tech_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  manager_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Report configurations (saved reports)
CREATE TABLE public.saved_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('revenue', 'staff_performance', 'service_popularity', 'client_data', 'inventory', 'custom')),
  filters JSONB NOT NULL DEFAULT '{}',
  date_range_start DATE,
  date_range_end DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notification settings / reminder configs
CREATE TABLE public.reminder_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('sms', 'email')),
  timing_minutes INT NOT NULL DEFAULT 1440,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  message_template TEXT NOT NULL DEFAULT 'Hi {{client_name}}, this is a reminder for your {{service}} appointment at {{branch}} on {{date}} at {{time}}.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default reminder settings
INSERT INTO public.reminder_settings (reminder_type, timing_minutes, message_template) VALUES
  ('email', 1440, 'Hi {{client_name}}, this is a reminder for your {{service}} appointment at {{branch}} on {{date}} at {{time}}. We look forward to seeing you!'),
  ('email', 60, 'Hi {{client_name}}, your {{service}} appointment at {{branch}} is in 1 hour. See you soon!'),
  ('sms', 1440, 'Reminder: Your {{service}} appt at {{branch}} is tomorrow at {{time}}. Reply CANCEL to cancel.');

-- Enable RLS on all tables
ALTER TABLE public.staff_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_off_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;

-- Public read/write policies (no auth yet - admin panel is unprotected currently)
CREATE POLICY "Allow all access to staff_schedules" ON public.staff_schedules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to time_off_requests" ON public.time_off_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to saved_reports" ON public.saved_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to reminder_settings" ON public.reminder_settings FOR ALL USING (true) WITH CHECK (true);
