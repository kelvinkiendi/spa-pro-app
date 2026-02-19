import { AdminLayout } from "@/components/layout/AdminLayout";

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage branches, services, and system configuration</p>
        </div>
        <div className="rounded-xl bg-card p-12 shadow-card border text-center">
          <p className="text-muted-foreground">System settings including branch management, service configuration, notification preferences, and user permissions will be available after enabling Cloud backend.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
