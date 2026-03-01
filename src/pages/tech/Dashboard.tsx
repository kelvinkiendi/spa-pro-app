import { TechLayout } from "@/components/layout/TechLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DollarSign, Calendar, Star, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const TechDashboard = () => {
  const { fullName } = useAuth();

  return (
    <TechLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Welcome, {fullName ?? "Technician"}
          </h1>
          <p className="text-muted-foreground mt-1">Your performance overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Commission" value="KES 24,500" icon={DollarSign} change="+12%" changeType="positive" />
          <StatCard title="Total Tips" value="KES 3,200" icon={TrendingUp} change="+5%" changeType="positive" />
          <StatCard title="Today's Bookings" value="4" icon={Calendar} />
          <StatCard title="Rating" value="4.8 ★" icon={Star} change="Based on 47 reviews" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-card shadow-card border p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Today's Appointments</h2>
            <div className="space-y-3">
              {[
                { time: "9:00 AM", client: "Emma W.", service: "Gel Manicure", status: "Completed" },
                { time: "10:30 AM", client: "Sarah C.", service: "Nail Art", status: "In Progress" },
                { time: "1:00 PM", client: "Mia J.", service: "Dip Powder", status: "Upcoming" },
                { time: "3:00 PM", client: "Chloe D.", service: "Acrylic Fill", status: "Upcoming" },
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-20">{a.time}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{a.client}</p>
                      <p className="text-xs text-muted-foreground">{a.service}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    a.status === "Completed" ? "bg-sage/15 text-sage" :
                    a.status === "In Progress" ? "bg-accent/15 text-accent" :
                    "bg-primary/15 text-primary"
                  }`}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-card shadow-card border p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Recent Feedback</h2>
            <div className="space-y-3">
              {[
                { client: "Emma W.", rating: 5, comment: "Amazing work! Love my nails ❤️", date: "Feb 28" },
                { client: "Olivia B.", rating: 4, comment: "Great service, very professional", date: "Feb 26" },
                { client: "Ava R.", rating: 5, comment: "Best nail tech ever!", date: "Feb 24" },
              ].map((f, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-foreground">{f.client}</span>
                    <span className="text-xs text-muted-foreground">{f.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`h-3 w-3 ${j < f.rating ? "text-accent fill-accent" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{f.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TechLayout>
  );
};

export default TechDashboard;
