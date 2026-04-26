import { KeyRound } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/app/login/LoginForm";
import { Badge } from "@/components/ui/Badge";

export default function LoginPage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8">
      <div>
        <Badge tone="teal">Welcome back</Badge>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-ink sm:text-5xl">Continue discovering better-fit jobs.</h1>
        <p className="mt-4 text-base leading-7 text-ink/62">
          Use the seeded demo accounts to explore the job seeker, recruiter, and admin experiences quickly.
        </p>
        <div className="mt-6 grid gap-3 text-sm">
          {[
            "jobseeker@jobswipe.dev / JobSeeker@123",
            "recruiter@jobswipe.dev / Recruiter@123",
            "admin@jobswipe.dev / Admin@123"
          ].map((credential) => (
            <div key={credential} className="flex items-center gap-3 rounded-2xl border border-ink/8 bg-white px-4 py-3 font-semibold text-ink/68">
              <KeyRound className="h-4 w-4 text-ocean" />
              {credential}
            </div>
          ))}
        </div>
      </div>
      <div>
        <LoginForm />
        <p className="mt-5 text-center text-sm text-ink/58">
          New to JobSwipe?{" "}
          <Link href="/register" className="font-bold text-ocean">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
