import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

const ManagerBookings = () => {
  const bookings = [
    { id: 1, client: "Emma W.", tech: "Lisa M.", service: "Gel Manicure", date: "Mar 1, 2026", time: "9:00 AM", status: "Confirmed" },
    { id: 2, client: "Sarah C.", tech: "Maria S.", service: "Pedicure Deluxe", date: "Mar 1, 2026", time: "10:00 AM", status: "Confirmed" },
    { id: 3, client: "Ava R.", tech: "Tina R.", service: "Acrylic Full Set", date: "Mar 1, 2026", time: "11:00 AM", status: "Pending" },
    { id: 4, client: "Mia J.", tech: "Lisa M.", service: "Nail Art", date: "Mar 1, 2026", time: "1:00 PM", status: "Confirmed" },
    { id: 5, client: "Olivia B.", tech: "Jade W.", service: "Full Spa Package", date: "Mar 1, 2026", time: "2:00 PM", status: "Pending" },
  ];

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Bookings</h1>
            <p className="text-muted-foreground mt-1">Add, edit, or remove bookings</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2"><Calendar className="h-4 w-4" />Today</Button>
            <Button className="gradient-primary text-primary-foreground gap-2"><Plus className="h-4 w-4" />New Booking</Button>
          </div>
        </div>

        <div className="rounded-xl bg-card shadow-card border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Client</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Technician</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Service</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Date & Time</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{b.client}</td>
                  <td className="p-4 text-sm text-muted-foreground">{b.tech}</td>
                  <td className="p-4 text-sm text-muted-foreground">{b.service}</td>
                  <td className="p-4 text-sm text-muted-foreground">{b.date} · {b.time}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      b.status === "Confirmed" ? "bg-sage/15 text-sage" : "bg-accent/15 text-accent"
                    }`}>{b.status}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default ManagerBookings;
