"use client";

import { AnimatePresence, motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft, Bookmark, BriefcaseBusiness, Check, MapPin, RotateCcw, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { apiFetch, absoluteUrl, ApiError } from "@/lib/api";
import { experienceLabels, experienceOptions, jobTypeLabels, jobTypeOptions, workModeLabels, workModeOptions } from "@/lib/labels";
import { useToast } from "@/lib/toast";
import { formatDate, splitSkills } from "@/lib/utils";
import type { ExperienceLevel, Job, JobType, SwipeAction, WorkMode } from "@/types";

type Filters = {
  jobType: "" | JobType;
  experienceLevel: "" | ExperienceLevel;
  location: string;
  skill: string;
  workMode: "" | WorkMode;
  activeOnly: boolean;
};

const cardVariants = {
  enter: { opacity: 0, y: 28, scale: 0.96 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * 540,
    rotate: direction * 14,
    scale: 0.92,
    transition: { duration: 0.24, ease: "easeOut" }
  })
};

function SwipeCard({ job, onSwipe, processing }: { job: Job; onSwipe: (action: SwipeAction, direction: number) => void; processing: boolean }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-10, 0, 10]);
  const likeOpacity = useTransform(x, [40, 170], [0, 1]);
  const rejectOpacity = useTransform(x, [-170, -40], [1, 0]);

  function onDragEnd(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (processing) return;
    if (info.offset.x > 110 || info.velocity.x > 700) onSwipe("LIKE", 1);
    if (info.offset.x < -110 || info.velocity.x < -700) onSwipe("REJECT", -1);
  }

  return (
    <motion.article
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={onDragEnd}
      style={{ x, rotate }}
      custom={0}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="relative cursor-grab touch-pan-y select-none rounded-[2rem] border border-white/70 bg-white p-6 shadow-glow active:cursor-grabbing sm:p-7"
    >
      <motion.div style={{ opacity: likeOpacity }} className="pointer-events-none absolute right-6 top-6 rotate-6 rounded-2xl border-2 border-ocean px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-ocean">
        Apply
      </motion.div>
      <motion.div style={{ opacity: rejectOpacity }} className="pointer-events-none absolute left-6 top-6 -rotate-6 rounded-2xl border-2 border-rose-500 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-rose-600">
        Skip
      </motion.div>

      <div className="flex items-start justify-between gap-5">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={job.jobType === "REMOTE" ? "violet" : job.jobType === "INTERNSHIP" ? "teal" : "neutral"}>{jobTypeLabels[job.jobType]}</Badge>
            <Badge>{workModeLabels[job.workMode]}</Badge>
          </div>
          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">{job.title}</h2>
          <p className="mt-2 text-base font-bold text-ink/58">{job.companyName}</p>
        </div>
        {job.companyLogoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={absoluteUrl(job.companyLogoUrl)} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-white">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <Info title="Location" value={job.location} icon={<MapPin className="h-4 w-4" />} />
        <Info title="Stipend / salary" value={job.salary} />
        <Info title="Experience" value={experienceLabels[job.requiredExperienceLevel]} />
        <Info title="Deadline" value={formatDate(job.deadline)} />
      </div>

      <p className="mt-6 text-base leading-7 text-ink/66">{job.description}</p>
      <p className="mt-3 text-sm leading-6 text-ink/52">{job.eligibility}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {splitSkills(job.requiredSkills).map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>
    </motion.article>
  );
}

function Info({ title, value, icon }: { title: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink/8 bg-paper px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/36">{title}</p>
      <p className="mt-1 flex items-center gap-2 text-sm font-bold text-ink/72">
        {icon}
        {value}
      </p>
    </div>
  );
}

export function SwipeDeck() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [viewed, setViewed] = useState(0);
  const [direction, setDirection] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [filters, setFilters] = useState<Filters>({ jobType: "", experienceLevel: "", location: "", skill: "", workMode: "", activeOnly: true });

  const currentJob = jobs[0];
  const progress = useMemo(() => {
    const total = jobs.length + viewed;
    if (!total) return 0;
    return Math.min(100, Math.round((viewed / total) * 100));
  }, [jobs.length, viewed]);

  async function loadFeed() {
    const params = new URLSearchParams();
    if (filters.jobType) params.set("jobType", filters.jobType);
    if (filters.experienceLevel) params.set("experienceLevel", filters.experienceLevel);
    if (filters.location) params.set("location", filters.location);
    if (filters.skill) params.set("skill", filters.skill);
    if (filters.workMode) params.set("workMode", filters.workMode);
    if (filters.activeOnly) params.set("activeOnly", "true");
    const data = await apiFetch<Job[]>(`/jobs/feed?${params.toString()}`);
    setJobs(data);
    setViewed(0);
  }

  useEffect(() => {
    loadFeed().catch((error) => showToast(error instanceof ApiError ? error.message : "Could not load jobs.", "error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSwipe(action: SwipeAction, nextDirection: number) {
    if (!currentJob || processing) return;
    setProcessing(true);
    setDirection(nextDirection);
    try {
      await apiFetch("/swipes", {
        method: "POST",
        body: JSON.stringify({ jobId: currentJob.id, action })
      });
      setJobs((previous) => previous.slice(1));
      setViewed((value) => value + 1);
      showToast(action === "LIKE" ? "Application sent." : action === "SAVE" ? "Saved for later." : "Skipped.", "success");
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Swipe failed.", "error");
    } finally {
      setProcessing(false);
    }
  }

  async function undo() {
    if (processing) return;
    setProcessing(true);
    try {
      await apiFetch("/swipes/undo", { method: "POST" });
      await loadFeed();
      showToast("Last swipe restored.", "success");
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Nothing to undo.", "error");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <aside className="lg:pt-12">
        <Badge tone="teal">Main feature</Badge>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-ink sm:text-5xl">Swipe your next opportunity into view.</h1>
        <p className="mt-4 text-base leading-7 text-ink/62">Apply filters, then drag the card right to apply or left to skip. Expired jobs are filtered out by the Java backend.</p>
        <div className="mt-7 rounded-3xl border border-ink/8 bg-white p-5 shadow-card">
          <div className="grid gap-3 sm:grid-cols-2">
            <Select label="Job type" value={filters.jobType} onChange={(value) => setFilters({ ...filters, jobType: value as Filters["jobType"] })} options={jobTypeOptions} />
            <Select label="Experience" value={filters.experienceLevel} onChange={(value) => setFilters({ ...filters, experienceLevel: value as Filters["experienceLevel"] })} options={experienceOptions} />
            <Select label="Work mode" value={filters.workMode} onChange={(value) => setFilters({ ...filters, workMode: value as Filters["workMode"] })} options={workModeOptions} />
            <Input label="Location" value={filters.location} onChange={(value) => setFilters({ ...filters, location: value })} />
            <Input label="Skill" value={filters.skill} onChange={(value) => setFilters({ ...filters, skill: value })} />
            <label className="flex items-center gap-2 rounded-2xl bg-paper px-3 py-2 text-sm font-bold text-ink/66">
              <input type="checkbox" checked={filters.activeOnly} onChange={(event) => setFilters({ ...filters, activeOnly: event.target.checked })} />
              Active jobs only
            </label>
          </div>
          <Button type="button" variant="secondary" className="mt-4 w-full" onClick={() => loadFeed()}>
            Apply filters
          </Button>
        </div>
        <div className="mt-4 rounded-3xl border border-ink/8 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-sm font-bold text-ink/62">
            <span>{viewed} viewed / {jobs.length} remaining</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink/8">
            <div className="h-full rounded-full bg-ocean transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <Button type="button" variant="secondary" onClick={undo} disabled={processing} className="mt-4">
          <RotateCcw className="h-4 w-4" />
          Undo last swipe
        </Button>
      </aside>

      <section className="min-h-[640px]">
        <div className="relative mx-auto max-w-xl">
          <div className="absolute inset-x-8 top-8 h-full rounded-[2rem] bg-ink/8" />
          <div className="absolute inset-x-4 top-4 h-full rounded-[2rem] bg-white/70 shadow-card" />
          <AnimatePresence custom={direction} mode="wait">
            {currentJob ? (
              <motion.div key={currentJob.id} custom={direction} variants={cardVariants} initial="enter" animate="center" exit="exit">
                <SwipeCard job={currentJob} onSwipe={handleSwipe} processing={processing} />
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <EmptyState icon={Sparkles} title="No matching jobs" description="Try loosening filters or undo the last swipe to bring a card back." />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mx-auto mt-6 grid max-w-xl grid-cols-3 gap-3">
          <Button type="button" variant="danger" size="lg" disabled={!currentJob || processing} onClick={() => handleSwipe("REJECT", -1)} title="Reject job">
            <X className="h-5 w-5" />
            <span className="hidden sm:inline">Reject</span>
          </Button>
          <Button type="button" variant="secondary" size="lg" disabled={!currentJob || processing} onClick={() => handleSwipe("SAVE", 1)} title="Save job">
            <Bookmark className="h-5 w-5" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button type="button" variant="success" size="lg" disabled={!currentJob || processing} onClick={() => handleSwipe("LIKE", 1)} title="Apply">
            <Check className="h-5 w-5" />
            <span className="hidden sm:inline">Apply</span>
          </Button>
        </div>
        <p className="mx-auto mt-4 flex max-w-xl items-center justify-center gap-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink/42">
          <ArrowLeft className="h-4 w-4" />
          Drag left or right
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </p>
      </section>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="text-xs font-black uppercase tracking-[0.16em] text-ink/42">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring mt-2 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-3 text-sm font-bold normal-case tracking-normal text-ink">
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-black uppercase tracking-[0.16em] text-ink/42">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring mt-2 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-3 text-sm font-bold normal-case tracking-normal text-ink" />
    </label>
  );
}
