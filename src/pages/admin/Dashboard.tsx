import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Scissors,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { name: "Mon", revenue: 2400 },
  { name: "Tue", revenue: 1398 },
  { name: "Wed", revenue: 3200 },
  { name: "Thu", revenue: 2780 },
  { name: "Fri", revenue: 4890 },
  { name: "Sat", revenue: 6390 },
  { name: "Sun", revenue: 3490 },
];

const serviceData = [
  { name: "Gel Manicure", count: 45 },
  { name: "Pedicure", count: 38 },
  { name: "Acrylic Full", count: 32 },
  { name: "Nail Art", count: 28 },
  { name: "Dip Powder", count: 22 },
];

const upcomingBookings = [
  { client: "Emma Wilson", service: "Gel Manicure", tech: "Lisa", time: "10:00 AM", status: "confirmed" },
  { client: "Sarah Chen", service: "Pedicure Deluxe", tech: "Maria", time: "10:30 AM", status: "confirmed" },
  { client: "Ava Rodriguez", service: "Acrylic Full Set", tech: "Tina", time: "11:00 AM", status: "pending" },
  { client: "Mia Johnson", service: "Nail Art Design", tech: "Lisa", time: "11:30 AM", status: "confirmed" },
  { client: "Olivia Brown", service: "Dip Powder", tech: "Jade", time: "12:00 PM", status: "confirmed" },
];

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Good Morning, Admin ✨
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening at your spa today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Today's Revenue"
            value="$2,840"
            change="+12.5% from yesterday"
            changeType="positive"
            icon={DollarSign}
          />
          <StatCard
            title="Appointments"
            value="24"
            change="6 remaining today"
            changeType="neutral"
            icon={Calendar}
          />
          <StatCard
            title="Active Clients"
            value="1,284"
            change="+48 this month"
            changeType="positive"
            icon={Users}
          />
          <StatCard
            title="Avg. Service Time"
            value="52 min"
            change="-3 min vs last week"
            changeType="positive"
            icon={Clock}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 rounded-xl bg-card p-6 shadow-card border">
            <h3 className="font-display font-semibold text-lg text-card-foreground mb-4">
              Weekly Revenue
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(350, 55%, 55%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(350, 55%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 90%)" />
                <XAxis dataKey="name" stroke="hsl(20, 10%, 50%)" fontSize={12} />
                <YAxis stroke="hsl(20, 10%, 50%)" fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(350, 55%, 55%)"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Services */}
          <div className="rounded-xl bg-card p-6 shadow-card border">
            <h3 className="font-display font-semibold text-lg text-card-foreground mb-4">
              Popular Services
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={serviceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 90%)" />
                <XAxis type="number" stroke="hsl(20, 10%, 50%)" fontSize={12} />
                <YAxis dataKey="name" type="category" width={90} stroke="hsl(20, 10%, 50%)" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(25, 60%, 65%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="rounded-xl bg-card p-6 shadow-card border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-card-foreground">
              Today's Appointments
            </h3>
            <a href="/admin/bookings" className="text-sm text-primary font-medium hover:underline">
              View All →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Service</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Technician</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBookings.map((booking, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-card-foreground">{booking.client}</td>
                    <td className="py-3 px-4 text-muted-foreground">{booking.service}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-2">
                        <Scissors className="h-3.5 w-3.5 text-primary" />
                        {booking.tech}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{booking.time}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          booking.status === "confirmed"
                            ? "bg-sage-light text-sage"
                            : "bg-champagne text-accent"
                        }`}
                      >
                        {booking.status}
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

export default Dashboard;
