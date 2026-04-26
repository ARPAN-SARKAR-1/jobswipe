import { BookmarkCheck, BriefcaseBusiness, ClipboardList, Gauge, Sparkles, UserRoundCheck } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getStudentDashboard } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function StudentDashboardPage() {
  const user = await requireUser(["STUDENT"]);
  const dashboard = await getStudentDashboard(user.id);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="dark-panel rounded-[2rem] p-6 sm:p-8">
        <Badge className="bg-white/10 text-white">Student dashboard</Badge>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Welcome back, {user.name.split(" ")[0]}.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/68">
              Your next role is organized into quick actions: complete the profile, swipe recommendations, save strong matches, and track applications.
            </p>
          </div>
          <Link
            href="/swipe"
            className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-ink transition hover:bg-white/90"
          >
            <Sparkles className="h-4 w-4" />
            Start swiping jobs
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Profile completion" value={`${dashboard.profileCompletion}%`} helper="Keep it high for better matching." icon={UserRoundCheck} />
        <StatCard title="Recommended jobs" value={dashboard.activeJobs} helper="Active openings in the demo stack." icon={BriefcaseBusiness} />
        <StatCard title="Saved jobs" value={dashboard.savedJobs} helper="Bookmarked for later review." icon={BookmarkCheck} />
        <StatCard title="Applications" value={dashboard.applications} helper="Submitted applications tracked here." icon={ClipboardList} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-ink/50">Profile strength</p>
              <h2 className="mt-1 text-2xl font-black text-ink">{dashboard.profileCompletion}% ready</h2>
            </div>
            <Gauge className="h-8 w-8 text-ocean" />
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-ink/8">
            <div className="h-full rounded-full bg-ocean" style={{ width: `${dashboard.profileCompletion}%` }} />
          </div>
          <p className="mt-4 text-sm leading-6 text-ink/60">
            Add skills, education, preferred location, and resume link so the demo feels complete.
          </p>
          <Link href="/profile">
            <Button variant="secondary" className="mt-5">Edit profile</Button>
          </Link>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-2xl font-black text-ink">Today&apos;s workflow</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Swipe", "Review one job card at a time."],
              ["Save", "Bookmark roles worth comparing."],
              ["Apply", "Submit and track status."]
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-ink/8 bg-white p-4">
                <p className="font-bold text-ink">{title}</p>
                <p className="mt-2 text-sm leading-6 text-ink/58">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
