"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      type="button"
      onClick={logout}
      className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 px-3 text-sm font-semibold text-white/78 transition hover:bg-white/10"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
