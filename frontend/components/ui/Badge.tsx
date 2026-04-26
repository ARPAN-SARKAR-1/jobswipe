import { cn } from "@/lib/utils";

const badgeTone = {
  neutral: "bg-ink/6 text-ink",
  teal: "bg-teal-50 text-teal-800",
  amber: "bg-amber-50 text-amber-800",
  rose: "bg-rose-50 text-rose-800",
  violet: "bg-violet-50 text-violet-800"
};

export function Badge({
  children,
  tone = "neutral",
  className
}: {
  children: React.ReactNode;
  tone?: keyof typeof badgeTone;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", badgeTone[tone], className)}>
      {children}
    </span>
  );
}
