"use client";

import { BriefcaseBusiness, Building2, ClipboardList, Eye, PlusCircle, UsersRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ApplicationStatusSelect } from "@/components/recruiter/ApplicationStatusSelect";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { absoluteUrl, apiFetch, ApiError } from "@/lib/api";
import { experienceLabels, jobTypeLabels, workModeLabels } from "@/lib/labels";
import { useToast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { useProtected } from "@/hooks/useProtected";
import type { RecruiterDashboard } from "@/types";

export default function RecruiterDashboardPage() {
  const { loading } = useProtected(["RECRUITER"]);
  const { showToast } = useToast();
  const [dashboard, setDashboard] = useState<RecruiterDashboard | null>(null);

  async function load() {
    setDashboard(await apiFetch<RecruiterDashboard>("/recruiter/dashboard"));
  }

  useEffect(() => {
    load().catch(() => showToast("Could not load recruiter dashboard.", "error"));
  }, [showToast]);

  async function deleteJob(id: string) {
    if (!window.confirm("Delete this job before its deadline?")) return;
    try {
      await apiFetch(`/jobs/${id}?confirm=true`, { method: "DELETE" });
      showToast("Job deleted.", "success");
      await load();
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Could not delete job.", "error");
    }
  }

  if (loading || !dashboard) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="dark-panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="bg-white/10 text-white">Recruiter dashboard</Badge>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{dashboard.company.companyName} hiring hub.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/68">Post roles, see job seeker interest, and update application statuses from one focused workspace.</p>
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
        <StatCard title="Company location" value={dashboard.company.location || "Pending"} helper="Shown on company profile." icon={Building2} />
      </div>

      <div className="mt-6 glass-panel rounded-3xl p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            {dashboard.company.companyLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={absoluteUrl(dashboard.company.companyLogoUrl)} alt="" className="h-16 w-16 rounded-2xl object-cover" />
            ) : null}
            <div>
              <h2 className="text-2xl font-black text-ink">Company profile</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/62">{dashboard.company.description ?? "Company description pending."}</p>
            </div>
          </div>
          <Link href="/recruiter/company-profile">
            <Button variant="secondary">Edit company</Button>
          </Link>
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
                    <p className="mt-1 text-sm font-semibold text-ink/55">{job.location} · {jobTypeLabels[job.jobType]} · {workModeLabels[job.workMode]}</p>
                  </div>
                  <Badge tone={job.expired ? "rose" : job.active ? "teal" : "rose"}>{job.expired ? "Expired" : job.active ? "Active" : "Paused"}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold text-ink/55">
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-3 py-1"><UsersRound className="h-4 w-4" /> {dashboard.applications.filter((app) => app.job.id === job.id).length} apps</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-3 py-1"><Eye className="h-4 w-4" /> {experienceLabels[job.requiredExperienceLevel]}</span>
                  <span className="rounded-full bg-ink/5 px-3 py-1">Deadline {formatDate(job.deadline)}</span>
                </div>
                {!job.expired ? (
                  <Button type="button" variant="danger" size="sm" className="mt-4" onClick={() => deleteJob(job.id)}>
                    Delete job
                  </Button>
                ) : null}
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
                    <h3 className="font-black text-ink">{application.jobSeekerName}</h3>
                    <p className="mt-1 text-sm font-semibold text-ink/55">{application.jobSeekerEmail}</p>
                    <p className="mt-2 text-sm text-ink/60">{application.job.title}</p>
                    {application.resumePdfUrl ? <a href={absoluteUrl(application.resumePdfUrl)} target="_blank" rel="noreferrer" className="mt-2 block text-sm font-bold text-ocean">View resume</a> : null}
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
