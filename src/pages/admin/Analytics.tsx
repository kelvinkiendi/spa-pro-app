import { AdminLayout } from "@/components/layout/AdminLayout";

const Analytics = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep insights into your spa performance</p>
        </div>
        <div className="rounded-xl bg-card p-12 shadow-card border text-center">
          <p className="text-muted-foreground">Advanced analytics with revenue trends, staff performance, service popularity, and customer retention will be powered by your database. Enable Cloud to get started.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
