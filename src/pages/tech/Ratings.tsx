import { TechLayout } from "@/components/layout/TechLayout";
import { Star } from "lucide-react";

const TechRatings = () => {
  const feedback = [
    { client: "Emma W.", rating: 5, comment: "Amazing work! Love my nails ❤️", date: "Feb 28, 2026", service: "Gel Manicure" },
    { client: "Olivia B.", rating: 4, comment: "Great service, very professional", date: "Feb 26, 2026", service: "Full Spa Package" },
    { client: "Ava R.", rating: 5, comment: "Best nail tech ever!", date: "Feb 24, 2026", service: "Acrylic Full Set" },
    { client: "Sarah C.", rating: 5, comment: "Always consistent quality", date: "Feb 22, 2026", service: "Nail Art" },
    { client: "Mia J.", rating: 4, comment: "Very happy with the result", date: "Feb 20, 2026", service: "Dip Powder" },
  ];

  const avgRating = (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1);

  return (
    <TechLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Ratings & Feedback</h1>
          <p className="text-muted-foreground mt-1">What your clients say about you</p>
        </div>

        <div className="rounded-xl bg-card shadow-card border p-6 flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-display font-bold text-foreground">{avgRating}</p>
            <div className="flex items-center gap-1 mt-1 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(Number(avgRating)) ? "text-accent fill-accent" : "text-muted-foreground"}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{feedback.length} reviews</p>
          </div>
        </div>

        <div className="space-y-3">
          {feedback.map((f, i) => (
            <div key={i} className="rounded-xl bg-card shadow-card border p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-foreground">{f.client}</span>
                  <span className="text-xs text-muted-foreground ml-2">· {f.service}</span>
                </div>
                <span className="text-xs text-muted-foreground">{f.date}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`h-3.5 w-3.5 ${j < f.rating ? "text-accent fill-accent" : "text-muted-foreground"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{f.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </TechLayout>
  );
};

export default TechRatings;
