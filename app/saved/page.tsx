import { BookmarkCheck } from "lucide-react";
import Link from "next/link";
import { SavedJobsClient } from "@/components/saved/SavedJobsClient";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getSavedJobs } from "@/lib/data";
import { requireUser } from "@/lib/session";

export default async function SavedJobsPage() {
  const user = await requireUser(["STUDENT"]);
  const savedJobs = await getSavedJobs(user.id);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge tone="amber">Saved jobs</Badge>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">Your bookmarked roles.</h1>
          <p className="mt-3 text-base text-ink/60">Unsave jobs that no longer fit, or apply when you are ready.</p>
        </div>
        <Link href="/swipe">
          <Button variant="secondary">Back to swipe</Button>
        </Link>
      </div>

      {savedJobs.length ? (
        <SavedJobsClient initialJobs={savedJobs} />
      ) : (
        <EmptyState
          icon={BookmarkCheck}
          title="No saved jobs yet"
          description="Save interesting jobs from the swipe deck and they will appear here for later review."
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
