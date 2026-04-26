"use client";

import { PauseCircle, PlayCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function AdminJobToggle({ jobId, initialActive }: { jobId: string; initialActive: boolean }) {
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const response = await fetch(`/api/admin/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !active })
    });
    setLoading(false);

    if (response.ok) {
      setActive((value) => !value);
    }
  }

  return (
    <Button type="button" variant="secondary" size="sm" onClick={toggle} disabled={loading}>
      {active ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
      {active ? "Pause" : "Activate"}
    </Button>
  );
}
