import { Button } from "@/components/ui/button";
import type { Booking } from "@/hooks/useBookings";
import { format } from "date-fns";

interface BookingsTableProps {
  bookings: Booking[];
  showTech?: boolean;
  showActions?: boolean;
}

export function BookingsTable({ bookings, showTech = true, showActions = false }: BookingsTableProps) {
  const statusClass = (s: string) =>
    s === "confirmed" ? "bg-sage/15 text-sage" : s === "cancelled" ? "bg-destructive/15 text-destructive" : "bg-accent/15 text-accent";

  return (
    <div className="rounded-xl bg-card shadow-card border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Client</th>
            {showTech && <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Technician</th>}
            <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Service</th>
            <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Date & Time</th>
            <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
            {showActions && <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 && (
            <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No bookings yet</td></tr>
          )}
          {bookings.map((b) => (
            <tr key={b.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
              <td className="p-4 text-sm font-medium text-foreground">{b.client_name}</td>
              {showTech && <td className="p-4 text-sm text-muted-foreground">{b.tech_name}</td>}
              <td className="p-4 text-sm text-muted-foreground">{b.service}</td>
              <td className="p-4 text-sm text-muted-foreground">
                {format(new Date(b.booking_date), "MMM d, yyyy")} · {b.booking_time.slice(0, 5)}
              </td>
              <td className="p-4">
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusClass(b.status)}`}>{b.status}</span>
              </td>
              {showActions && (
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
