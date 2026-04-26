"use client";

import { BriefcaseBusiness, GraduationCap, Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "RECRUITER">("STUDENT");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        role
      })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.message ?? "Registration failed.");
      return;
    }

    router.push(data.redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="glass-panel rounded-3xl p-6">
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-ink/5 p-1">
        {[
          { value: "STUDENT" as const, label: "Student", icon: GraduationCap },
          { value: "RECRUITER" as const, label: "Recruiter", icon: BriefcaseBusiness }
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setRole(item.value)}
            className={cn(
              "focus-ring flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold transition",
              role === item.value ? "bg-white text-ink shadow-card" : "text-ink/55 hover:text-ink"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4">
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="name">
            Full name
          </label>
          <input id="name" name="name" required className="focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm" />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" required className="focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm" />
        </div>
        <div>
          <label className="text-sm font-semibold text-ink/70" htmlFor="password">
            Password
          </label>
          <input id="password" name="password" type="password" minLength={8} required className="focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm" />
        </div>
      </div>
      {message ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{message}</p> : null}
      <Button type="submit" disabled={loading} className="mt-6 w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
        Create account
      </Button>
    </form>
  );
}
