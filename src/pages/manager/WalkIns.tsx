import { useState, useEffect } from "react";
import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface WalkIn {
  id: string;
  client_name: string;
  client_phone: string | null;
  service: string;
  tech_name: string;
  status: string;
  arrived_at: string;
  notes: string | null;
}

const WalkIns = () => {
  const { branch } = useAuth();
  const [walkIns, setWalkIns] = useState<WalkIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ client_name: "", client_phone: "", service: "", tech_name: "", notes: "" });

  const fetchWalkIns = async () => {
    let q = supabase.from("walk_ins").select("*").order("arrived_at", { ascending: false });
    if (branch) q = q.eq("branch", branch);
    const { data, error } = await q;
    if (!error) setWalkIns(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchWalkIns(); }, []);

  const handleAdd = async () => {
    if (!form.client_name || !form.service || !form.tech_name) {
      toast({ title: "Missing fields", description: "Name, service and tech are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("walk_ins").insert({
      client_name: form.client_name,
      client_phone: form.client_phone || null,
      service: form.service,
      tech_name: form.tech_name,
      notes: form.notes || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Walk-in recorded" });
      setForm({ client_name: "", client_phone: "", service: "", tech_name: "", notes: "" });
      setDialogOpen(false);
      fetchWalkIns();
    }
    setSaving(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("walk_ins").update({ status }).eq("id", id);
    if (!error) fetchWalkIns();
  };

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Walk-in Clients</h1>
            <p className="text-muted-foreground mt-1">Record and manage walk-in appointments</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2">
                <UserPlus className="h-4 w-4" />Record Walk-in
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Walk-in</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Client Name *</Label>
                  <Input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={form.client_phone} onChange={e => setForm(f => ({ ...f, client_phone: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Service *</Label>
                  <Input value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} placeholder="e.g. Express Manicure" />
                </div>
                <div className="space-y-2">
                  <Label>Assigned Tech *</Label>
                  <Input value={form.tech_name} onChange={e => setForm(f => ({ ...f, tech_name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <Button className="w-full gradient-primary text-primary-foreground" onClick={handleAdd} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Record Walk-in
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
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
                {walkIns.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No walk-ins recorded today</td></tr>
                ) : walkIns.map((w) => (
                  <tr key={w.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm font-medium text-foreground">{w.client_name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{w.service}</td>
                    <td className="p-4 text-sm text-muted-foreground">{w.tech_name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{new Date(w.arrived_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="p-4">
                      <Select value={w.status} onValueChange={(v) => updateStatus(w.id, v)}>
                        <SelectTrigger className="h-7 w-[120px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="waiting">Waiting</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
};

export default WalkIns;
