import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, UserCircle, Phone, Mail, Gift } from "lucide-react";

const clients = [
  { name: "Emma Wilson", phone: "(555) 123-4567", email: "emma@email.com", visits: 24, points: 480, lastVisit: "Feb 15, 2026", spent: "$1,840" },
  { name: "Sarah Chen", phone: "(555) 234-5678", email: "sarah@email.com", visits: 18, points: 360, lastVisit: "Feb 12, 2026", spent: "$1,420" },
  { name: "Ava Rodriguez", phone: "(555) 345-6789", email: "ava@email.com", visits: 32, points: 640, lastVisit: "Feb 18, 2026", spent: "$2,680" },
  { name: "Mia Johnson", phone: "(555) 456-7890", email: "mia@email.com", visits: 12, points: 240, lastVisit: "Feb 10, 2026", spent: "$960" },
  { name: "Olivia Brown", phone: "(555) 567-8901", email: "olivia@email.com", visits: 28, points: 560, lastVisit: "Feb 17, 2026", spent: "$2,240" },
  { name: "Chloe Davis", phone: "(555) 678-9012", email: "chloe@email.com", visits: 8, points: 160, lastVisit: "Feb 8, 2026", spent: "$640" },
];

const Clients = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground mt-1">Manage client profiles and loyalty</p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search clients..." className="pl-10" />
        </div>

        <div className="rounded-xl bg-card shadow-card border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Visits</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Loyalty Points</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total Spent</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full gradient-gold flex items-center justify-center text-sm font-bold text-foreground">
                          {client.name.charAt(0)}
                        </div>
                        <span className="font-medium text-card-foreground">{client.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />{client.phone}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" />{client.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-card-foreground">{client.visits}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-accent font-medium">
                        <Gift className="h-3.5 w-3.5" />{client.points}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary">{client.spent}</td>
                    <td className="py-3 px-4 text-muted-foreground">{client.lastVisit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Clients;
