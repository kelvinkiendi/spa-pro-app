import { useState, useEffect } from "react";
import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, AlertTriangle, Package as PackageIcon, Minus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  min_stock: number;
  unit_price: number;
  supplier: string | null;
  branch: string;
}

interface UsageLog {
  id: string;
  quantity_used: number;
  used_by: string;
  reason: string | null;
  created_at: string;
}

const ManagerInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [usageDialogOpen, setUsageDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [usageForm, setUsageForm] = useState({ quantity: "1", used_by: "", reason: "" });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    const { data, error } = await supabase.from("inventory").select("*").order("name");
    if (!error) setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openUsageDialog = async (item: InventoryItem) => {
    setSelectedItem(item);
    setUsageForm({ quantity: "1", used_by: "", reason: "" });
    setUsageDialogOpen(true);
    const { data } = await supabase
      .from("inventory_usage")
      .select("*")
      .eq("inventory_id", item.id)
      .order("created_at", { ascending: false })
      .limit(10);
    setUsageLogs(data || []);
  };

  const handleLogUsage = async () => {
    if (!selectedItem || !usageForm.used_by || !usageForm.quantity) {
      toast({ title: "Fill required fields", variant: "destructive" });
      return;
    }
    const qty = parseInt(usageForm.quantity);
    if (isNaN(qty) || qty < 1) {
      toast({ title: "Invalid quantity", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error: insertErr } = await supabase.from("inventory_usage").insert({
      inventory_id: selectedItem.id,
      quantity_used: qty,
      used_by: usageForm.used_by,
      reason: usageForm.reason || null,
    });
    if (insertErr) {
      toast({ title: "Error", description: insertErr.message, variant: "destructive" });
      setSaving(false);
      return;
    }
    // Decrease stock
    await supabase.from("inventory").update({ stock: selectedItem.stock - qty }).eq("id", selectedItem.id);
    toast({ title: "Usage logged", description: `${qty} × ${selectedItem.name} recorded` });
    setUsageDialogOpen(false);
    fetchItems();
    setSaving(false);
  };

  const lowStockCount = items.filter(i => i.stock <= i.min_stock).length;
  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()));

  const getStatus = (item: InventoryItem) => {
    if (item.stock <= item.min_stock * 0.3) return "critical";
    if (item.stock <= item.min_stock) return "low";
    return "ok";
  };

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground mt-1">Track stock levels and log usage</p>
        </div>

        {lowStockCount > 0 && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Low Stock Alert</p>
              <p className="text-xs text-muted-foreground">{lowStockCount} item(s) are below minimum stock levels.</p>
            </div>
          </div>
        )}

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="rounded-xl bg-card shadow-card border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Min.</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No inventory items</td></tr>
                  ) : filtered.map((item) => {
                    const status = getStatus(item);
                    return (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <PackageIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-card-foreground">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{item.category}</td>
                        <td className="py-3 px-4 font-medium text-card-foreground">{item.stock}</td>
                        <td className="py-3 px-4 text-muted-foreground">{item.min_stock}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            status === "ok" ? "bg-sage-light text-sage" :
                            status === "low" ? "bg-champagne text-accent" :
                            "bg-destructive/10 text-destructive"
                          }`}>
                            {status === "ok" ? "In Stock" : status === "low" ? "Low Stock" : "Critical"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => openUsageDialog(item)}>
                            <Minus className="h-3 w-3" />Log Usage
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Dialog open={usageDialogOpen} onOpenChange={setUsageDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Log Usage — {selectedItem?.name}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Quantity Used *</Label>
                <Input type="number" min="1" value={usageForm.quantity} onChange={e => setUsageForm(f => ({ ...f, quantity: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Used By *</Label>
                <Input value={usageForm.used_by} onChange={e => setUsageForm(f => ({ ...f, used_by: e.target.value }))} placeholder="Tech name" />
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <Input value={usageForm.reason} onChange={e => setUsageForm(f => ({ ...f, reason: e.target.value }))} placeholder="e.g. Client service" />
              </div>
              <Button className="w-full gradient-primary text-primary-foreground" onClick={handleLogUsage} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Log Usage
              </Button>
              {usageLogs.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Recent Usage</p>
                  {usageLogs.map(log => (
                    <div key={log.id} className="flex justify-between text-xs py-1.5 border-b last:border-0">
                      <span className="text-card-foreground">{log.used_by} — {log.quantity_used} units</span>
                      <span className="text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ManagerLayout>
  );
};

export default ManagerInventory;
