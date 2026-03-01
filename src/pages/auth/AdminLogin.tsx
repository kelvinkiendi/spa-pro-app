import { LoginPage } from "@/components/auth/LoginPage";

const AdminLogin = () => (
  <LoginPage
    title="Admin Portal"
    subtitle="GlowSpa management access"
    expectedRole="admin"
    redirectTo="/admin"
    accentColor="gradient-primary"
  />
);

export default AdminLogin;
