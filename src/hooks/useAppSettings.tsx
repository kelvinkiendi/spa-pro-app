import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AppSettings {
  id: string;
  app_name: string;
  logo_url: string | null;
  currency: string;
}

interface AppSettingsContextType {
  settings: AppSettings;
  loading: boolean;
  updateSettings: (updates: Partial<Pick<AppSettings, "app_name" | "logo_url">>) => Promise<{ error: string | null }>;
}

const defaults: AppSettings = { id: "", app_name: "GlowSpa", logo_url: null };

const AppSettingsContext = createContext<AppSettingsContextType>({
  settings: defaults,
  loading: true,
  updateSettings: async () => ({ error: null }),
});

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("app_settings")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setSettings(data as unknown as AppSettings);
        setLoading(false);
      });
  }, []);

  const updateSettings = useCallback(async (updates: Partial<Pick<AppSettings, "app_name" | "logo_url">>) => {
    const { error } = await supabase
      .from("app_settings" as any)
      .update(updates as any)
      .eq("id", settings.id);
    if (error) return { error: error.message };
    setSettings((prev) => ({ ...prev, ...updates }));
    return { error: null };
  }, [settings.id]);

  return (
    <AppSettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  return useContext(AppSettingsContext);
}
