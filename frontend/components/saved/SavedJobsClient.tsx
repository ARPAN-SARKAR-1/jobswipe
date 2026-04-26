"use client";

import { CheckCircle2 } from "lucide-react";
import { JobMiniCard } from "@/components/jobs/JobMiniCard";
import { Button } from "@/components/ui/Button";
import { apiFetch, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast";
import type { Swipe } from "@/types";

export function SavedJobsClient({ swipes, onChanged }: { swipes: Swipe[]; onChanged: () => void }) {
  const { showToast } = useToast();

  async function apply(jobId: string) {
    try {
      await apiFetch("/applications", {
        method: "POST",
        body: JSON.stringify({ jobId })
      });
      showToast("Application submitted.", "success");
      onChanged();
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Could not apply.", "error");
    }
  }

  return (
    <div className="grid gap-4">
      {swipes.map((swipe) => (
        <JobMiniCard
          key={swipe.id}
          job={swipe.job}
          footer={
            <Button type="button" variant="success" onClick={() => apply(swipe.job.id)}>
              <CheckCircle2 className="h-4 w-4" />
              Apply
            </Button>
          }
        />
      ))}
    </div>
  );
}
