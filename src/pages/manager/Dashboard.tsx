import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Calendar, Users, UserCheck, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const ManagerDashboard = () => {
  const { branch } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: todayBookings = [] } = useQuery({
    queryKey: ["manager-bookings-today", branch, today],
    enabled: !!branch,
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("branch", branch!)
        .eq("booking_date", today)
        .order("booking_time");
      return data || [];
    },
  });

  const { data: walkIns = [] } = useQuery({
    queryKey: ["manager-walkins-today", branch, today],
    enabled: !!branch,
    queryFn: async () => {
      const { data } = await supabase
        .from("walk_ins")
        .select("*")
        .eq("branch", branch!)
        .gte("arrived_at", `${today}T00:00:00`)
        .order("arrived_at");
      return data || [];
    },
  });

  const pendingCount = todayBookings.filter(b => b.status === "pending").length;

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Branch Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of {branch || "branch"} operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Today's Bookings" value={String(todayBookings.length)} icon={Calendar} />
          <StatCard title="Walk-ins Today" value={String(walkIns.length)} icon={Users} />
          <StatCard title="Pending Requests" value={String(pendingCount)} icon={Clock} />
          <StatCard title="Confirmed" value={String(todayBookings.filter(b => b.status === "confirmed").length)} icon={UserCheck} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-card shadow-card border p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              {todayBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No bookings today.</p>
              ) : todayBookings.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-20">{appt.booking_time}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{appt.client_name}</p>
                      <p className="text-xs text-muted-foreground">{appt.service}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    appt.status === "confirmed" ? "bg-sage/15 text-sage" :
                    appt.status === "pending" ? "bg-accent/15 text-accent" :
                    "bg-primary/15 text-primary"
                  }`}>{appt.tech_name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-card shadow-card border p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Pending Requests</h2>
            <div className="space-y-3">
              {pendingCount === 0 ? (
                <p className="text-muted-foreground text-center py-4">No pending requests.</p>
              ) : todayBookings.filter(b => b.status === "pending").map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-champagne/30">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{b.client_name}</p>
                    <p className="text-xs text-muted-foreground">{b.service} · {b.booking_time}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-accent/15 text-accent">Pending</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default ManagerDashboard;
