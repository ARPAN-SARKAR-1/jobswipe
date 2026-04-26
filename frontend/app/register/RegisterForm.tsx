"use client";

import { BriefcaseBusiness, GraduationCap, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { dashboardFor, useAuth } from "@/lib/auth";
import { ApiError, register } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { showToast } = useToast();
  const [role, setRole] = useState<"JOB_SEEKER" | "RECRUITER">("JOB_SEEKER");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    const acceptedTerms = form.get("acceptedTerms") === "on";

    const nextErrors: Record<string, string> = {};
    if (name.length < 2) nextErrors.name = "Name must be at least 2 characters.";
    if (!email.includes("@")) nextErrors.email = "Enter a valid email address.";
    if (password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) nextErrors.confirmPassword = "Passwords must match.";
    if (!acceptedTerms) nextErrors.acceptedTerms = "You must agree to the Terms and Conditions.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const data = await register({ name, email, password, confirmPassword, role, acceptedTerms });
      setUser(data.user);
      showToast("Account created successfully.", "success");
      router.push(dashboardFor(data.user.role));
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Registration failed.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="glass-panel rounded-3xl p-6">
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-ink/5 p-1">
        {[
          { value: "JOB_SEEKER" as const, label: "Job Seeker", icon: GraduationCap },
          { value: "RECRUITER" as const, label: "Recruiter", icon: BriefcaseBusiness }
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setRole(item.value)}
            className={cn("focus-ring flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold transition", role === item.value ? "bg-white text-ink shadow-card" : "text-ink/55 hover:text-ink")}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4">
        {[
          ["name", "Full name", "text"],
          ["email", "Email", "email"],
          ["password", "Password", "password"],
          ["confirmPassword", "Confirm password", "password"]
        ].map(([id, label, type]) => (
          <div key={id}>
            <label className="text-sm font-semibold text-ink/70" htmlFor={id}>
              {label}
            </label>
            <input id={id} name={id} type={type} required className="focus-ring mt-2 h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm" />
            {errors[id] ? <p className="mt-2 text-xs font-bold text-rose-600">{errors[id]}</p> : null}
          </div>
        ))}
      </div>
      <label className="mt-5 flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink/66">
        <input name="acceptedTerms" type="checkbox" className="mt-1 h-4 w-4 rounded border-ink/20" />
        <span>
          I agree to the{" "}
          <Link href="/terms" className="font-black text-ocean">
            Terms and Conditions
          </Link>
          .
        </span>
      </label>
      {errors.acceptedTerms ? <p className="mt-2 text-xs font-bold text-rose-600">{errors.acceptedTerms}</p> : null}
      <Button type="submit" disabled={loading} className="mt-6 w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
        Create account
      </Button>
    </form>
  );
}
