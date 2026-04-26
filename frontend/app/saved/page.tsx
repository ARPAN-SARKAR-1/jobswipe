"use client";

import { BookmarkCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SavedJobsClient } from "@/components/saved/SavedJobsClient";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { useProtected } from "@/hooks/useProtected";
import type { Swipe } from "@/types";

export default function SavedJobsPage() {
  const { loading } = useProtected(["JOB_SEEKER"]);
  const { showToast } = useToast();
  const [swipes, setSwipes] = useState<Swipe[]>([]);

  async function load() {
    const history = await apiFetch<Swipe[]>("/swipes/history");
    setSwipes(history.filter((swipe) => swipe.action === "SAVE"));
  }

  useEffect(() => {
    load().catch(() => showToast("Could not load saved jobs.", "error"));
  }, [showToast]);

  if (loading) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="amber">Saved jobs</Badge>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">Your bookmarked roles.</h1>
          <p className="mt-3 text-base text-ink/60">Saved jobs come from the swipe deck.</p>
        </div>
        <Link href="/swipe">
          <Button variant="secondary">Back to swipe</Button>
        </Link>
      </div>

      {swipes.length ? (
        <SavedJobsClient swipes={swipes} onChanged={load} />
      ) : (
        <EmptyState
          icon={BookmarkCheck}
          title="No saved jobs yet"
          description="Save interesting jobs from the swipe deck and they will appear here."
          action={
            <Link href="/swipe">
              <Button>Start swiping</Button>
            </Link>
          }
        />
      )}
    </section>
  );
}
