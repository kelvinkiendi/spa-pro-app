import { TechLayout } from "@/components/layout/TechLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { DollarSign, TrendingUp, Percent } from "lucide-react";

const TechCommission = () => {
  const commissionBreakdown = [
    { service: "Gel Manicure", rate: "30%", earned: "KES 7,500", count: 10 },
    { service: "Nail Art", rate: "35%", earned: "KES 5,250", count: 5 },
    { service: "Acrylic Full Set", rate: "25%", earned: "KES 4,000", count: 4 },
    { service: "Dip Powder", rate: "30%", earned: "KES 4,200", count: 4 },
    { service: "Full Spa Package", rate: "20%", earned: "KES 3,300", count: 3 },
  ];

  return (
    <TechLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Commission</h1>
          <p className="text-muted-foreground mt-1">Your commission rates and earnings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Commission (Feb)" value="KES 24,250" icon={DollarSign} change="+12% vs Jan" changeType="positive" />
          <StatCard title="Total Tips (Feb)" value="KES 3,200" icon={TrendingUp} change="+5% vs Jan" changeType="positive" />
          <StatCard title="Avg. Commission Rate" value="28%" icon={Percent} />
        </div>

        <div className="rounded-xl bg-card shadow-card border overflow-hidden">
          <div className="p-4 border-b bg-muted/30">
            <h2 className="font-display font-semibold">Commission Breakdown</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/10">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Service</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Rate</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Services Done</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Earned</th>
              </tr>
            </thead>
            <tbody>
              {commissionBreakdown.map((c, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{c.service}</td>
                  <td className="p-4"><span className="text-xs bg-accent/15 text-accent px-2 py-1 rounded-full">{c.rate}</span></td>
                  <td className="p-4 text-sm text-muted-foreground">{c.count}</td>
                  <td className="p-4 text-sm font-semibold text-foreground">{c.earned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TechLayout>
  );
};

export default TechCommission;
