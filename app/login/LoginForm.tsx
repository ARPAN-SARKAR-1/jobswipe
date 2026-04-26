"use client";

import { Loader2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password")
      })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.message ?? "Login failed.");
      return;
    }

    router.push(data.redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="glass-panel rounded-3xl p-6">
      <div>
        <label className="text-sm font-semibold text-ink/70" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="student@jobswipe.dev"
          className="focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm"
        />
      </div>
      <div className="mt-4">
        <label className="text-sm font-semibold text-ink/70" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Student@123"
          className="focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm"
        />
      </div>
      {message ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{message}</p> : null}
      <Button type="submit" disabled={loading} className="mt-6 w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
        Login
      </Button>
    </form>
  );
}
