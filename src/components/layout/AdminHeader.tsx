import { Bell, Search, ChevronDown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-md px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings, clients, services..."
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Branch selector */}
        <Button variant="outline" size="sm" className="gap-2 text-sm">
          <Building2 className="h-4 w-4" />
          <span>Main Branch</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full gradient-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
            3
          </span>
        </Button>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full gradient-gold flex items-center justify-center text-sm font-semibold text-foreground">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
