import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Branch {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
}

export function useBranches() {
  const query = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("branches")
        .select("id, name, address, phone")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Branch[];
    },
  });

  return {
    branches: query.data ?? [],
    isLoading: query.isLoading,
    branchNames: (query.data ?? []).map((b) => b.name),
  };
}
