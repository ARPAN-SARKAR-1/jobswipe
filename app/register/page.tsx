import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { RegisterForm } from "@/app/register/RegisterForm";
import { Badge } from "@/components/ui/Badge";

export default function RegisterPage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8">
      <div>
        <Badge tone="violet">Join JobSwipe</Badge>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-ink sm:text-5xl">Create a student or recruiter account.</h1>
        <p className="mt-4 text-base leading-7 text-ink/62">
          Students can start swiping immediately. Recruiters get a dashboard for posting openings and managing applicants.
        </p>
        <div className="mt-6 grid gap-3">
          {["Role-aware dashboards", "Secure password hashing", "Clean validation and demo-ready data"].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm font-semibold text-ink/66">
              <CheckCircle2 className="h-5 w-5 text-ocean" />
              {item}
            </div>
          ))}
        </div>
      </div>
      <div>
        <RegisterForm />
        <p className="mt-5 text-center text-sm text-ink/58">
          Already registered?{" "}
          <Link href="/login" className="font-bold text-ocean">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
