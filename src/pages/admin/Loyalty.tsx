import { AdminLayout } from "@/components/layout/AdminLayout";
import { Gift, Star, Users, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

const tiers = [
  { name: "Bronze", minPoints: 0, color: "bg-amber-700/10 text-amber-700 border-amber-700/20", members: 284, perks: "5% off services" },
  { name: "Silver", minPoints: 500, color: "bg-gray-400/10 text-gray-500 border-gray-400/20", members: 142, perks: "10% off + free nail art" },
  { name: "Gold", minPoints: 1000, color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", members: 68, perks: "15% off + priority booking" },
  { name: "Platinum", minPoints: 2000, color: "bg-purple-400/10 text-purple-500 border-purple-400/20", members: 24, perks: "20% off + free upgrades" },
];

const Loyalty = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Loyalty Program</h1>
          <p className="text-muted-foreground mt-1">Manage reward tiers and track client loyalty</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Members" value="518" change="+32 this month" changeType="positive" icon={Users} />
          <StatCard title="Points Issued" value="24,800" change="This month" changeType="neutral" icon={Star} />
          <StatCard title="Points Redeemed" value="8,400" change="+18% vs last month" changeType="positive" icon={Gift} />
          <StatCard title="Retention Rate" value="78%" change="+4% vs last month" changeType="positive" icon={TrendingUp} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier, i) => (
            <div key={i} className={`rounded-xl border p-5 shadow-card ${tier.color}`}>
              <h3 className="font-display font-bold text-xl">{tier.name}</h3>
              <p className="text-xs mt-1 opacity-70">{tier.minPoints}+ points</p>
              <p className="text-2xl font-display font-bold mt-4">{tier.members}</p>
              <p className="text-xs opacity-70">members</p>
              <div className="mt-4 pt-3 border-t border-current/10">
                <p className="text-xs font-medium">{tier.perks}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Loyalty;
