import { BriefcaseBusiness, CalendarClock, IndianRupee, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { absoluteUrl } from "@/lib/api";
import { experienceLabels, jobTypeLabels, workModeLabels } from "@/lib/labels";
import { formatDate, splitSkills } from "@/lib/utils";
import type { Job } from "@/types";

export function JobMiniCard({ job, footer }: { job: Job; footer?: React.ReactNode }) {
  return (
    <article className="glass-panel rounded-3xl p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          {job.companyLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={absoluteUrl(job.companyLogoUrl)} alt="" className="h-14 w-14 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={job.jobType === "REMOTE" ? "violet" : job.jobType === "INTERNSHIP" ? "teal" : "neutral"}>{jobTypeLabels[job.jobType]}</Badge>
              <Badge>{workModeLabels[job.workMode]}</Badge>
              {job.expired ? <Badge tone="rose">Expired</Badge> : null}
              {!job.active ? <Badge tone="rose">Paused</Badge> : null}
            </div>
            <h3 className="mt-3 text-xl font-bold tracking-tight text-ink">{job.title}</h3>
            <p className="mt-1 text-sm font-semibold text-ink/60">{job.companyName}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-ink/62 sm:grid-cols-4">
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {job.location}
        </span>
        <span className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4" />
          {job.salary}
        </span>
        <span className="font-semibold">{experienceLabels[job.requiredExperienceLevel]}</span>
        <span className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4" />
          {formatDate(job.deadline)}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-ink/66">{job.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {splitSkills(job.requiredSkills).map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>

      {footer ? <div className="mt-5 border-t border-ink/8 pt-4">{footer}</div> : null}
    </article>
  );
}
