export type UserRole = "STUDENT" | "RECRUITER" | "ADMIN";

export type SwipeAction = "LIKE" | "REJECT" | "SAVE";

export type ApplicationStatus = "APPLIED" | "VIEWED" | "SHORTLISTED" | "REJECTED";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type PublicJob = {
  id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  salary: string;
  skills: string[];
  description: string;
  eligibility: string;
  deadline: string;
  createdAt: string;
  isActive: boolean;
};

export type SavedJob = {
  swipeId: string;
  createdAt: string;
  job: PublicJob;
};

export type StudentApplication = {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  job: PublicJob;
};

export type RecruiterApplication = {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
};
