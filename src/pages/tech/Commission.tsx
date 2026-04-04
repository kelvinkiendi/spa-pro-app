import { TechLayout } from "@/components/layout/TechLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DollarSign, TrendingUp, Percent } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAppSettings } from "@/hooks/useAppSettings";
import { format, startOfMonth, endOfMonth } from "date-fns";

const TechCommission = () => {
  const { fullName } = useAuth();
  const { settings } = useAppSettings();
  const currency = settings.currency || "KES";
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(new Date()), "yyyy-MM-dd");

  const { data: completedBookings = [] } = useQuery({
    queryKey: ["tech-commission", fullName, monthStart],
    enabled: !!fullName,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("tech_name", fullName!)
        .gte("booking_date", monthStart)
        .lte("booking_date", monthEnd)
        .in("status", ["confirmed", "completed"]);
      return data || [];
    },
  });

  const { data: services = [] } = useQuery({
    queryKey: ["services-for-commission"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*");
      return data || [];
    },
  });

  // Build commission breakdown by service
  const serviceMap = new Map(services.map(s => [s.name, s]));
  const commissionRate = 0.30; // Default 30% commission

  const breakdown = Object.values(
    completedBookings.reduce((acc: Record<string, { service: string; count: number; total: number; rate: number }>, b) => {
      const svc = serviceMap.get(b.service);
      const price = svc?.price || 0;
      if (!acc[b.service]) {
        acc[b.service] = { service: b.service, count: 0, total: 0, rate: commissionRate };
      }
      acc[b.service].count += 1;
      acc[b.service].total += price * commissionRate;
      return acc;
    }, {})
  );

  const totalCommission = breakdown.reduce((sum, b) => sum + b.total, 0);

  return (
    <TechLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Commission</h1>
          <p className="text-muted-foreground mt-1">Your earnings this month</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title={`Commission (${format(new Date(), "MMM")})`} value={`${currency} ${totalCommission.toLocaleString()}`} icon={DollarSign} />
          <StatCard title="Services Completed" value={String(completedBookings.length)} icon={TrendingUp} />
          <StatCard title="Commission Rate" value={`${(commissionRate * 100).toFixed(0)}%`} icon={Percent} />
        </div>

        <div className="rounded-xl glass-card shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-semibold text-foreground">Commission Breakdown</h2>
          </div>
          {breakdown.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No completed services this month yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Service</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Rate</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Count</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Earned</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((c, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm font-medium text-foreground">{c.service}</td>
                    <td className="p-4"><span className="text-xs bg-primary/15 text-primary px-2 py-1 rounded-full">{(c.rate * 100).toFixed(0)}%</span></td>
                    <td className="p-4 text-sm text-muted-foreground">{c.count}</td>
                    <td className="p-4 text-sm font-semibold text-foreground">{currency} {c.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </TechLayout>
  );
};

export default TechCommission;