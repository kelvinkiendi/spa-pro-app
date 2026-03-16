import { useState, useEffect } from "react";
import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Pencil, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  branch: string;
  created_at: string;
}

const ManagerClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });

  const fetchClients = async () => {
    const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    if (!error) setClients(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const openAdd = () => {
    setEditingClient(null);
    setForm({ name: "", phone: "", email: "", notes: "" });
    setDialogOpen(true);
  };

  const openEdit = (c: Client) => {
    setEditingClient(c);
    setForm({ name: c.name, phone: c.phone || "", email: c.email || "", notes: c.notes || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    if (editingClient) {
      const { error } = await supabase.from("clients").update({
        name: form.name,
        phone: form.phone || null,
        email: form.email || null,
        notes: form.notes || null,
      }).eq("id", editingClient.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Client updated" });
    } else {
      const { error } = await supabase.from("clients").insert({
        name: form.name,
        phone: form.phone || null,
        email: form.email || null,
        notes: form.notes || null,
      });
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Client added" });
    }
    setDialogOpen(false);
    fetchClients();
    setSaving(false);
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground mt-1">Manage client information</p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2" onClick={openAdd}>
            <UserPlus className="h-4 w-4" />Add Client
          </Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingClient ? "Edit Client" : "Add Client"}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <Button className="w-full gradient-primary text-primary-foreground" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{editingClient ? "Save Changes" : "Add Client"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="rounded-xl bg-card shadow-card border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Phone</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Email</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Notes</th>
                  <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No clients yet</td></tr>
                ) : filtered.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm font-medium text-foreground">{c.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{c.phone || "—"}</td>
                    <td className="p-4 text-sm text-muted-foreground">{c.email || "—"}</td>
                    <td className="p-4 text-sm text-muted-foreground max-w-[200px] truncate">{c.notes || "—"}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
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

export default ManagerClients;
