import { LoginPage } from "@/components/auth/LoginPage";

const ManagerLogin = () => (
  <LoginPage
    title="Branch Manager"
    subtitle="Manage your branch operations"
    expectedRole="branch_manager"
    redirectTo="/manager"
    accentColor="bg-accent"
    showBranchSelect
  />
);

export default ManagerLogin;
