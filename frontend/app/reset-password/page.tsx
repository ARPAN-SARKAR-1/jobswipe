"use client";

import { Loader2, KeyRound } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { apiFetch, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast";

export default function ResetPasswordPage() {
  const search = useSearchParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get("newPassword") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    if (newPassword !== confirmPassword) {
      setError("Passwords must match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token: search.get("token"), newPassword, confirmPassword })
      });
      showToast(data.message, "success");
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Password reset failed.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Badge tone="violet">Reset password</Badge>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-ink">Choose a new password.</h1>
      <form onSubmit={submit} className="glass-panel mt-8 rounded-3xl p-6">
        <label className="text-sm font-semibold text-ink/70" htmlFor="newPassword">New password</label>
        <input id="newPassword" name="newPassword" type="password" minLength={8} required className="focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm" />
        <label className="mt-4 block text-sm font-semibold text-ink/70" htmlFor="confirmPassword">Confirm new password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" minLength={8} required className="focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm" />
        {error ? <p className="mt-3 text-sm font-bold text-rose-600">{error}</p> : null}
        <Button type="submit" disabled={loading} className="mt-6 w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          Reset password
        </Button>
      </form>
    </section>
  );
}
