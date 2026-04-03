import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/constants";

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: "active" | "trial" | "expired" | "cancelled";
  max_employees: number;
  current_employee_count: number;
  price_monthly: number;
  trial_ends_at: string | null;
  started_at: string;
  expires_at: string | null;
}

export function useSubscription() {
  const { user } = useAuth();

  const { data: subscription, isLoading, refetch } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data as Subscription | null;
    },
    enabled: !!user,
  });

  const tier = subscription?.tier || "individual";
  const tierConfig = SUBSCRIPTION_TIERS[tier];
  const isActive = subscription?.status === "active" || subscription?.status === "trial";
  const canAddEmployee = (subscription?.current_employee_count ?? 0) < tierConfig.maxEmployees;
  const employeesRemaining = tierConfig.maxEmployees - (subscription?.current_employee_count ?? 0);

  return {
    subscription,
    tier,
    tierConfig,
    isActive,
    isLoading,
    canAddEmployee,
    employeesRemaining,
    refetch,
  };
}
