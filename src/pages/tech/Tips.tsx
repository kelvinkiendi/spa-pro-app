import { TechLayout } from "@/components/layout/TechLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Banknote, TrendingUp, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/hooks/useAppSettings";

const TechTips = () => {
  const { fullName } = useAuth();
  const { settings } = useAppSettings();
  const currency = settings.currency || "KES";

  // Tips tracking placeholder - will be connected to a tips table later
  return (
    <TechLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Tips Tracker</h1>
          <p className="text-muted-foreground mt-1">Track your tips and gratuities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="This Month" value={`${currency} 0`} icon={Banknote} />
          <StatCard title="Year to Date" value={`${currency} 0`} icon={TrendingUp} />
          <StatCard title="Total Tips" value="0" icon={Calendar} />
        </div>

        <div className="rounded-xl glass-card shadow-card p-8 text-center">
          <Banknote className="h-12 w-12 mx-auto text-primary/40 mb-4" />
          <h3 className="font-display font-semibold text-foreground mb-2">Tips Recording Coming Soon</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Your tips will be tracked here once the billing system is set up. You'll be able to log cash, M-Pesa, and card tips.
          </p>
        </div>
      </div>
    </TechLayout>
  );
};

export default TechTips;