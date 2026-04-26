import { Badge } from "@/components/ui/Badge";
import type { ApplicationStatus } from "@/types";

const tone: Record<ApplicationStatus, "teal" | "amber" | "violet" | "rose"> = {
  APPLIED: "teal",
  VIEWED: "amber",
  SHORTLISTED: "violet",
  REJECTED: "rose"
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <Badge tone={tone[status]}>{status.replace("_", " ")}</Badge>;
}
