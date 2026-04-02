import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Scissors } from "lucide-react";
import { useAppSettings } from "@/hooks/useAppSettings";

const categories = ["Manicure", "Pedicure", "Extensions", "Add-on", "Package", "General"];

const AdminServices = () => {
  const queryClient = useQueryClient();
  const { settings } = useAppSettings();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", duration_minutes: 30, price: 0, category: "General", is_active: true });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("category").order("name");
      if (error) throw error;
      return data;
    },
  });

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: "", duration_minutes: 30, price: 0, category: "General", is_active: true });
    setDialogOpen(true);
  };

  const openEdit = (s: any) => {
    setEditingId(s.id);
    setForm({ name: s.name, duration_minutes: s.duration_minutes, price: Number(s.price), category: s.category, is_active: s.is_active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSaving(true);
    if (editingId) {
      const { error } = await supabase.from("services").update(form as any).eq("id", editingId);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Service updated" });
    } else {
      const { error } = await supabase.from("services").insert(form as any);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Service added" });
    }
    setDialogOpen(false);
    setSaving(false);
    queryClient.invalidateQueries({ queryKey: ["services"] });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Service deleted" });
    queryClient.invalidateQueries({ queryKey: ["services"] });
  };

  const currency = settings.currency || "KES";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Services</h1>
            <p className="text-muted-foreground mt-1">Manage service offerings and pricing</p>
          </div>
          <Button onClick={openAdd} className="gradient-primary text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />Add Service
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Services</CardTitle></CardHeader>
            <CardContent><span className="text-2xl font-bold">{services.length}</span></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle></CardHeader>
            <CardContent><span className="text-2xl font-bold text-sage">{services.filter(s => s.is_active).length}</span></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle></CardHeader>
            <CardContent><span className="text-2xl font-bold">{new Set(services.map(s => s.category)).size}</span></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Currency</CardTitle></CardHeader>
            <CardContent><span className="text-2xl font-bold">{currency}</span></CardContent>
          </Card>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingId ? "Edit Service" : "Add Service"}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Gel Manicure" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (mins)</Label>
                  <Input type="number" value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: Number(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Price ({currency})</Label>
                  <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
                <Label>Active (visible to clients)</Label>
              </div>
              <Button className="w-full gradient-primary text-primary-foreground" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{editingId ? "Save Changes" : "Add Service"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No services yet. Add your first service.</TableCell></TableRow>
                  ) : services.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium flex items-center gap-2"><Scissors className="h-4 w-4 text-primary" />{s.name}</TableCell>
                      <TableCell>{s.category}</TableCell>
                      <TableCell>{s.duration_minutes} min</TableCell>
                      <TableCell>{currency} {Number(s.price).toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${s.is_active ? "bg-sage/15 text-sage" : "bg-muted text-muted-foreground"}`}>
                          {s.is_active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(s.id, s.name)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
