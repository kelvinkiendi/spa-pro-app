import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, AlertTriangle, Package as PackageIcon } from "lucide-react";

const inventory = [
  { name: "OPI GelColor - Red", category: "Gel Polish", stock: 24, minStock: 10, price: "$12.50", supplier: "OPI Inc.", status: "ok" },
  { name: "Acrylic Powder - Clear", category: "Acrylic", stock: 8, minStock: 15, price: "$18.00", supplier: "Young Nails", status: "low" },
  { name: "Nail Tips - Coffin 500pc", category: "Tips", stock: 45, minStock: 20, price: "$8.99", supplier: "Makartt", status: "ok" },
  { name: "Cuticle Oil 4oz", category: "Care", stock: 3, minStock: 10, price: "$6.50", supplier: "CND", status: "critical" },
  { name: "Dip Powder - French White", category: "Dip Powder", stock: 18, minStock: 10, price: "$14.00", supplier: "SNS", status: "ok" },
  { name: "UV/LED Lamp Bulbs", category: "Equipment", stock: 5, minStock: 8, price: "$22.00", supplier: "SunUV", status: "low" },
  { name: "Nail File 100/180 50pc", category: "Tools", stock: 32, minStock: 20, price: "$12.00", supplier: "Supernail", status: "ok" },
  { name: "Base Coat Gel 15ml", category: "Gel Polish", stock: 2, minStock: 10, price: "$9.50", supplier: "Gelish", status: "critical" },
];

const Inventory = () => {
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

        {/* Low Stock Alert */}
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <div>
            <p className="text-sm font-medium text-destructive">Low Stock Alert</p>
            <p className="text-xs text-muted-foreground">4 items are below minimum stock levels and need reordering.</p>
          </div>
        </div>

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
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <PackageIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-card-foreground">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{item.category}</td>
                    <td className="py-3 px-4 font-medium text-card-foreground">{item.stock}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.minStock}</td>
                    <td className="py-3 px-4 text-card-foreground">{item.price}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.supplier}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.status === "ok" ? "bg-sage-light text-sage" :
                        item.status === "low" ? "bg-champagne text-accent" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {item.status === "ok" ? "In Stock" : item.status === "low" ? "Low Stock" : "Critical"}
                      </span>
                    </td>
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

export default Inventory;
