import { Badge } from "@/components/ui/Badge";
import { statusLabels } from "@/lib/labels";
import type { ApplicationStatus } from "@/types";

const tone: Record<ApplicationStatus, "teal" | "amber" | "violet" | "rose" | "neutral"> = {
  APPLIED: "teal",
  VIEWED: "amber",
  SHORTLISTED: "violet",
  REJECTED: "rose",
  WITHDRAWN: "neutral"
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge tone={tone[status]}>{statusLabels[status]}</Badge>;
}
