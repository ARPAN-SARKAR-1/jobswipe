"use client";

import { BriefcaseBusiness, ClipboardList, ShieldCheck, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiFetch } from "@/lib/api";
import { jobTypeLabels, roleLabels } from "@/lib/labels";
import { useToast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { useProtected } from "@/hooks/useProtected";
import type { AdminDashboard } from "@/types";

export default function AdminDashboardPage() {
  const { user, loading } = useProtected(["ADMIN"]);
  const { showToast } = useToast();
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiFetch<AdminDashboard>("/admin/dashboard")
      .then(setDashboard)
      .catch(() => showToast("Could not load admin dashboard.", "error"));
  }, [showToast]);

  const filteredUsers = useMemo(() => {
    if (!dashboard) return [];
    return dashboard.users.filter((item) => `${item.name} ${item.email} ${item.role}`.toLowerCase().includes(search.toLowerCase()));
  }, [dashboard, search]);

  if (loading || !dashboard || !user) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="dark-panel rounded-[2rem] p-6 sm:p-8">
        <Badge className="bg-white/10 text-white">Admin dashboard</Badge>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Database overview, {user.name.split(" ")[0]}.</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-white/68">View users, job seekers, recruiters, jobs, applications, and swipes from the Java backend database.</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total users" value={dashboard.totalUsers} helper="All platform accounts." icon={UsersRound} />
        <StatCard title="Job seekers" value={dashboard.totalJobSeekers} helper="Candidate accounts." icon={ShieldCheck} />
        <StatCard title="Active jobs" value={dashboard.activeJobs} helper={`${dashboard.expiredJobs} expired jobs hidden from feed.`} icon={BriefcaseBusiness} />
        <StatCard title="Applications" value={dashboard.totalApplications} helper="All submitted applications." icon={ClipboardList} />
      </div>

      <div className="mt-6 glass-panel rounded-3xl p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-black text-ink">Users</h2>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users" className="focus-ring h-11 rounded-full border border-ink/10 bg-white px-4 text-sm" />
        </div>
        <Table headers={["Name", "Email", "Role", "Created"]}>
          {filteredUsers.map((item) => (
            <tr key={item.id} className="border-t border-ink/8">
              <td className="px-4 py-3 font-bold">{item.name}</td>
              <td className="px-4 py-3">{item.email}</td>
              <td className="px-4 py-3">{roleLabels[item.role]}</td>
              <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
            </tr>
          ))}
        </Table>
      </div>

      <div className="mt-6 grid gap-6">
        <Section title="Job Seekers">
          <Table headers={["Name", "GitHub", "Experience", "Skills"]}>
            {dashboard.jobSeekers.map((profile) => (
              <tr key={profile.id} className="border-t border-ink/8">
                <td className="px-4 py-3 font-bold">{profile.user.name}</td>
                <td className="px-4 py-3">{profile.githubUrl || "Pending"}</td>
                <td className="px-4 py-3">{profile.experienceLevel?.replaceAll("_", " ") || "FRESHER"}</td>
                <td className="px-4 py-3">{profile.skills || "Pending"}</td>
              </tr>
            ))}
          </Table>
        </Section>

        <Section title="Recruiters">
          <Table headers={["Company", "Location", "Website", "Recruiter ID"]}>
            {dashboard.recruiters.map((profile) => (
              <tr key={profile.id} className="border-t border-ink/8">
                <td className="px-4 py-3 font-bold">{profile.companyName}</td>
                <td className="px-4 py-3">{profile.location || "Pending"}</td>
                <td className="px-4 py-3">{profile.website || "Pending"}</td>
                <td className="px-4 py-3">{profile.recruiterId}</td>
              </tr>
            ))}
          </Table>
        </Section>

        <Section title="Jobs">
          <Table headers={["Title", "Company", "Type", "Status", "Deadline"]}>
            {dashboard.jobs.map((job) => (
              <tr key={job.id} className="border-t border-ink/8">
                <td className="px-4 py-3 font-bold">{job.title}</td>
                <td className="px-4 py-3">{job.companyName}</td>
                <td className="px-4 py-3">{jobTypeLabels[job.jobType]}</td>
                <td className="px-4 py-3">{job.expired ? "Expired" : job.active ? "Active" : "Paused"}</td>
                <td className="px-4 py-3">{formatDate(job.deadline)}</td>
              </tr>
            ))}
          </Table>
        </Section>

        <Section title="Applications">
          <Table headers={["Job Seeker", "Job", "Status", "Created"]}>
            {dashboard.applications.map((application) => (
              <tr key={application.id} className="border-t border-ink/8">
                <td className="px-4 py-3 font-bold">{application.jobSeekerName}</td>
                <td className="px-4 py-3">{application.job.title}</td>
                <td className="px-4 py-3"><StatusBadge status={application.status} /></td>
                <td className="px-4 py-3">{formatDate(application.createdAt)}</td>
              </tr>
            ))}
          </Table>
        </Section>

        <Section title="Swipes">
          <Table headers={["Job Seeker ID", "Job", "Action", "Created"]}>
            {dashboard.swipes.map((swipe) => (
              <tr key={swipe.id} className="border-t border-ink/8">
                <td className="px-4 py-3">{swipe.jobSeekerId}</td>
                <td className="px-4 py-3 font-bold">{swipe.job.title}</td>
                <td className="px-4 py-3">{swipe.action}</td>
                <td className="px-4 py-3">{formatDate(swipe.createdAt)}</td>
              </tr>
            ))}
          </Table>
        </Section>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-3xl p-6">
      <h2 className="text-2xl font-black text-ink">{title}</h2>
      {children}
    </div>
  );
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-2xl border border-ink/8 bg-white">
      <table className="min-w-full text-left text-sm text-ink/66">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-ink/42">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
