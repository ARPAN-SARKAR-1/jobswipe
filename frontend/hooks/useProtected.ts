"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { dashboardFor, useAuth } from "@/lib/auth";
import type { UserRole } from "@/types";

export function useProtected(roles?: UserRole[]) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.user) {
      router.replace("/login");
      return;
    }
    if (roles?.length && !roles.includes(auth.user.role)) {
      router.replace(dashboardFor(auth.user.role));
    }
  }, [auth.loading, auth.user, roles, router]);

  return auth;
}
