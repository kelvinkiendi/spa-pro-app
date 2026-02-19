import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useState } from "react";

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
  "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
];

const techs = ["Lisa M.", "Maria S.", "Tina R.", "Jade W.", "Amy L."];

const bookings = [
  { tech: 0, startSlot: 2, duration: 3, client: "Emma W.", service: "Gel Manicure", color: "bg-primary/15 text-primary border-primary/30" },
  { tech: 1, startSlot: 0, duration: 4, client: "Sarah C.", service: "Pedicure Deluxe", color: "bg-accent/15 text-accent border-accent/30" },
  { tech: 2, startSlot: 4, duration: 3, client: "Ava R.", service: "Acrylic Full Set", color: "bg-sage/15 text-sage border-sage/30" },
  { tech: 0, startSlot: 6, duration: 2, client: "Mia J.", service: "Nail Art", color: "bg-rose-gold/15 text-rose-gold border-rose-gold/30" },
  { tech: 3, startSlot: 2, duration: 5, client: "Olivia B.", service: "Full Spa Package", color: "bg-primary/15 text-primary border-primary/30" },
  { tech: 4, startSlot: 1, duration: 3, client: "Chloe D.", service: "Dip Powder", color: "bg-accent/15 text-accent border-accent/30" },
];

const Bookings = () => {
  const [view, setView] = useState<"day" | "week">("day");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Bookings</h1>
            <p className="text-muted-foreground mt-1">Manage appointments and schedule</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg bg-muted p-1">
              <button
                onClick={() => setView("day")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "day" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                Day
              </button>
              <button
                onClick={() => setView("week")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "week" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                Week
              </button>
            </div>
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              New Booking
            </Button>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-display font-semibold text-lg">Wednesday, Feb 19, 2026</span>
          </div>
          <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm">Today</Button>
        </div>

        {/* Calendar Grid */}
        <div className="rounded-xl bg-card shadow-card border overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Tech Headers */}
              <div className="grid border-b" style={{ gridTemplateColumns: `80px repeat(${techs.length}, 1fr)` }}>
                <div className="p-3 border-r bg-muted/30">
                  <Clock className="h-4 w-4 text-muted-foreground mx-auto" />
                </div>
                {techs.map((tech, i) => (
                  <div key={i} className="p-3 text-center border-r last:border-r-0 bg-muted/30">
                    <div className="h-8 w-8 rounded-full gradient-gold flex items-center justify-center text-xs font-bold mx-auto mb-1 text-foreground">
                      {tech.charAt(0)}
                    </div>
                    <p className="text-xs font-medium text-card-foreground">{tech}</p>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots.map((time, slotIndex) => (
                <div
                  key={slotIndex}
                  className="grid border-b last:border-0"
                  style={{ gridTemplateColumns: `80px repeat(${techs.length}, 1fr)` }}
                >
                  <div className="p-2 text-xs text-muted-foreground border-r flex items-center justify-center">
                    {time}
                  </div>
                  {techs.map((_, techIndex) => {
                    const booking = bookings.find(
                      (b) => b.tech === techIndex && b.startSlot === slotIndex
                    );
                    const isOccupied = bookings.some(
                      (b) =>
                        b.tech === techIndex &&
                        slotIndex > b.startSlot &&
                        slotIndex < b.startSlot + b.duration
                    );

                    if (isOccupied) return <div key={techIndex} className="border-r last:border-r-0" />;

                    return (
                      <div key={techIndex} className="p-1 border-r last:border-r-0 min-h-[44px]">
                        {booking && (
                          <div
                            className={`rounded-lg border p-2 ${booking.color} cursor-pointer hover:shadow-sm transition-shadow`}
                            style={{ height: `${booking.duration * 44 - 8}px` }}
                          >
                            <p className="text-xs font-semibold truncate">{booking.client}</p>
                            <p className="text-[10px] opacity-75 truncate">{booking.service}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Bookings;
