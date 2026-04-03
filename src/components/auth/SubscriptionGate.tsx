import { ReactNode } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Lock } from "lucide-react";

interface SubscriptionGateProps {
  children: ReactNode;
  requiredTier?: SubscriptionTier;
  feature?: string;
}

const TIER_ORDER: SubscriptionTier[] = ["individual", "small_salon", "big_spa", "enterprise"];

export function SubscriptionGate({ children, requiredTier = "individual", feature }: SubscriptionGateProps) {
  const { tier, isActive, isLoading } = useSubscription();

  if (isLoading) return null;

  const currentTierIndex = TIER_ORDER.indexOf(tier);
  const requiredTierIndex = TIER_ORDER.indexOf(requiredTier);

  if (isActive && currentTierIndex >= requiredTierIndex) {
    return <>{children}</>;
  }

  const requiredConfig = SUBSCRIPTION_TIERS[requiredTier];

  return (
    <Card className="border-dashed border-2 border-primary/30">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 rounded-full bg-primary/10 p-3 w-fit">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" />
          Upgrade Required
        </CardTitle>
        <CardDescription>
          {feature ? `"${feature}" requires` : "This feature requires"} the{" "}
          <Badge variant="secondary">{requiredConfig.name}</Badge> plan or higher.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-3">
        <p className="text-2xl font-bold text-foreground">
          ${requiredConfig.priceMonthly}<span className="text-sm font-normal text-muted-foreground">/month</span>
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          {requiredConfig.features.map((f) => (
            <li key={f}>✓ {f}</li>
          ))}
        </ul>
        <Button className="w-full">
          Upgrade to {requiredConfig.name}
        </Button>
      </CardContent>
    </Card>
  );
}
