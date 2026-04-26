import { BriefcaseBusiness, CalendarClock, IndianRupee, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { PublicJob } from "@/types";

export function JobMiniCard({
  job,
  footer
}: {
  job: PublicJob;
  footer?: React.ReactNode;
}) {
  return (
    <article className="glass-panel rounded-3xl p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={job.jobType === "Remote" ? "violet" : job.jobType === "Internship" ? "teal" : "neutral"}>{job.jobType}</Badge>
            {!job.isActive ? <Badge tone="rose">Paused</Badge> : null}
          </div>
          <h3 className="mt-3 text-xl font-bold tracking-tight text-ink">{job.title}</h3>
          <p className="mt-1 text-sm font-semibold text-ink/60">{job.companyName}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-ink/62 sm:grid-cols-3">
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {job.location}
        </span>
        <span className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4" />
          {job.salary}
        </span>
        <span className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4" />
          {formatDate(job.deadline)}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-ink/66">{job.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>

      {footer ? <div className="mt-5 border-t border-ink/8 pt-4">{footer}</div> : null}
    </article>
  );
}
