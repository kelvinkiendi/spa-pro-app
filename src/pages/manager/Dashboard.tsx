import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Calendar, Users, UserCheck, Clock } from "lucide-react";

const ManagerDashboard = () => {
  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Branch Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of branch operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Today's Bookings" value="12" icon={Calendar} change="+8%" changeType="positive" />
          <StatCard title="Walk-ins Today" value="4" icon={Users} change="+15%" changeType="positive" />
          <StatCard title="Techs Present" value="5/6" icon={UserCheck} />
          <StatCard title="Pending Requests" value="2" icon={Clock} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-card shadow-card border p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              {[
                { time: "9:00 AM", client: "Emma W.", tech: "Lisa M.", service: "Gel Manicure" },
                { time: "10:00 AM", client: "Sarah C.", tech: "Maria S.", service: "Pedicure Deluxe" },
                { time: "11:00 AM", client: "Ava R.", tech: "Tina R.", service: "Acrylic Full Set" },
                { time: "1:00 PM", client: "Olivia B.", tech: "Jade W.", service: "Full Spa Package" },
              ].map((appt, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-20">{appt.time}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{appt.client}</p>
                      <p className="text-xs text-muted-foreground">{appt.service}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-accent/15 text-accent px-2 py-1 rounded-full">{appt.tech}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-card shadow-card border p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Attendance Today</h2>
            <div className="space-y-3">
              {[
                { name: "Lisa M.", status: "Present", time: "8:45 AM" },
                { name: "Maria S.", status: "Present", time: "8:50 AM" },
                { name: "Tina R.", status: "Present", time: "9:00 AM" },
                { name: "Jade W.", status: "Present", time: "8:55 AM" },
                { name: "Amy L.", status: "Off", time: "—" },
                { name: "Nina K.", status: "Late", time: "9:30 AM" },
              ].map((tech, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full gradient-gold flex items-center justify-center text-xs font-bold">
                      {tech.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-foreground">{tech.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{tech.time}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tech.status === "Present" ? "bg-sage/15 text-sage" :
                      tech.status === "Late" ? "bg-accent/15 text-accent" :
                      "bg-destructive/10 text-destructive"
                    }`}>{tech.status}</span>
                  </div>
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
