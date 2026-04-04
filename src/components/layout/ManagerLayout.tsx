import { ReactNode, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar, Users, Clock, UserCheck, Scissors, LogOut, ChevronLeft, ChevronRight, Sparkles, ClipboardList, Package, Menu, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminHeader } from "./AdminHeader";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/hooks/useAppSettings";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", icon: ClipboardList, path: "/manager" },
  { title: "Bookings", icon: Calendar, path: "/manager/bookings" },
  { title: "Schedule Staff", icon: Clock, path: "/manager/scheduling" },
  { title: "Attendance", icon: UserCheck, path: "/manager/attendance" },
  { title: "Walk-ins", icon: Users, path: "/manager/walkins" },
  { title: "Clients", icon: Scissors, path: "/manager/clients" },
  { title: "Inventory", icon: Package, path: "/manager/inventory" },
];

function SidebarContent({ collapsed, onCollapse, onNavigate }: { collapsed: boolean; onCollapse?: (v: boolean) => void; onNavigate?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { settings } = useAppSettings();

  const handleSignOut = async () => {
    await signOut();
    navigate("/manager-login");
  };

  return (
    <>
      <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-emerald shrink-0 overflow-hidden">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt={settings.app_name} className="h-full w-full object-contain" />
          ) : (
            <Shield className="h-5 w-5 text-accent-foreground" />
          )}
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-display text-lg font-bold text-sidebar-accent-foreground tracking-tight">{settings.app_name}</h1>
            <p className="text-xs text-sidebar-foreground">Branch Manager</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.path === "/manager"
            ? location.pathname === "/manager"
            : location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "gradient-emerald text-accent-foreground shadow-soft"
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

      {onCollapse && (
        <button
          onClick={() => onCollapse(!collapsed)}
          className="flex items-center justify-center py-4 border-t border-sidebar-border text-sidebar-foreground hover:text-sidebar-accent-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      )}
    </>
  );
}

export function ManagerLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border glass px-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[260px] gradient-sidebar flex flex-col">
              <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="font-display font-bold text-foreground">Manager</span>
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside
        className={cn(
          "gradient-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 sticky top-0 h-screen",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        <SidebarContent collapsed={collapsed} onCollapse={setCollapsed} />
      </aside>
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}