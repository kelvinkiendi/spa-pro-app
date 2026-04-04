import { TechLayout } from "@/components/layout/TechLayout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAppSettings } from "@/hooks/useAppSettings";
import { format, startOfMonth, endOfMonth } from "date-fns";

const TechSales = () => {
  const { fullName } = useAuth();
  const { settings } = useAppSettings();
  const currency = settings.currency || "KES";
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(new Date()), "yyyy-MM-dd");

  const { data: bookings = [] } = useQuery({
    queryKey: ["tech-sales", fullName, monthStart],
    enabled: !!fullName,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("tech_name", fullName!)
        .gte("booking_date", monthStart)
        .lte("booking_date", monthEnd)
        .in("status", ["confirmed", "completed"])
        .order("booking_date", { ascending: false });
      return data || [];
    },
  });

  const { data: services = [] } = useQuery({
    queryKey: ["services-for-sales"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*");
      return data || [];
    },
  });

  const serviceMap = new Map(services.map(s => [s.name, s]));

  return (
    <TechLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Sales & Services</h1>
          <p className="text-muted-foreground mt-1">Your completed services this month</p>
        </div>

        <div className="rounded-xl glass-card shadow-card overflow-hidden">
          {bookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No completed services this month.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Client</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Service</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const svc = serviceMap.get(b.service);
                  return (
                    <tr key={b.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-4 text-sm font-medium text-foreground">{b.client_name}</td>
                      <td className="p-4 text-sm text-muted-foreground">{b.service}</td>
                      <td className="p-4 text-sm font-semibold text-foreground">{currency} {svc?.price?.toLocaleString() || "—"}</td>
                      <td className="p-4 text-sm text-muted-foreground">{format(new Date(b.booking_date), "MMM d, yyyy")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </TechLayout>
  );
};

export default TechSales;