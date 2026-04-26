export type UserRole = "JOB_SEEKER" | "RECRUITER" | "ADMIN";
export type JobType = "INTERNSHIP" | "FULL_TIME" | "PART_TIME" | "REMOTE" | "HYBRID" | "CONTRACT";
export type WorkMode = "REMOTE" | "HYBRID" | "ON_SITE";
export type ExperienceLevel = "FRESHER" | "ZERO_TO_ONE" | "ONE_TO_TWO" | "TWO_PLUS";
export type SwipeAction = "LIKE" | "REJECT" | "SAVE";
export type ApplicationStatus = "APPLIED" | "VIEWED" | "SHORTLISTED" | "REJECTED" | "WITHDRAWN";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePictureUrl?: string | null;
  acceptedTerms: boolean;
  acceptedTermsAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  token: string;
  user: ApiUser;
};

export type JobSeekerProfile = {
  id: string;
  user: ApiUser;
  phone?: string | null;
  githubUrl?: string | null;
  resumePdfUrl?: string | null;
  education?: string | null;
  degree?: string | null;
  college?: string | null;
  passingYear?: number | null;
  cgpaOrPercentage?: string | null;
  skills?: string | null;
  experienceLevel?: ExperienceLevel | null;
  preferredLocation?: string | null;
  preferredJobType?: JobType | null;
  createdAt: string;
  updatedAt: string;
};

export type CompanyProfile = {
  id: string;
  recruiterId: string;
  companyName: string;
  companyLogoUrl?: string | null;
  website?: string | null;
  description?: string | null;
  location?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Job = {
  id: string;
  recruiterId: string;
  title: string;
  companyName: string;
  companyLogoUrl?: string | null;
  location: string;
  jobType: JobType;
  workMode: WorkMode;
  salary: string;
  requiredSkills: string;
  requiredExperienceLevel: ExperienceLevel;
  description: string;
  eligibility: string;
  deadline: string;
  active: boolean;
  expired: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Swipe = {
  id: string;
  jobSeekerId: string;
  job: Job;
  action: SwipeAction;
  createdAt: string;
};

export type JobApplication = {
  id: string;
  jobSeekerId: string;
  jobSeekerName: string;
  jobSeekerEmail: string;
  job: Job;
  resumePdfUrl?: string | null;
  githubUrl?: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdminDashboard = {
  totalUsers: number;
  totalJobSeekers: number;
  totalRecruiters: number;
  totalJobs: number;
  activeJobs: number;
  expiredJobs: number;
  totalApplications: number;
  totalSwipes: number;
  users: ApiUser[];
  jobSeekers: JobSeekerProfile[];
  recruiters: CompanyProfile[];
  jobs: Job[];
  applications: JobApplication[];
  swipes: Swipe[];
};

export type RecruiterDashboard = {
  company: CompanyProfile;
  jobs: Job[];
  applications: JobApplication[];
};
