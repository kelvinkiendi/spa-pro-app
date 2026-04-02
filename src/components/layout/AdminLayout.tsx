import { ReactNode, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { BranchFilterProvider } from "@/contexts/BranchFilterContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isMobile) {
    return (
      <BranchFilterProvider>
        <div className="flex min-h-screen w-full flex-col bg-background">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-card/80 backdrop-blur-md px-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[260px] gradient-sidebar flex flex-col">
                <AdminSidebar onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="font-display font-bold text-foreground">Admin</span>
          </header>
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </BranchFilterProvider>
    );
  }

  return (
    <BranchFilterProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </BranchFilterProvider>
  );
}
