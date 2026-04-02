import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  category: string;
  is_active: boolean;
}

export function useServices(activeOnly = true) {
  return useQuery({
    queryKey: ["services", activeOnly],
    queryFn: async () => {
      let q = supabase.from("services").select("*").order("category").order("name");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as Service[];
    },
  });
}
