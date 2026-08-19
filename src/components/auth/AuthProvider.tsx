"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface AuthContextValue {
  user: User | null;
  profile: { role: string; full_name: string | null } | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ role: string; full_name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", userId)
        .single();
      if (data) {
        setProfile(data);
      }
    } catch {
      // Profile might not exist yet during signup
    }
  };

  // Refresh cookies when session is restored (auto-login)
  const refreshCookies = async (sessionUser: User) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", sessionUser.id)
        .single();
      const role = profile?.role || "user";
      document.cookie = "builder_session=authenticated; path=/; max-age=2592000; SameSite=Lax; Secure";
      document.cookie = `user_role=${role}; path=/; max-age=2592000; SameSite=Lax; Secure`;
    } catch {
      document.cookie = "builder_session=authenticated; path=/; max-age=2592000; SameSite=Lax; Secure";
    }
  };

  useEffect(() => {
    // Check current session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
          refreshCookies(session.user); // Refresh cookies on page load
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      })
      .catch(() => {
        // Storage/auth failure (e.g. blocked localStorage on mobile) — treat as logged out
        setUser(null);
        setProfile(null);
        setLoading(false);
      });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
          refreshCookies(session.user); // Refresh cookies on auth change
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Clear user-specific localStorage before signing out
    if (user) {
      try {
        localStorage.removeItem(`builder_pages_${user.id}`);
        localStorage.removeItem(`builder_published_snapshots_${user.id}`);
      } catch {}
    }

    await supabase.auth.signOut();
    // Clear all session cookies
    document.cookie = "builder_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user_role=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    setProfile(null);
    router.push("/auth/login");
  };

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
