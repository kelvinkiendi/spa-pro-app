import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { Button } from "@/components/ui/button";
import { UserPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const ManagerClients = () => {
  const clients = [
    { name: "Emma Watson", phone: "+254 712 345 678", email: "emma@email.com", visits: 12, lastVisit: "Feb 28, 2026" },
    { name: "Sarah Connor", phone: "+254 723 456 789", email: "sarah@email.com", visits: 8, lastVisit: "Feb 25, 2026" },
    { name: "Ava Richards", phone: "+254 734 567 890", email: "ava@email.com", visits: 5, lastVisit: "Feb 20, 2026" },
    { name: "Olivia Brown", phone: "+254 745 678 901", email: "olivia@email.com", visits: 3, lastVisit: "Feb 15, 2026" },
  ];

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground mt-1">Manage client information</p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2">
            <UserPlus className="h-4 w-4" />Add Client
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search clients..." />
        </div>

        <div className="rounded-xl bg-card shadow-card border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Phone</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Email</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Visits</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{c.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">{c.phone}</td>
                  <td className="p-4 text-sm text-muted-foreground">{c.email}</td>
                  <td className="p-4 text-sm text-muted-foreground">{c.visits}</td>
                  <td className="p-4 text-sm text-muted-foreground">{c.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default ManagerClients;
