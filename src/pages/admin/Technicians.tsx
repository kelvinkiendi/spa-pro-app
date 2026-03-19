import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useBranches } from "@/hooks/useBranches";
import { useBranchFilter } from "@/contexts/BranchFilterContext";

interface TechUser {
  id: string;
  email: string;
  full_name: string;
  branch: string;
  created_at: string;
}

const Technicians = () => {
  const [techs, setTechs] = useState<TechUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const { branches, branchNames } = useBranches();
  const { selectedBranch } = useBranchFilter();
  const [form, setForm] = useState({ email: "", password: "", full_name: "", branch: "" });

  useEffect(() => {
    if (branchNames.length > 0 && !form.branch) {
      setForm((f) => ({ ...f, branch: branchNames[0] }));
    }
  }, [branchNames]);

  const fetchTechs = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase.functions.invoke("manage-users", {
        body: { action: "list" },
      });
      if (error) throw error;
      const nailTechs = (data.users || []).filter((u: any) => u.role === "nail_tech");
      setTechs(nailTechs);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTechs(); }, []);

  const handleCreate = async () => {
    if (!form.email || !form.password || !form.full_name || !form.branch) {
      toast({ title: "Missing fields", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke("manage-users", {
        body: { action: "create", ...form, role: "nail_tech" },
      });
      if (error) throw error;
      toast({ title: "Technician added", description: `${form.full_name} has been added` });
      setForm({ email: "", password: "", full_name: "", branch: branchNames[0] || "" });
      setDialogOpen(false);
      fetchTechs();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (tech: TechUser) => {
    try {
      const { error } = await supabase.functions.invoke("manage-users", {
        body: { action: "delete", user_id: tech.id },
      });
      if (error) throw error;
      toast({ title: "Removed", description: `${tech.full_name} has been removed` });
      fetchTechs();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const filtered = techs
    .filter(t =>
      t.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(t => !selectedBranch || selectedBranch === "all" || t.branch === selectedBranch);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Nail Technicians</h1>
            <p className="text-muted-foreground mt-1">Manage your team</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2">
                <Plus className="h-4 w-4" />Add Technician
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Nail Technician</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="e.g. Lisa Martinez" />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="lisa@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Password *</Label>
                  <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Minimum 6 characters" />
                </div>
                <div className="space-y-2">
                  <Label>Branch *</Label>
                  <Select value={form.branch} onValueChange={v => setForm(f => ({ ...f, branch: v }))} disabled={branchNames.length === 0}>
                    <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                    <SelectContent>
                      {branchNames.map((name) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full gradient-primary text-primary-foreground" onClick={handleCreate} disabled={creating}>
                  {creating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Add Technician
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search technicians..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No technicians found. Add one to get started.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((tech) => (
              <div key={tech.id} className="rounded-xl bg-card p-5 shadow-card border hover:shadow-elevated transition-shadow animate-fade-in">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                      {tech.full_name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">{tech.full_name}</h3>
                      <p className="text-xs text-muted-foreground">{tech.email}</p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove {tech.full_name}?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete this technician's account.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(tech)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Branch</p>
                    <p className="text-sm font-medium text-card-foreground capitalize">{tech.branch || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Joined</p>
                    <p className="text-sm font-medium text-card-foreground">{new Date(tech.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Technicians;
