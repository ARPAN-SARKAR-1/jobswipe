import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="glass-panel flex min-h-[280px] flex-col items-center justify-center rounded-3xl p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-ink/60">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
