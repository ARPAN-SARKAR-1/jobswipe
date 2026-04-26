"use client";

import { AnimatePresence, motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft, Bookmark, BriefcaseBusiness, Check, MapPin, RotateCcw, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import type { PublicJob } from "@/types";

type SwipeAction = "LIKE" | "REJECT" | "SAVE";

const actionCopy: Record<SwipeAction, string> = {
  LIKE: "Application sent. Nice match.",
  REJECT: "Skipped. Finding a better fit.",
  SAVE: "Saved for later."
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

function SwipeCard({
  job,
  onSwipe,
  processing
}: {
  job: PublicJob;
  onSwipe: (action: SwipeAction, direction: number) => void;
  processing: boolean;
}) {
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
      <motion.div
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute right-6 top-6 rotate-6 rounded-2xl border-2 border-ocean px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-ocean"
      >
        Apply
      </motion.div>
      <motion.div
        style={{ opacity: rejectOpacity }}
        className="pointer-events-none absolute left-6 top-6 -rotate-6 rounded-2xl border-2 border-rose-500 px-4 py-2 text-sm font-black uppercase tracking-[0.18em] text-rose-600"
      >
        Skip
      </motion.div>

      <div className="flex items-start justify-between gap-5">
        <div>
          <Badge tone={job.jobType === "Remote" ? "violet" : job.jobType === "Internship" ? "teal" : "neutral"}>
            {job.jobType}
          </Badge>
          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">{job.title}</h2>
          <p className="mt-2 text-base font-bold text-ink/58">{job.companyName}</p>
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-white">
          <BriefcaseBusiness className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink/8 bg-paper px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/36">Location</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-bold text-ink/72">
            <MapPin className="h-4 w-4" />
            {job.location}
          </p>
        </div>
        <div className="rounded-2xl border border-ink/8 bg-paper px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/36">Stipend / salary</p>
          <p className="mt-1 text-sm font-bold text-ink/72">{job.salary}</p>
        </div>
        <div className="rounded-2xl border border-ink/8 bg-paper px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/36">Experience</p>
          <p className="mt-1 text-sm font-bold text-ink/72">Student / Fresher</p>
        </div>
        <div className="rounded-2xl border border-ink/8 bg-paper px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/36">Deadline</p>
          <p className="mt-1 text-sm font-bold text-ink/72">{formatDate(job.deadline)}</p>
        </div>
      </div>

      <p className="mt-6 text-base leading-7 text-ink/66">{job.description}</p>
      <p className="mt-3 text-sm leading-6 text-ink/52">{job.eligibility}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>
    </motion.article>
  );
}

export function SwipeDeck({
  initialJobs,
  initialViewed,
  totalJobs
}: {
  initialJobs: PublicJob[];
  initialViewed: number;
  totalJobs: number;
}) {
  const [jobs, setJobs] = useState(initialJobs);
  const [viewed, setViewed] = useState(initialViewed);
  const [total, setTotal] = useState(totalJobs);
  const [direction, setDirection] = useState(1);
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  const currentJob = jobs[0];
  const progress = useMemo(() => {
    if (!total) return 0;
    return Math.min(100, Math.round((viewed / total) * 100));
  }, [total, viewed]);

  async function refreshDeck(nextMessage?: string) {
    const response = await fetch("/api/jobs/swipe");
    if (!response.ok) return;
    const data = await response.json();
    setJobs(data.jobs);
    setViewed(data.viewedCount);
    setTotal(data.totalJobs);
    if (nextMessage) setMessage(nextMessage);
  }

  async function handleSwipe(action: SwipeAction, nextDirection: number) {
    if (!currentJob || processing) return;
    setProcessing(true);
    setDirection(nextDirection);

    const response = await fetch("/api/swipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: currentJob.id, action })
    });

    const data = await response.json();
    setProcessing(false);

    if (!response.ok) {
      setMessage(data.message ?? "Action failed.");
      return;
    }

    setJobs((previous) => previous.slice(1));
    setViewed((value) => Math.min(total, value + 1));
    setMessage(data.message ?? actionCopy[action]);
  }

  async function undo() {
    if (processing) return;
    setProcessing(true);
    const response = await fetch("/api/swipes/undo", { method: "POST" });
    const data = await response.json();
    setProcessing(false);

    if (!response.ok) {
      setMessage(data.message ?? "Nothing to undo.");
      return;
    }

    await refreshDeck(data.message);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <aside className="lg:pt-12">
        <Badge tone="teal">Main feature</Badge>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-ink sm:text-5xl">Swipe your next opportunity into view.</h1>
        <p className="mt-4 text-base leading-7 text-ink/62">
          Drag the card on desktop or mobile. Swipe right to apply, left to skip, or use the action buttons when presenting the demo.
        </p>
        <div className="mt-7 rounded-3xl border border-ink/8 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between text-sm font-bold text-ink/62">
            <span>{viewed} of {total} jobs viewed</span>
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
        {message ? <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-ink/70 shadow-card">{message}</p> : null}
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
                <EmptyState
                  icon={Sparkles}
                  title="All jobs reviewed"
                  description="You have reached the end of the current recommendation stack. Undo the last swipe or check saved jobs and applications."
                />
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
