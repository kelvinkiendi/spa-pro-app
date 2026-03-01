import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";

const WalkIns = () => {
  const walkIns = [
    { name: "Jane D.", service: "Express Manicure", tech: "Lisa M.", time: "10:15 AM", status: "In Progress" },
    { name: "Unknown", service: "Pedicure", tech: "Maria S.", time: "11:30 AM", status: "Waiting" },
    { name: "Kate M.", service: "Gel Nails", tech: "Tina R.", time: "12:00 PM", status: "Completed" },
  ];

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Walk-in Clients</h1>
            <p className="text-muted-foreground mt-1">Record and manage walk-in appointments</p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2">
            <UserPlus className="h-4 w-4" />Record Walk-in
          </Button>
        </div>

        <div className="rounded-xl bg-card shadow-card border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Client</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Service</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Assigned Tech</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Time</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {walkIns.map((w, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{w.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">{w.service}</td>
                  <td className="p-4 text-sm text-muted-foreground">{w.tech}</td>
                  <td className="p-4 text-sm text-muted-foreground">{w.time}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      w.status === "Completed" ? "bg-sage/15 text-sage" :
                      w.status === "In Progress" ? "bg-accent/15 text-accent" :
                      "bg-primary/15 text-primary"
                    }`}>{w.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default WalkIns;
