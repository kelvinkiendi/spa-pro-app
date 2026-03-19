import { useState, useEffect, useCallback, createContext, useContext, ReactNode, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

type AppRole = "admin" | "branch_manager" | "nail_tech";

interface AuthContextType {
  user: User | null;
  role: AppRole | null;
  fullName: string | null;
  branch: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  const fetchRoleAndProfile = useCallback(async (userId: string) => {
    const [{ data: roleData }, { data: profileData }] = await Promise.all([
      supabase.rpc("get_user_role", { _user_id: userId }),
      supabase.from("profiles").select("full_name").eq("user_id", userId).single(),
    ]);
    setRole(roleData as AppRole | null);
    setFullName(profileData?.full_name ?? null);
  }, []);

  useEffect(() => {
    // Set up listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // Skip the initial event — handled by getSession below
        if (!initializedRef.current) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchRoleAndProfile(currentUser.id);
        } else {
          setRole(null);
          setFullName(null);
        }
      }
    );

    // Then get initial session (runs once)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchRoleAndProfile(currentUser.id);
      }
      setLoading(false);
      initializedRef.current = true;
    });

    return () => subscription.unsubscribe();
  }, [fetchRoleAndProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    // Eagerly set user & fetch role so navigation is instant
    if (data.user) {
      setUser(data.user);
      await fetchRoleAndProfile(data.user.id);
    }
    return { error: null };
  }, [fetchRoleAndProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setFullName(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, fullName, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
