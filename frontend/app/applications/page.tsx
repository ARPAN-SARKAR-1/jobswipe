"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { JobMiniCard } from "@/components/jobs/JobMiniCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiFetch, ApiError } from "@/lib/api";
import { useToast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { useProtected } from "@/hooks/useProtected";
import type { JobApplication } from "@/types";

export default function ApplicationsPage() {
  const { loading } = useProtected(["JOB_SEEKER"]);
  const { showToast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);

  async function load() {
    const data = await apiFetch<JobApplication[]>("/applications/my");
    setApplications(data);
  }

  useEffect(() => {
    load().catch(() => showToast("Could not load applications.", "error"));
  }, [showToast]);

  async function withdraw(id: string) {
    if (!window.confirm("Withdraw this application?")) return;
    try {
      await apiFetch<JobApplication>(`/applications/${id}/withdraw`, { method: "PUT" });
      showToast("Application withdrawn.", "success");
      await load();
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : "Withdraw failed.", "error");
    }
  }

  if (loading) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge tone="violet">Applications</Badge>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-ink">Track every application.</h1>
        <p className="mt-3 text-base text-ink/60">Withdraw APPLIED applications and keep withdrawn ones in your history.</p>
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
                  {application.status === "APPLIED" ? (
                    <Button type="button" variant="danger" onClick={() => withdraw(application.id)}>
                      Withdraw
                    </Button>
                  ) : null}
                </div>
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No applications yet"
          description="Swipe right or click Apply to create your first tracked application."
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
