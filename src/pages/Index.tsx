import { useNavigate } from "react-router-dom";
import { Sparkles, ShieldCheck, Users, Paintbrush } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppSettings } from "@/hooks/useAppSettings";
import spaBackground from "@/assets/spa-background.jpg";

const roles = [
  {
    title: "Admin",
    description: "Full system management & analytics",
    icon: ShieldCheck,
    path: "/admin-login",
    accent: "bg-primary text-primary-foreground",
    hoverBorder: "hover:border-primary/50",
    hoverShadow: "hover:shadow-[0_8px_30px_-6px_hsl(350,55%,55%,0.3)]",
  },
  {
    title: "Branch Manager",
    description: "Manage branch operations & staff",
    icon: Users,
    path: "/manager-login",
    accent: "bg-accent text-accent-foreground",
    hoverBorder: "hover:border-accent/50",
    hoverShadow: "hover:shadow-[0_8px_30px_-6px_hsl(25,60%,65%,0.3)]",
  },
  {
    title: "Nail Technician",
    description: "View bookings & performance",
    icon: Paintbrush,
    path: "/tech-login",
    accent: "bg-secondary text-secondary-foreground",
    hoverBorder: "hover:border-secondary/50",
    hoverShadow: "hover:shadow-[0_8px_30px_-6px_hsl(30,30%,50%,0.2)]",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { settings } = useAppSettings();

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={spaBackground}
          alt=""
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-4 overflow-hidden shadow-elevated">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.app_name} className="h-full w-full object-contain" />
            ) : (
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            )}
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">{settings.app_name}</h1>
          <p className="text-muted-foreground mt-2">Select your portal to sign in</p>
        </div>

        <div className="space-y-4">
          {roles.map((role) => (
            <Card
              key={role.path}
              className={`cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] ${role.hoverBorder} ${role.hoverShadow} bg-card/90 backdrop-blur-md border`}
              onClick={() => navigate(role.path)}
            >
              <CardHeader className="flex-row items-center gap-4 p-5">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${role.accent} transition-transform duration-300 group-hover:scale-110`}>
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
