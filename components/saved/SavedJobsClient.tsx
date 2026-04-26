"use client";

import { BookmarkCheck, BookmarkX, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { JobMiniCard } from "@/components/jobs/JobMiniCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { SavedJob } from "@/types";

export function SavedJobsClient({ initialJobs }: { initialJobs: SavedJob[] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [busyJob, setBusyJob] = useState("");
  const [message, setMessage] = useState("");

  async function unsave(jobId: string) {
    setBusyJob(jobId);
    const response = await fetch("/api/saved", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId })
    });
    const data = await response.json();
    setBusyJob("");

    if (response.ok) {
      setJobs((previous) => previous.filter((item) => item.job.id !== jobId));
    }
    setMessage(data.message ?? "Updated.");
  }

  async function apply(jobId: string) {
    setBusyJob(jobId);
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId })
    });
    const data = await response.json();
    setBusyJob("");

    if (response.ok) {
      setJobs((previous) => previous.filter((item) => item.job.id !== jobId));
    }
    setMessage(data.message ?? "Updated.");
  }

  return (
    <div>
      {message ? <p className="mb-5 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-ink/70 shadow-card">{message}</p> : null}
      {jobs.length ? (
        <div className="grid gap-4">
          {jobs.map((item) => (
          <JobMiniCard
            key={item.swipeId}
            job={item.job}
            footer={
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="secondary" onClick={() => unsave(item.job.id)} disabled={busyJob === item.job.id}>
                  {busyJob === item.job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookmarkX className="h-4 w-4" />}
                  Unsave
                </Button>
                <Button type="button" variant="success" onClick={() => apply(item.job.id)} disabled={busyJob === item.job.id}>
                  <CheckCircle2 className="h-4 w-4" />
                  Apply
                </Button>
              </div>
            }
          />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookmarkCheck}
          title="Saved list cleared"
          description="You can return to the swipe deck and save fresh opportunities at any time."
        />
      )}
    </div>
  );
}
