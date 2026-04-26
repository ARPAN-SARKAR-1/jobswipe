"use client";

import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { dashboardFor, useAuth } from "@/lib/auth";
import { ApiError, login } from "@/lib/api";
import { useToast } from "@/lib/toast";

export function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const nextErrors: Record<string, string> = {};
    if (!email.includes("@")) nextErrors.email = "Enter a valid email address.";
    if (password.length < 6) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const data = await login(email, password);
      setUser(data.user);
      showToast("Login successful.", "success");
      router.push(dashboardFor(data.user.role));
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Login failed.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="glass-panel rounded-3xl p-6">
      <div>
        <label className="text-sm font-semibold text-ink/70" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required placeholder="jobseeker@jobswipe.dev" className="focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm" />
        {errors.email ? <p className="mt-2 text-xs font-bold text-rose-600">{errors.email}</p> : null}
      </div>
      <div className="mt-4">
        <label className="text-sm font-semibold text-ink/70" htmlFor="password">
          Password
        </label>
        <input id="password" name="password" type="password" required placeholder="JobSeeker@123" className="focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm" />
        {errors.password ? <p className="mt-2 text-xs font-bold text-rose-600">{errors.password}</p> : null}
      </div>
      <div className="mt-4 text-right">
        <Link href="/forgot-password" className="text-sm font-bold text-ocean">
          Forgot password?
        </Link>
      </div>
      <Button type="submit" disabled={loading} className="mt-6 w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        Login
      </Button>
    </form>
  );
}
