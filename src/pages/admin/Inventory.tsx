import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, AlertTriangle, Package as PackageIcon } from "lucide-react";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Inventory = () => {
  const { selectedBranch } = useBranchFilter();

  const { data: inventory = [] } = useQuery({
    queryKey: ["inventory", selectedBranch],
    queryFn: async () => {
      let q = supabase.from("inventory").select("*").order("name");
      if (selectedBranch && selectedBranch !== "all") {
        q = q.eq("branch", selectedBranch);
      }
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const lowStockCount = inventory.filter((i) => i.stock <= i.min_stock).length;

  const getStatus = (item: typeof inventory[0]) => {
    if (item.stock <= Math.floor(item.min_stock * 0.3)) return "critical";
    if (item.stock <= item.min_stock) return "low";
    return "ok";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Inventory</h1>
            <p className="text-muted-foreground mt-1">Track stock levels and manage supplies</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Export Report</Button>
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {lowStockCount > 0 && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Low Stock Alert</p>
              <p className="text-xs text-muted-foreground">{lowStockCount} item(s) below minimum stock levels.</p>
            </div>
          </div>
        )}

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="pl-10" />
        </div>

        <div className="rounded-xl bg-card shadow-card border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Min. Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Unit Price</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Supplier</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Branch</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      No inventory items found.
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => {
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
                        <td className="py-3 px-4 text-card-foreground">${Number(item.unit_price).toFixed(2)}</td>
                        <td className="py-3 px-4 text-muted-foreground">{item.supplier || "—"}</td>
                        <td className="py-3 px-4 text-muted-foreground">{item.branch}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            status === "ok" ? "bg-sage-light text-sage" :
                            status === "low" ? "bg-champagne text-accent" :
                            "bg-destructive/10 text-destructive"
                          }`}>
                            {status === "ok" ? "In Stock" : status === "low" ? "Low Stock" : "Critical"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Inventory;
