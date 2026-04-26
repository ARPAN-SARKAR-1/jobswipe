"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import type { ApplicationStatus } from "@/types";

const statuses: ApplicationStatus[] = ["APPLIED", "VIEWED", "SHORTLISTED", "REJECTED"];

export function ApplicationStatusSelect({
  applicationId,
  initialStatus
}: {
  applicationId: string;
  initialStatus: ApplicationStatus;
}) {
  const [status, setStatus] = useState<ApplicationStatus>(initialStatus);
  const [saving, setSaving] = useState(false);

  async function update(nextStatus: ApplicationStatus) {
    setStatus(nextStatus);
    setSaving(true);
    await apiFetch(`/recruiter/applications/${applicationId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: nextStatus })
    });
    setSaving(false);
  }

  return (
    <div>
      <select
        value={status}
        onChange={(event) => update(event.target.value as ApplicationStatus)}
        className="focus-ring h-10 rounded-full border border-ink/10 bg-white px-3 text-sm font-bold text-ink/70"
      >
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item.replace("_", " ")}
          </option>
        ))}
      </select>
      {saving ? <span className="ml-2 text-xs font-semibold text-ink/44">Saving...</span> : null}
    </div>
  );
}
