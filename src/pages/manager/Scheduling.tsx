import { ManagerLayout } from "@/components/layout/ManagerLayout";

const ManagerScheduling = () => {
  const schedule = [
    { name: "Lisa M.", mon: "9-5", tue: "9-5", wed: "9-5", thu: "Off", fri: "9-5", sat: "10-4" },
    { name: "Maria S.", mon: "9-5", tue: "Off", wed: "9-5", thu: "9-5", fri: "9-5", sat: "10-4" },
    { name: "Tina R.", mon: "9-5", tue: "9-5", wed: "Off", thu: "9-5", fri: "9-5", sat: "Off" },
    { name: "Jade W.", mon: "Off", tue: "9-5", wed: "9-5", thu: "9-5", fri: "Off", sat: "10-4" },
    { name: "Amy L.", mon: "9-5", tue: "9-5", wed: "9-5", thu: "9-5", fri: "Off", sat: "Off" },
  ];

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Schedule Technicians</h1>
          <p className="text-muted-foreground mt-1">Manage weekly schedules for your team</p>
        </div>

        <div className="rounded-xl bg-card shadow-card border overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Technician</th>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <th key={d} className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.map((s, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full gradient-gold flex items-center justify-center text-xs font-bold">{s.name.charAt(0)}</div>
                      <span className="text-sm font-medium text-foreground">{s.name}</span>
                    </div>
                  </td>
                  {[s.mon, s.tue, s.wed, s.thu, s.fri, s.sat].map((time, j) => (
                    <td key={j} className="p-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        time === "Off" ? "bg-destructive/10 text-destructive" : "bg-sage/15 text-sage"
                      }`}>{time}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default ManagerScheduling;
