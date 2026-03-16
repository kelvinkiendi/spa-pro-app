import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Plus, Trash2, Loader2, MapPin, Phone } from "lucide-react";

interface Branch {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  created_at: string;
}

export function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const { toast } = useToast();

  const fetchBranches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) {
      toast({ title: "Error", description: "Failed to load branches", variant: "destructive" });
    } else {
      setBranches(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchBranches(); }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast({ title: "Missing name", description: "Branch name is required", variant: "destructive" });
      return;
    }
    setCreating(true);
    const { error } = await supabase.from("branches").insert({
      name: form.name.trim(),
      address: form.address.trim() || null,
      phone: form.phone.trim() || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message.includes("unique") ? "Branch name already exists" : error.message, variant: "destructive" });
    } else {
      toast({ title: "Branch added", description: `"${form.name}" has been created` });
      setForm({ name: "", address: "", phone: "" });
      setDialogOpen(false);
      fetchBranches();
    }
    setCreating(false);
  };

  const handleDelete = async (branch: Branch) => {
    if (!confirm(`Delete branch "${branch.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("branches").delete().eq("id", branch.id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete branch", variant: "destructive" });
    } else {
      toast({ title: "Branch deleted" });
      fetchBranches();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-display flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Branch Management
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Add and manage your salon branches</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Branch Name *</Label>
                <Input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Downtown, Mall Branch"
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="123 Main St, City"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <Button onClick={handleCreate} disabled={creating} className="w-full">
                {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Branch
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {b.name}
                  </TableCell>
                  <TableCell>
                    {b.address ? (
                      <span className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {b.address}
                      </span>
                    ) : "—"}
                  </TableCell>
                  <TableCell>
                    {b.phone ? (
                      <span className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {b.phone}
                      </span>
                    ) : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(b.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(b)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {branches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No branches yet. Add your first branch above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
