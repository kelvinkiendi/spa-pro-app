import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX, Clock } from "lucide-react";

const Attendance = () => {
  const techs = [
    { name: "Lisa M.", status: "Present", clockIn: "8:45 AM", clockOut: "—" },
    { name: "Maria S.", status: "Present", clockIn: "8:50 AM", clockOut: "—" },
    { name: "Tina R.", status: "Present", clockIn: "9:00 AM", clockOut: "—" },
    { name: "Jade W.", status: "Present", clockIn: "8:55 AM", clockOut: "—" },
    { name: "Amy L.", status: "Off", clockIn: "—", clockOut: "—" },
    { name: "Nina K.", status: "Late", clockIn: "9:30 AM", clockOut: "—" },
  ];

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground mt-1">Track who is present, off, or late</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-card shadow-card border p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-sage/15 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-sage" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">4</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
          </div>
          <div className="rounded-xl bg-card shadow-card border p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <UserX className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-sm text-muted-foreground">Off</p>
            </div>
          </div>
          <div className="rounded-xl bg-card shadow-card border p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-accent/15 flex items-center justify-center">
              <Clock className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">1</p>
              <p className="text-sm text-muted-foreground">Late</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card shadow-card border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Technician</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Clock In</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Clock Out</th>
              </tr>
            </thead>
            <tbody>
              {techs.map((t, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full gradient-gold flex items-center justify-center text-xs font-bold">{t.name.charAt(0)}</div>
                      <span className="text-sm font-medium text-foreground">{t.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      t.status === "Present" ? "bg-sage/15 text-sage" :
                      t.status === "Late" ? "bg-accent/15 text-accent" :
                      "bg-destructive/10 text-destructive"
                    }`}>{t.status}</span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{t.clockIn}</td>
                  <td className="p-4 text-sm text-muted-foreground">{t.clockOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default Attendance;
