import { BriefcaseBusiness, Building2, ClipboardList, Eye, PlusCircle, UsersRound } from "lucide-react";
import Link from "next/link";
import { ApplicationStatusSelect } from "@/components/recruiter/ApplicationStatusSelect";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getRecruiterDashboard } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { requireUser } from "@/lib/session";

export default async function RecruiterDashboardPage() {
  const user = await requireUser(["RECRUITER"]);
  const dashboard = await getRecruiterDashboard(user.id);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="dark-panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="bg-white/10 text-white">Recruiter dashboard</Badge>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{dashboard.company?.companyName ?? "Company"} hiring hub.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/68">
              Post roles, see student interest, and update application statuses from one focused workspace.
            </p>
          </div>
          <Link href="/recruiter/post-job" className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-ink transition hover:bg-white/90">
            <PlusCircle className="h-4 w-4" />
            Post job
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard title="Posted jobs" value={dashboard.jobs.length} helper="Jobs created by this recruiter." icon={BriefcaseBusiness} />
        <StatCard title="Applications" value={dashboard.applications.length} helper="Candidates received across jobs." icon={ClipboardList} />
        <StatCard title="Company location" value={dashboard.company?.location || "Pending"} helper="Shown on company profile." icon={Building2} />
      </div>

      <div className="mt-6 glass-panel rounded-3xl p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-ink">Company profile</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/62">
              {dashboard.company?.description ?? "Company description pending."}
            </p>
          </div>
          <div className="grid gap-2 text-sm font-semibold text-ink/58 sm:grid-cols-2 lg:min-w-80">
            <span className="rounded-2xl bg-white px-4 py-3">{dashboard.company?.companyName ?? "Company name pending"}</span>
            <span className="rounded-2xl bg-white px-4 py-3">{dashboard.company?.website || "Website pending"}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-2xl font-black text-ink">Posted jobs</h2>
          <div className="mt-5 grid gap-3">
            {dashboard.jobs.map((job) => (
              <div key={job.id} className="rounded-2xl border border-ink/8 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-black text-ink">{job.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-ink/55">{job.location} · {job.jobType}</p>
                  </div>
                  <Badge tone={job.isActive ? "teal" : "rose"}>{job.isActive ? "Active" : "Paused"}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold text-ink/55">
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-3 py-1"><UsersRound className="h-4 w-4" /> {job.applications} apps</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-3 py-1"><Eye className="h-4 w-4" /> {job.swipes} swipes</span>
                  <span className="rounded-full bg-ink/5 px-3 py-1">Deadline {formatDate(job.deadline)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-2xl font-black text-ink">Applications received</h2>
          <div className="mt-5 grid gap-3">
            {dashboard.applications.length ? dashboard.applications.map((application) => (
              <div key={application.id} className="rounded-2xl border border-ink/8 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-black text-ink">{application.applicantName}</h3>
                    <p className="mt-1 text-sm font-semibold text-ink/55">{application.applicantEmail}</p>
                    <p className="mt-2 text-sm text-ink/60">{application.jobTitle}</p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <ApplicationStatusSelect applicationId={application.id} initialStatus={application.status} />
                  <span className="text-xs font-semibold text-ink/42">{formatDate(application.createdAt)}</span>
                </div>
              </div>
            )) : (
              <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm font-semibold text-ink/55">No applications received yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
