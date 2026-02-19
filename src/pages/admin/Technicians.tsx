import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Star, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";

const technicians = [
  { name: "Lisa Martinez", specialty: "Gel & Nail Art", rating: 4.9, appointments: 148, commission: 35, revenue: "$12,400", status: "active", avatar: "L" },
  { name: "Maria Santos", specialty: "Pedicure Specialist", rating: 4.8, appointments: 132, commission: 30, revenue: "$10,800", status: "active", avatar: "M" },
  { name: "Tina Rodriguez", specialty: "Acrylic & Extensions", rating: 4.7, appointments: 118, commission: 35, revenue: "$11,200", status: "active", avatar: "T" },
  { name: "Jade Williams", specialty: "Spa Treatments", rating: 4.9, appointments: 96, commission: 30, revenue: "$8,600", status: "on-leave", avatar: "J" },
  { name: "Amy Lee", specialty: "Dip Powder Expert", rating: 4.6, appointments: 104, commission: 32, revenue: "$9,100", status: "active", avatar: "A" },
];

const Technicians = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Nail Technicians</h1>
            <p className="text-muted-foreground mt-1">Manage your team and track performance</p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />
            Add Technician
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search technicians..." className="pl-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {technicians.map((tech, i) => (
            <div key={i} className="rounded-xl bg-card p-5 shadow-card border hover:shadow-elevated transition-shadow animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                    {tech.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{tech.name}</h3>
                    <p className="text-xs text-muted-foreground">{tech.specialty}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Star className="h-4 w-4 text-accent fill-accent" />
                <span className="text-sm font-medium text-card-foreground">{tech.rating}</span>
                <span className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  tech.status === "active" ? "bg-sage-light text-sage" : "bg-champagne text-accent"
                }`}>
                  {tech.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t">
                <div className="text-center">
                  <p className="text-lg font-display font-bold text-card-foreground">{tech.appointments}</p>
                  <p className="text-[10px] text-muted-foreground">Services</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-display font-bold text-card-foreground">{tech.commission}%</p>
                  <p className="text-[10px] text-muted-foreground">Commission</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-display font-bold text-primary">{tech.revenue}</p>
                  <p className="text-[10px] text-muted-foreground">Revenue</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Technicians;
