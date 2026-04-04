import { TechLayout } from "@/components/layout/TechLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DollarSign, Calendar, Star, TrendingUp, Banknote, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { useAppSettings } from "@/hooks/useAppSettings";

const TechDashboard = () => {
  const { fullName } = useAuth();
  const { settings } = useAppSettings();
  const currency = settings.currency || "KES";
  const today = format(new Date(), "yyyy-MM-dd");
  const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(new Date()), "yyyy-MM-dd");

  const { data: todayBookings = [] } = useQuery({
    queryKey: ["tech-bookings-today", fullName, today],
    enabled: !!fullName,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("tech_name", fullName!)
        .eq("booking_date", today)
        .order("booking_time");
      return data || [];
    },
  });

  const { data: monthBookings = [] } = useQuery({
    queryKey: ["tech-bookings-month", fullName, monthStart],
    enabled: !!fullName,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("tech_name", fullName!)
        .gte("booking_date", monthStart)
        .lte("booking_date", monthEnd);
      return data || [];
    },
  });

  const confirmedThisMonth = monthBookings.filter(b => b.status === "confirmed" || b.status === "completed").length;
  const uniqueClients = new Set(monthBookings.map(b => b.client_name)).size;

  return (
    <TechLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Welcome, {fullName ?? "Staff"} ✨
          </h1>
          <p className="text-muted-foreground mt-1">Your performance hub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Today's Bookings" value={String(todayBookings.length)} icon={Calendar} />
          <StatCard title="This Month" value={String(monthBookings.length)} icon={TrendingUp} change={`${confirmedThisMonth} confirmed`} changeType="positive" />
          <StatCard title="Unique Clients" value={String(uniqueClients)} icon={Users} />
          <StatCard title="Pending Today" value={String(todayBookings.filter(b => b.status === "pending").length)} icon={Star} />
        </div>

        <div className="rounded-xl glass-card shadow-card p-6">
          <h2 className="font-display font-semibold text-lg mb-4 text-foreground">Today's Appointments</h2>
          <div className="space-y-3">
            {todayBookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No appointments today. Enjoy your break! ☕</p>
            ) : todayBookings.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 transition-all hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-mono font-medium text-primary w-16">{a.booking_time?.slice(0, 5)}</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{a.client_name}</p>
                    <p className="text-xs text-muted-foreground">{a.service} · {a.duration_minutes}min</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  a.status === "confirmed" ? "bg-accent/15 text-accent" :
                  a.status === "pending" ? "bg-primary/15 text-primary" :
                  a.status === "completed" ? "bg-accent/20 text-accent" :
                  "bg-muted text-muted-foreground"
                }`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TechLayout>
  );
};

export default TechDashboard;