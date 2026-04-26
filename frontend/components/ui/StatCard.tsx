import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  helper,
  icon: Icon,
  className
}: {
  title: string;
  value: string | number;
  helper?: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("glass-panel rounded-3xl p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink/55">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-ink">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {helper ? <p className="mt-4 text-sm text-ink/55">{helper}</p> : null}
    </div>
  );
}
