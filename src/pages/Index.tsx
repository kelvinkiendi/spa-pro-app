import { useNavigate } from "react-router-dom";
import { Sparkles, Crown, Shield, Scissors, Phone } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppSettings } from "@/hooks/useAppSettings";

const roles = [
  {
    title: "Owner",
    description: "Full system management & analytics",
    icon: Crown,
    path: "/admin-login",
    gradient: "from-primary/20 to-primary/5",
    borderHover: "hover:border-primary/40",
    shadowHover: "hover:shadow-gold",
    iconBg: "gradient-primary",
  },
  {
    title: "Branch Manager",
    description: "Manage branch operations & staff",
    icon: Shield,
    path: "/manager-login",
    gradient: "from-accent/15 to-accent/5",
    borderHover: "hover:border-accent/40",
    shadowHover: "hover:shadow-[0_4px_20px_-4px_hsl(160,50%,45%,0.25)]",
    iconBg: "gradient-emerald",
  },
  {
    title: "Staff",
    description: "View bookings, sales & performance",
    icon: Scissors,
    path: "/tech-login",
    gradient: "from-secondary to-secondary/50",
    borderHover: "hover:border-muted-foreground/30",
    shadowHover: "hover:shadow-elevated",
    iconBg: "bg-secondary",
  },
  {
    title: "Receptionist",
    description: "Calendar, check-ins & client management",
    icon: Phone,
    path: "/tech-login",
    gradient: "from-rose/15 to-rose/5",
    borderHover: "hover:border-rose/40",
    shadowHover: "hover:shadow-[0_4px_20px_-4px_hsl(350,55%,55%,0.25)]",
    iconBg: "bg-rose",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-background overflow-hidden">
      {/* Animated floating orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 rounded-full bg-primary/3 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary mb-4 overflow-hidden shadow-gold">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.app_name} className="h-full w-full object-contain" />
            ) : (
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            )}
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">{settings.app_name}</h1>
          <p className="text-muted-foreground mt-2 text-lg">Select your portal to sign in</p>
        </div>

        <div className="space-y-3">
          {roles.map((role) => (
            <Card
              key={role.title}
              className={`cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] ${role.borderHover} ${role.shadowHover} glass-card`}
              onClick={() => navigate(role.path)}
            >
              <CardHeader className="flex-row items-center gap-4 p-5">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${role.iconBg} transition-transform duration-300`}>
                  <role.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg text-foreground">{role.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{role.description}</CardDescription>
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