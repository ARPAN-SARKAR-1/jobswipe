"use client";

import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { apiFetch, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast";

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState("");
  const [resetToken, setResetToken] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResetLink("");
    setResetToken("");
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    try {
      const data = await apiFetch<{ message: string; resetLink?: string; resetToken?: string }>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email })
      });
      setResetLink(data.resetLink ?? "");
      setResetToken(data.resetToken ?? "");
      showToast(data.message, "success");
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Could not start reset flow.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <Badge tone="teal">Password help</Badge>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-ink">Reset access to JobSwipe.</h1>
        <p className="mt-4 text-base leading-7 text-ink/62">For the demo, the backend logs the reset link and returns it when development mode is enabled.</p>
      </div>
      <form onSubmit={submit} className="glass-panel rounded-3xl p-6">
        <label className="text-sm font-semibold text-ink/70" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm" />
        <Button type="submit" disabled={loading} className="mt-6 w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Send reset link
        </Button>
        {resetLink ? (
          <Link href={`/reset-password?token=${resetToken}`} className="mt-4 block rounded-2xl bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800">
            Open demo reset link
          </Link>
        ) : null}
      </form>
    </section>
  );
}
