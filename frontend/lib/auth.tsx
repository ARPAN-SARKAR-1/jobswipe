"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, clearToken, getToken } from "@/lib/api";
import type { ApiUser } from "@/types";

type AuthContextValue = {
  user: ApiUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUser: (user: ApiUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const currentUser = await apiFetch<ApiUser>("/auth/me");
      setUser(currentUser);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearToken();
    setUser(null);
    window.location.href = "/";
  }

  useEffect(() => {
    refreshUser();
  }, []);

  const value = useMemo(() => ({ user, loading, refreshUser, setUser, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}

export function dashboardFor(role?: string) {
  if (role === "RECRUITER") return "/dashboard/recruiter";
  if (role === "ADMIN") return "/dashboard/admin";
  return "/dashboard/jobseeker";
}
