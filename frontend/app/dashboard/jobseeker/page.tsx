"use client";

import { BookmarkCheck, BriefcaseBusiness, ClipboardList, Github, Sparkles, UserRoundCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { useProtected } from "@/hooks/useProtected";
import type { Job, JobApplication, JobSeekerProfile, Swipe } from "@/types";

export default function JobSeekerDashboardPage() {
  const { user, loading } = useProtected(["JOB_SEEKER"]);
  const { showToast } = useToast();
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [swipes, setSwipes] = useState<Swipe[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiFetch<JobSeekerProfile>("/jobseeker/profile"),
      apiFetch<Job[]>("/jobs/feed?activeOnly=true"),
      apiFetch<JobApplication[]>("/applications/my"),
      apiFetch<Swipe[]>("/swipes/history")
    ])
      .then(([profileData, jobsData, appsData, swipesData]) => {
        setProfile(profileData);
        setJobs(jobsData);
        setApplications(appsData);
        setSwipes(swipesData);
      })
      .catch(() => showToast("Could not load dashboard data.", "error"));
  }, [showToast, user]);

  if (loading || !user) return null;

  const fields = [profile?.phone, profile?.githubUrl, profile?.degree, profile?.college, profile?.skills, profile?.preferredLocation, profile?.resumePdfUrl].filter(Boolean).length;
  const completion = Math.round((fields / 7) * 100);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="dark-panel rounded-[2rem] p-6 sm:p-8">
        <Badge className="bg-white/10 text-white">Job seeker dashboard</Badge>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Welcome back, {user.name.split(" ")[0]}.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/68">Complete your profile, tune your filters, swipe recommendations, and track applications from one focused place.</p>
          </div>
          <Link href="/swipe" className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-ink transition hover:bg-white/90">
            <Sparkles className="h-4 w-4" />
            Start swiping jobs
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Profile completion" value={`${completion}%`} helper="GitHub, resume, skills, and education." icon={UserRoundCheck} />
        <StatCard title="Recommended jobs" value={jobs.length} helper="Active matches after backend filtering." icon={BriefcaseBusiness} />
        <StatCard title="Saved jobs" value={swipes.filter((swipe) => swipe.action === "SAVE").length} helper="Bookmarked from the swipe deck." icon={BookmarkCheck} />
        <StatCard title="Applications" value={applications.length} helper="Submitted and historical applications." icon={ClipboardList} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="glass-panel rounded-3xl p-6">
          <p className="text-sm font-bold text-ink/50">Profile strength</p>
          <h2 className="mt-1 text-2xl font-black text-ink">{completion}% ready</h2>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-ink/8">
            <div className="h-full rounded-full bg-ocean" style={{ width: `${completion}%` }} />
          </div>
          <p className="mt-4 text-sm leading-6 text-ink/60">Add GitHub, resume PDF, education, experience, and skills for a stronger demo story.</p>
          <Link href="/profile">
            <Button variant="secondary" className="mt-5">Edit profile</Button>
          </Link>
        </div>

        <div className="glass-panel rounded-3xl p-6">
          <h2 className="text-2xl font-black text-ink">Profile highlights</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-ink/8 bg-white p-4">
              <Github className="h-5 w-5 text-ocean" />
              <p className="mt-3 font-bold text-ink">GitHub</p>
              <p className="mt-2 break-all text-sm leading-6 text-ink/58">{profile?.githubUrl || "Not added yet"}</p>
            </div>
            <Info title="Education" value={profile?.degree || "Pending"} />
            <Info title="Experience" value={profile?.experienceLevel?.replaceAll("_", " ") || "FRESHER"} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink/8 bg-white p-4">
      <p className="font-bold text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink/58">{value}</p>
    </div>
  );
}
