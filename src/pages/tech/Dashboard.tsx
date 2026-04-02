import { TechLayout } from "@/components/layout/TechLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DollarSign, Calendar, Star, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useAppSettings } from "@/hooks/useAppSettings";

const TechDashboard = () => {
  const { fullName } = useAuth();
  const { settings } = useAppSettings();
  const currency = settings.currency || "KES";
  const today = format(new Date(), "yyyy-MM-dd");

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

  return (
    <TechLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Welcome, {fullName ?? "Technician"}
          </h1>
          <p className="text-muted-foreground mt-1">Your performance overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Today's Bookings" value={String(todayBookings.length)} icon={Calendar} />
          <StatCard title="Confirmed" value={String(todayBookings.filter(b => b.status === "confirmed").length)} icon={Star} />
          <StatCard title="Pending" value={String(todayBookings.filter(b => b.status === "pending").length)} icon={TrendingUp} />
          <StatCard title="Currency" value={currency} icon={DollarSign} />
        </div>

        <div className="rounded-xl bg-card shadow-card border p-6">
          <h2 className="font-display font-semibold text-lg mb-4">Today's Appointments</h2>
          <div className="space-y-3">
            {todayBookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No appointments today.</p>
            ) : todayBookings.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-20">{a.booking_time}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{a.client_name}</p>
                    <p className="text-xs text-muted-foreground">{a.service}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  a.status === "confirmed" ? "bg-sage/15 text-sage" :
                  a.status === "pending" ? "bg-accent/15 text-accent" :
                  "bg-primary/15 text-primary"
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
