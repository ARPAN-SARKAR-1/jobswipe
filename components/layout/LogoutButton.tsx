"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/10 px-3 text-sm font-semibold text-white/78 transition hover:bg-white/10 disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Leaving" : "Logout"}
    </button>
  );
}
