"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { clearAuthToken } from "@/services/api";
import type { SessionUser } from "@/types";

interface AuthState {
  user: SessionUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending, refetch } = authClient.useSession();
  const router = useRouter();

  const user = useMemo<SessionUser | null>(() => {
    if (!session?.user) return null;
    const u = session.user as typeof session.user & { role?: string; isBlocked?: boolean; phone?: string | null };
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      role: u.role === "admin" ? "admin" : "customer",
      isBlocked: Boolean(u.isBlocked),
      phone: u.phone ?? null,
    };
  }, [session]);

  const logout = useCallback(async () => {
    await authClient.signOut();
    clearAuthToken();
    toast.success("You have been signed out");
    router.push("/");
    router.refresh();
  }, [router]);

  const refreshUser = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const value = useMemo(() => ({ user, isLoading: isPending, logout, refreshUser }), [user, isPending, logout, refreshUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
