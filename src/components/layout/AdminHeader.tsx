import { Bell, Search, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranches } from "@/hooks/useBranches";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useAuth } from "@/hooks/useAuth";

export function AdminHeader() {
  const { role, fullName, branch } = useAuth();
  const isAdmin = role === "admin" || (role as string) === "owner";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border glass px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings, clients, services..."
            className="pl-10 bg-muted/50 border-border focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isAdmin ? <AdminBranchSelector /> : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-md px-3 py-1.5">
            <Building2 className="h-4 w-4" />
            <span className="font-medium text-foreground">{branch || "Unassigned"}</span>
          </div>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full gradient-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
            3
          </span>
        </Button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
            {fullName?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}

function AdminBranchSelector() {
  const { branches } = useBranches();
  const { selectedBranch, setSelectedBranch } = useBranchFilter();

  return (
    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
      <SelectTrigger className="w-[180px] gap-2">
        <Building2 className="h-4 w-4 shrink-0" />
        <SelectValue placeholder="All Branches" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Branches</SelectItem>
        {branches.map((b) => (
          <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}