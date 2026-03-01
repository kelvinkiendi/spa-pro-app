import { LoginPage } from "@/components/auth/LoginPage";

const TechLogin = () => (
  <LoginPage
    title="Nail Technician"
    subtitle="View your performance & bookings"
    expectedRole="nail_tech"
    redirectTo="/tech"
    accentColor="bg-sage"
  />
);

export default TechLogin;
