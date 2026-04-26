import { BriefcaseBusiness, ClipboardList, ShieldCheck, UsersRound } from "lucide-react";
import { AdminJobToggle } from "@/components/admin/AdminJobToggle";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { getAdminDashboard } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { requireUser } from "@/lib/session";

export default async function AdminDashboardPage() {
  const user = await requireUser(["ADMIN"]);
  const dashboard = await getAdminDashboard();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="dark-panel rounded-[2rem] p-6 sm:p-8">
        <Badge className="bg-white/10 text-white">Admin dashboard</Badge>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">System overview, {user.name.split(" ")[0]}.</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-white/68">
          Monitor users, recruiters, applications, and job visibility from a simple moderation panel.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total users" value={dashboard.totalUsers} helper="Students, recruiters, and admins." icon={UsersRound} />
        <StatCard title="Total jobs" value={dashboard.totalJobs} helper="Seeded plus recruiter-created jobs." icon={BriefcaseBusiness} />
        <StatCard title="Applications" value={dashboard.totalApplications} helper="All submitted applications." icon={ClipboardList} />
        <StatCard title="Recruiters" value={dashboard.recruiters} helper="Company users on the platform." icon={ShieldCheck} />
      </div>

      <div className="mt-6 glass-panel rounded-3xl p-6">
        <h2 className="text-2xl font-black text-ink">Recent jobs</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border border-ink/8 bg-white">
          <div className="grid grid-cols-[1.4fr_1fr_0.7fr_0.8fr] gap-3 border-b border-ink/8 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-ink/42">
            <span>Job</span>
            <span>Recruiter</span>
            <span>Apps</span>
            <span>Control</span>
          </div>
          {dashboard.jobs.map((job) => (
            <div key={job.id} className="grid grid-cols-1 gap-3 border-b border-ink/8 px-4 py-4 last:border-b-0 md:grid-cols-[1.4fr_1fr_0.7fr_0.8fr] md:items-center">
              <div>
                <p className="font-black text-ink">{job.title}</p>
                <p className="mt-1 text-sm font-semibold text-ink/50">{job.companyName} · {formatDate(job.createdAt)}</p>
              </div>
              <p className="text-sm font-semibold text-ink/58">{job.recruiterEmail}</p>
              <p className="text-sm font-bold text-ink/70">{job.applications}</p>
              <AdminJobToggle jobId={job.id} initialActive={job.isActive} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
