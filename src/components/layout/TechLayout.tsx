import { ReactNode, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar, DollarSign, Star, TrendingUp, LogOut, ChevronLeft, ChevronRight, Sparkles, BarChart3, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminHeader } from "./AdminHeader";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/hooks/useAppSettings";

const navItems = [
  { title: "Dashboard", icon: BarChart3, path: "/tech" },
  { title: "My Bookings", icon: Calendar, path: "/tech/bookings" },
  { title: "Sales & Services", icon: TrendingUp, path: "/tech/sales" },
  { title: "Commission", icon: DollarSign, path: "/tech/commission" },
  { title: "Ratings & Feedback", icon: Star, path: "/tech/ratings" },
];

export function TechLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { settings } = useAppSettings();

  const handleSignOut = async () => {
    await signOut();
    navigate("/tech-login");
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside
        className={cn(
          "gradient-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 sticky top-0 h-screen",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage shrink-0 overflow-hidden">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.app_name} className="h-full w-full object-contain" />
            ) : (
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            )}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-display text-lg font-bold text-sidebar-accent-foreground tracking-tight">{settings.app_name}</h1>
              <p className="text-xs text-sidebar-foreground">Nail Technician</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.path === "/tech"
              ? location.pathname === "/tech"
              : location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sage text-primary-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 mx-3 mb-2 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-4 border-t border-sidebar-border text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
