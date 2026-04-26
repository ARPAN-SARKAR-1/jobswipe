import type { ApplicationStatus, ExperienceLevel, JobType, UserRole, WorkMode } from "@/types";

export const roleLabels: Record<UserRole, string> = {
  JOB_SEEKER: "Job Seeker",
  RECRUITER: "Recruiter",
  ADMIN: "Admin"
};

export const jobTypeLabels: Record<JobType, string> = {
  INTERNSHIP: "Internship",
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  CONTRACT: "Contract"
};

export const workModeLabels: Record<WorkMode, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ON_SITE: "On-site"
};

export const experienceLabels: Record<ExperienceLevel, string> = {
  FRESHER: "Fresher",
  ZERO_TO_ONE: "0-1 years",
  ONE_TO_TWO: "1-2 years",
  TWO_PLUS: "2+ years"
};

export const statusLabels: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  VIEWED: "Viewed",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn"
};

export const jobTypeOptions = Object.entries(jobTypeLabels).map(([value, label]) => ({ value, label }));
export const workModeOptions = Object.entries(workModeLabels).map(([value, label]) => ({ value, label }));
export const experienceOptions = Object.entries(experienceLabels).map(([value, label]) => ({ value, label }));
