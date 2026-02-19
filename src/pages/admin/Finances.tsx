import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DollarSign, TrendingUp, TrendingDown, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlyRevenue = [
  { month: "Sep", revenue: 28400 },
  { month: "Oct", revenue: 31200 },
  { month: "Nov", revenue: 29800 },
  { month: "Dec", revenue: 42100 },
  { month: "Jan", revenue: 35600 },
  { month: "Feb", revenue: 38900 },
];

const expenseBreakdown = [
  { name: "Payroll", value: 45, color: "hsl(350, 55%, 55%)" },
  { name: "Supplies", value: 25, color: "hsl(25, 60%, 65%)" },
  { name: "Rent", value: 18, color: "hsl(150, 20%, 60%)" },
  { name: "Utilities", value: 7, color: "hsl(350, 40%, 70%)" },
  { name: "Other", value: 5, color: "hsl(30, 20%, 90%)" },
];

const recentTransactions = [
  { description: "Gel Manicure - Emma W.", amount: "+$65.00", type: "income", date: "Today" },
  { description: "Pedicure Deluxe - Sarah C.", amount: "+$85.00", type: "income", date: "Today" },
  { description: "OPI Supplies Reorder", amount: "-$340.00", type: "expense", date: "Yesterday" },
  { description: "Acrylic Full Set - Ava R.", amount: "+$120.00", type: "income", date: "Yesterday" },
  { description: "Equipment Maintenance", amount: "-$180.00", type: "expense", date: "Feb 17" },
];

const Finances = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Finances</h1>
            <p className="text-muted-foreground mt-1">Revenue tracking and expense management</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Export CSV</Button>
            <Button variant="outline">Export PDF</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Monthly Revenue" value="$38,900" change="+9.3% vs last month" changeType="positive" icon={DollarSign} />
          <StatCard title="Monthly Expenses" value="$18,200" change="+2.1% vs last month" changeType="negative" icon={TrendingDown} />
          <StatCard title="Net Profit" value="$20,700" change="+15.8% vs last month" changeType="positive" icon={TrendingUp} />
          <StatCard title="Transactions" value="342" change="This month" changeType="neutral" icon={Receipt} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl bg-card p-6 shadow-card border">
            <h3 className="font-display font-semibold text-lg text-card-foreground mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(350, 55%, 55%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(350, 55%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 90%)" />
                <XAxis dataKey="month" stroke="hsl(20, 10%, 50%)" fontSize={12} />
                <YAxis stroke="hsl(20, 10%, 50%)" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="hsl(350, 55%, 55%)" strokeWidth={2} fill="url(#finGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl bg-card p-6 shadow-card border">
            <h3 className="font-display font-semibold text-lg text-card-foreground mb-4">Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {expenseBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {expenseBreakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-card-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-xl bg-card p-6 shadow-card border">
          <h3 className="font-display font-semibold text-lg text-card-foreground mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <span className={`text-sm font-semibold ${tx.type === "income" ? "text-sage" : "text-destructive"}`}>
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Finances;
