import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Package,
  DollarSign,
  Gift,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CalendarClock,
  FileBarChart,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/hooks/useAppSettings";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Bookings", icon: Calendar, path: "/admin/bookings" },
  { title: "Nail Techs", icon: Scissors, path: "/admin/technicians" },
  { title: "Clients", icon: Users, path: "/admin/clients" },
  { title: "Inventory", icon: Package, path: "/admin/inventory" },
  { title: "Finances", icon: DollarSign, path: "/admin/finances" },
  { title: "Loyalty", icon: Gift, path: "/admin/loyalty" },
  { title: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { title: "Scheduling", icon: CalendarClock, path: "/admin/scheduling" },
  { title: "Reports", icon: FileBarChart, path: "/admin/reports" },
  { title: "Reminders", icon: Bell, path: "/admin/reminders" },
  { title: "Settings", icon: Settings, path: "/admin/settings" },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { settings } = useAppSettings();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin-login");
  };

  return (
    <aside
      className={cn(
        "gradient-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 sticky top-0 h-screen",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary shrink-0 overflow-hidden">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt={settings.app_name} className="h-full w-full object-contain" />
          ) : (
            <Sparkles className="h-5 w-5 text-sidebar-primary-foreground" />
          )}
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-display text-lg font-bold text-sidebar-accent-foreground tracking-tight">
              {settings.app_name}
            </h1>
            <p className="text-xs text-sidebar-foreground">Management</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.path === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "gradient-primary text-sidebar-primary-foreground shadow-soft"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 mx-3 mb-2 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
      >
        <LogOut className="h-5 w-5 shrink-0" />
        {!collapsed && <span>Sign Out</span>}
      </button>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center py-4 border-t border-sidebar-border text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
