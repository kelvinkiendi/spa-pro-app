import { TechLayout } from "@/components/layout/TechLayout";

const TechSales = () => {
  const sales = [
    { client: "Emma W.", service: "Gel Manicure", amount: "KES 2,500", date: "Mar 1, 2026" },
    { client: "Sarah C.", service: "Nail Art", amount: "KES 3,000", date: "Feb 28, 2026" },
    { client: "Olivia B.", service: "Full Spa Package", amount: "KES 5,500", date: "Feb 27, 2026" },
    { client: "Ava R.", service: "Acrylic Full Set", amount: "KES 4,000", date: "Feb 26, 2026" },
    { client: "Mia J.", service: "Dip Powder", amount: "KES 3,500", date: "Feb 25, 2026" },
  ];

  return (
    <TechLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Sales & Services</h1>
          <p className="text-muted-foreground mt-1">Your completed services and revenue</p>
        </div>

        <div className="rounded-xl bg-card shadow-card border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Client</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Service</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{s.client}</td>
                  <td className="p-4 text-sm text-muted-foreground">{s.service}</td>
                  <td className="p-4 text-sm font-semibold text-foreground">{s.amount}</td>
                  <td className="p-4 text-sm text-muted-foreground">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TechLayout>
  );
};

export default TechSales;
