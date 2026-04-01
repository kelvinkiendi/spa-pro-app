import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Phone, Mail, Gift } from "lucide-react";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Clients = () => {
  const { selectedBranch } = useBranchFilter();

  const { data: clients = [] } = useQuery({
    queryKey: ["clients", selectedBranch],
    queryFn: async () => {
      let q = supabase.from("clients").select("*").order("created_at", { ascending: false });
      if (selectedBranch && selectedBranch !== "all") {
        q = q.eq("branch", selectedBranch);
      }
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

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
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Branch</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      No clients found{selectedBranch && selectedBranch !== "all" ? ` for ${selectedBranch}` : ""}.
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
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
                          {client.phone && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Phone className="h-3 w-3" />{client.phone}
                            </div>
                          )}
                          {client.email && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Mail className="h-3 w-3" />{client.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{client.branch}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{client.notes || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Clients;
