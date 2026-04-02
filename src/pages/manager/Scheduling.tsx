import { useState, useEffect } from "react";
import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Schedule {
  id: string;
  tech_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const ManagerScheduling = () => {
  const { branch } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!branch) return;
    supabase
      .from("staff_schedules")
      .select("*")
      .eq("branch", branch)
      .order("tech_name")
      .order("day_of_week")
      .then(({ data }) => {
        setSchedules((data || []) as Schedule[]);
        setLoading(false);
      });
  }, [branch]);

  // Group by tech
  const techGroups = schedules.reduce<Record<string, Schedule[]>>((acc, s) => {
    (acc[s.tech_name] = acc[s.tech_name] || []).push(s);
    return acc;
  }, {});

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Schedule Technicians</h1>
          <p className="text-muted-foreground mt-1">View weekly schedules for your team at {branch}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : Object.keys(techGroups).length === 0 ? (
          <div className="rounded-xl bg-card p-8 shadow-card border text-center text-muted-foreground">
            No schedules configured. Ask admin to set up schedules.
          </div>
        ) : (
          <div className="rounded-xl bg-card shadow-card border overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Technician</th>
                  {DAYS.slice(1).concat(DAYS.slice(0, 1)).map(d => (
                    <th key={d} className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase">{d.slice(0, 3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(techGroups).map(([name, scheds]) => {
                  // Map day_of_week to schedule: Mon(1) to Sun(0)
                  const dayMap = new Map(scheds.map(s => [s.day_of_week, s]));
                  const orderedDays = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sun

                  return (
                    <tr key={name} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full gradient-gold flex items-center justify-center text-xs font-bold">{name.charAt(0)}</div>
                          <span className="text-sm font-medium text-foreground">{name}</span>
                        </div>
                      </td>
                      {orderedDays.map(day => {
                        const sched = dayMap.get(day);
                        if (!sched || !sched.is_available) {
                          return <td key={day} className="p-4 text-center"><span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">Off</span></td>;
                        }
                        return (
                          <td key={day} className="p-4 text-center">
                            <span className="text-xs px-2 py-1 rounded-full bg-sage/15 text-sage">
                              {sched.start_time.slice(0, 5)}-{sched.end_time.slice(0, 5)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
};

export default ManagerScheduling;
