import { TechLayout } from "@/components/layout/TechLayout";
import { useAuth } from "@/hooks/useAuth";

const TechBookings = () => {
  const { fullName } = useAuth();

  const bookings = [
    { client: "Emma W.", service: "Gel Manicure", date: "Mar 1, 2026", time: "9:00 AM", status: "Confirmed" },
    { client: "Sarah C.", service: "Nail Art", date: "Mar 1, 2026", time: "10:30 AM", status: "Confirmed" },
    { client: "Mia J.", service: "Dip Powder", date: "Mar 1, 2026", time: "1:00 PM", status: "Pending" },
    { client: "Chloe D.", service: "Acrylic Fill", date: "Mar 1, 2026", time: "3:00 PM", status: "Confirmed" },
    { client: "Kate M.", service: "Gel Pedicure", date: "Mar 2, 2026", time: "9:30 AM", status: "Pending" },
  ];

  return (
    <TechLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Bookings</h1>
          <p className="text-muted-foreground mt-1">Appointments assigned to you</p>
        </div>

        <div className="rounded-xl bg-card shadow-card border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Client</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Service</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Date & Time</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{b.client}</td>
                  <td className="p-4 text-sm text-muted-foreground">{b.service}</td>
                  <td className="p-4 text-sm text-muted-foreground">{b.date} · {b.time}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      b.status === "Confirmed" ? "bg-sage/15 text-sage" : "bg-accent/15 text-accent"
                    }`}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TechLayout>
  );
};

export default TechBookings;
