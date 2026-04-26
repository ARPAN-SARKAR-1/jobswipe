import {
  ArrowRight,
  BookmarkCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  Filter,
  Layers3,
  Sparkles,
  Zap
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const features = [
  {
    title: "Swipe-based job discovery",
    description: "One relevant opportunity at a time, built for quick decisions instead of endless scrolling.",
    icon: Zap
  },
  {
    title: "Smart filtering",
    description: "Job seekers can prioritize skills, location, job type, and fresher-friendly openings.",
    icon: Filter
  },
  {
    title: "Save jobs",
    description: "Bookmark promising roles and revisit them from a clean saved-jobs workspace.",
    icon: BookmarkCheck
  },
  {
    title: "Application tracking",
    description: "Follow each application through applied, viewed, shortlisted, and rejected states.",
    icon: ClipboardCheck
  },
  {
    title: "Recruiter dashboard",
    description: "Recruiters can post jobs, review applicants, and update status from one place.",
    icon: BriefcaseBusiness
  }
];

export default function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="subtle-grid absolute inset-0 opacity-[0.18]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <Badge className="bg-white/10 text-white">Final year project demo ready</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Swipe Less. Apply Smarter.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              JobSwipe reduces job-search screen time by replacing long job boards with personalized, one-card-at-a-time discovery for job seekers and freshers.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/swipe"
                className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-ink transition hover:bg-white/90"
              >
                Start Swiping
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/recruiter/post-job"
                className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Post a Job
                <BriefcaseBusiness className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/12 bg-white/8 p-3 shadow-glow backdrop-blur">
              <div className="rounded-[1.5rem] bg-paper p-4 text-ink">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-ink/42">Recommended</p>
                    <h2 className="mt-1 text-2xl font-black">Frontend Developer Intern</h2>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white">
                    <Sparkles className="h-5 w-5" />
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-ink/60">NovaHire Labs</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {["Bengaluru", "Rs. 25,000/month", "Internship", "React + TypeScript"].map((item) => (
                    <div key={item} className="rounded-2xl border border-ink/8 bg-white px-4 py-3 text-sm font-semibold text-ink/70">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-6 text-ink/62">
                  Build polished UI flows for a campus hiring analytics product. Ideal for job seekers with React project experience.
                </p>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-100 bg-white text-rose-600">X</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-100 bg-white text-amber-600">S</span>
                  <span className="flex h-12 flex-1 items-center justify-center rounded-full bg-ocean text-sm font-black text-white">Apply</span>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm font-semibold text-white/70">
              <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-4">Reject</div>
              <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-4">Save</div>
              <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-4">Apply</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Badge tone="teal">Core modules</Badge>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-ink sm:text-4xl">A focused portal for job seekers, recruiters, and admins.</h2>
          <p className="mt-4 text-base leading-7 text-ink/62">
            The website includes authentication, role dashboards, swiping, saved jobs, applications, recruiter job posting, and admin moderation.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="glass-panel rounded-3xl p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/62">{feature.description}</p>
            </article>
          ))}
          <article className="dark-panel rounded-3xl p-6 md:col-span-2 lg:col-span-1">
            <Layers3 className="h-8 w-8" />
            <h3 className="mt-5 text-lg font-bold">Built for presentation</h3>
            <p className="mt-2 text-sm leading-6 text-white/68">
              Seeded Java backend data, demo logins, PostgreSQL-ready APIs, and a polished main swipe flow make the project easy to explain in interviews.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
