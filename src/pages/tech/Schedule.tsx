import { useState, useEffect } from "react";
import { TechLayout } from "@/components/layout/TechLayout";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Schedule {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const TechSchedule = () => {
  const { fullName } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fullName) return;
    supabase
      .from("staff_schedules")
      .select("*")
      .eq("tech_name", fullName)
      .order("day_of_week")
      .then(({ data }) => {
        setSchedules((data || []) as Schedule[]);
        setLoading(false);
      });
  }, [fullName]);

  return (
    <TechLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Schedule</h1>
          <p className="text-muted-foreground mt-1">Your weekly work schedule</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : schedules.length === 0 ? (
          <div className="rounded-xl bg-card p-8 shadow-card border text-center text-muted-foreground">
            No schedule configured yet. Ask your manager to set up your schedule.
          </div>
        ) : (
          <div className="rounded-xl bg-card shadow-card border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase">Day</th>
                  <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase">Hours</th>
                  <th className="p-4 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(s => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium text-foreground">{DAYS[s.day_of_week]}</td>
                    <td className="p-4 text-foreground">{s.start_time.slice(0, 5)} – {s.end_time.slice(0, 5)}</td>
                    <td className="p-4">
                      <Badge variant={s.is_available ? "default" : "secondary"} className={s.is_available ? "bg-sage/20 text-sage border-sage/30" : ""}>
                        {s.is_available ? "Available" : "Off"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </TechLayout>
  );
};

export default TechSchedule;
