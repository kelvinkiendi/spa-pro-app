import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/hooks/useAppSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, LogIn, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LoginPageProps {
  title: string;
  subtitle: string;
  expectedRole: "admin" | "branch_manager" | "nail_tech" | "owner" | "receptionist";
  redirectTo: string;
  accentColor: string;
  showBranchSelect?: boolean;
}

interface BranchOption {
  id: string;
  name: string;
}

export function LoginPage({ title, subtitle, expectedRole, redirectTo, accentColor, showBranchSelect = false }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(showBranchSelect);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const { settings } = useAppSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!showBranchSelect) return;

    const fetchBranches = async () => {
      const { data, error } = await supabase
        .from("branches")
        .select("id, name")
        .order("created_at", { ascending: true });

      if (!error) {
        setBranches(data || []);
      }
      setBranchesLoading(false);
    };

    fetchBranches();
  }, [showBranchSelect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (showBranchSelect && !selectedBranch) {
      setError("Please select a branch.");
      return;
    }

    setSubmitting(true);

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setSubmitting(false);
      return;
    }

    if (showBranchSelect && expectedRole === "branch_manager") {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("branch")
          .eq("user_id", user.id)
          .single();

        if (profile?.branch !== selectedBranch) {
          await supabase.auth.signOut();
          setError("This manager account is not assigned to the selected branch.");
          setSubmitting(false);
          return;
        }
      }
    }

    navigate(redirectTo);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <Link to="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to portal
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${accentColor} mb-4 overflow-hidden shadow-gold`}>
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.app_name} className="h-full w-full object-contain" />
            ) : (
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            )}
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        </div>

        <div className="rounded-2xl glass-card shadow-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {showBranchSelect && (
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch} disabled={branchesLoading || branches.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder={branchesLoading ? "Loading branches..." : "Select branch"} />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.name}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</p>
            )}

            <Button type="submit" className="w-full gradient-primary text-primary-foreground gap-2" disabled={submitting || (showBranchSelect && branchesLoading)}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}