import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { JobMiniCard } from "@/components/jobs/JobMiniCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getStudentApplications } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { requireUser } from "@/lib/session";

export default async function ApplicationsPage() {
  const user = await requireUser(["STUDENT"]);
  const applications = await getStudentApplications(user.id);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge tone="violet">Applications</Badge>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">Track every application.</h1>
        <p className="mt-3 text-base text-ink/60">Statuses can be updated by recruiters from their dashboard.</p>
      </div>

      {applications.length ? (
        <div className="grid gap-4">
          {applications.map((application) => (
            <JobMiniCard
              key={application.id}
              job={application.job}
              footer={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={application.status} />
                    <span className="text-sm font-semibold text-ink/50">Applied on {formatDate(application.createdAt)}</span>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="Swipe right or click Apply on a saved job to create your first tracked application."
          action={
            <Link href="/swipe">
              <Button>Find jobs</Button>
            </Link>
          }
        />
      )}
    </section>
  );
}
