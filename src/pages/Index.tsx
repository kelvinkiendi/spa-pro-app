import { useNavigate } from "react-router-dom";
import { Sparkles, ShieldCheck, Users, Paintbrush } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const roles = [
  {
    title: "Admin",
    description: "Full system management & analytics",
    icon: ShieldCheck,
    path: "/admin-login",
    accent: "bg-primary text-primary-foreground",
  },
  {
    title: "Branch Manager",
    description: "Manage branch operations & staff",
    icon: Users,
    path: "/manager-login",
    accent: "bg-accent text-accent-foreground",
  },
  {
    title: "Nail Technician",
    description: "View bookings & performance",
    icon: Paintbrush,
    path: "/tech-login",
    accent: "bg-secondary text-secondary-foreground",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-4">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">GlowSpa</h1>
          <p className="text-muted-foreground mt-2">Select your portal to sign in</p>
        </div>

        <div className="space-y-4">
          {roles.map((role) => (
            <Card
              key={role.path}
              className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
              onClick={() => navigate(role.path)}
            >
              <CardHeader className="flex-row items-center gap-4 p-5">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${role.accent}`}>
                  <role.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
