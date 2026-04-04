import { TechLayout } from "@/components/layout/TechLayout";
import { Star } from "lucide-react";

const TechRatings = () => {
  // Placeholder - will connect to a ratings/reviews table later
  return (
    <TechLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Ratings & Feedback</h1>
          <p className="text-muted-foreground mt-1">What your clients say about you</p>
        </div>

        <div className="rounded-xl glass-card shadow-card p-8 text-center">
          <Star className="h-12 w-12 mx-auto text-primary/40 mb-4" />
          <h3 className="font-display font-semibold text-foreground mb-2">Client Reviews Coming Soon</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Once clients can leave feedback through the booking system, your ratings and reviews will appear here.
          </p>
        </div>
      </div>
    </TechLayout>
  );
};

export default TechRatings;