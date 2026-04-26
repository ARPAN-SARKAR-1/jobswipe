"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { JobMiniCard } from "@/components/jobs/JobMiniCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { apiFetch } from "@/lib/api";
import { experienceOptions, jobTypeOptions, workModeOptions } from "@/lib/labels";
import { useToast } from "@/lib/toast";
import { useProtected } from "@/hooks/useProtected";
import type { ExperienceLevel, Job, JobType, WorkMode } from "@/types";

type Filters = {
  jobType: "" | JobType;
  experienceLevel: "" | ExperienceLevel;
  workMode: "" | WorkMode;
  location: string;
  skill: string;
  activeOnly: boolean;
};

const initialFilters: Filters = {
  jobType: "",
  experienceLevel: "",
  workMode: "",
  location: "",
  skill: "",
  activeOnly: true,
};

async function loadJobs(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.jobType) params.set("jobType", filters.jobType);
  if (filters.experienceLevel) params.set("experienceLevel", filters.experienceLevel);
  if (filters.workMode) params.set("workMode", filters.workMode);
  if (filters.location) params.set("location", filters.location);
  if (filters.skill) params.set("skill", filters.skill);
  if (filters.activeOnly) params.set("activeOnly", "true");
  return apiFetch<Job[]>(`/jobs?${params.toString()}`);
}

export default function JobsPage() {
  const { loading } = useProtected(["JOB_SEEKER", "RECRUITER", "ADMIN"]);
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    loadJobs(initialFilters)
      .then(setJobs)
      .catch(() => showToast("Could not load jobs.", "error"));
  }, [showToast]);

  async function handleApplyFilters() {
    try {
      setJobs(await loadJobs(filters));
    } catch {
      showToast("Could not load jobs.", "error");
    }
  }

  if (loading) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Badge tone="teal">Job list</Badge>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">Browse and filter jobs.</h1>
      <div className="glass-panel mt-6 rounded-3xl p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <Select label="Job type" value={filters.jobType} onChange={(value) => setFilters({ ...filters, jobType: value as Filters["jobType"] })} options={jobTypeOptions} />
          <Select label="Experience" value={filters.experienceLevel} onChange={(value) => setFilters({ ...filters, experienceLevel: value as Filters["experienceLevel"] })} options={experienceOptions} />
          <Select label="Work mode" value={filters.workMode} onChange={(value) => setFilters({ ...filters, workMode: value as Filters["workMode"] })} options={workModeOptions} />
          <Input label="Location" value={filters.location} onChange={(value) => setFilters({ ...filters, location: value })} />
          <Input label="Skill" value={filters.skill} onChange={(value) => setFilters({ ...filters, skill: value })} />
          <label className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-bold text-ink/66">
            <input type="checkbox" checked={filters.activeOnly} onChange={(event) => setFilters({ ...filters, activeOnly: event.target.checked })} />
            Active jobs only
          </label>
        </div>
        <Button type="button" className="mt-4" onClick={handleApplyFilters}>
          <Search className="h-4 w-4" />
          Apply filters
        </Button>
      </div>
      <div className="mt-6 grid gap-4">
        {jobs.length ? jobs.map((job) => <JobMiniCard key={job.id} job={job} />) : <EmptyState icon={Search} title="No jobs found" description="Try changing the filters to broaden the job list." />}
      </div>
    </section>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="text-xs font-black uppercase tracking-[0.16em] text-ink/42">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring mt-2 h-11 w-full rounded-2xl border border-ink/10 bg-white px-3 text-sm font-bold normal-case tracking-normal text-ink">
        <option value="">Any</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-black uppercase tracking-[0.16em] text-ink/42">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring mt-2 h-11 w-full rounded-2xl border border-ink/10 bg-white px-3 text-sm font-bold normal-case tracking-normal text-ink" />
    </label>
  );
}
