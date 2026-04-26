import { prisma } from "@/lib/prisma";
import { splitSkills } from "@/lib/utils";
import type { ApplicationStatus, PublicJob, RecruiterApplication, SavedJob, StudentApplication } from "@/types";

const jobSelect = {
  id: true,
  title: true,
  companyName: true,
  location: true,
  jobType: true,
  salary: true,
  skills: true,
  description: true,
  eligibility: true,
  deadline: true,
  createdAt: true,
  isActive: true
};

type JobRecord = {
  id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  salary: string;
  skills: string;
  description: string;
  eligibility: string;
  deadline: Date;
  createdAt: Date;
  isActive: boolean;
};

export function serializeJob(job: JobRecord): PublicJob {
  return {
    ...job,
    skills: splitSkills(job.skills),
    deadline: job.deadline.toISOString(),
    createdAt: job.createdAt.toISOString()
  };
}

export async function getStudentDashboard(userId: string) {
  const [profile, activeJobs, savedJobs, applications] = await Promise.all([
    prisma.studentProfile.findUnique({ where: { userId } }),
    prisma.job.count({ where: { isActive: true } }),
    prisma.swipe.count({ where: { userId, action: "SAVE" } }),
    prisma.application.count({ where: { userId } })
  ]);

  const completedFields = profile
    ? [
        profile.phone,
        profile.skills,
        profile.education,
        profile.resumeUrl,
        profile.preferredLocation,
        profile.preferredJobType,
        profile.experienceLevel
      ].filter(Boolean).length
    : 0;

  return {
    profileCompletion: Math.round((completedFields / 7) * 100),
    activeJobs,
    savedJobs,
    applications,
    profile
  };
}

export async function getSwipeJobs(userId: string) {
  const [jobs, viewedCount, totalJobs] = await Promise.all([
    prisma.job.findMany({
      where: {
        isActive: true,
        swipes: {
          none: { userId }
        }
      },
      select: jobSelect,
      orderBy: { createdAt: "desc" }
    }),
    prisma.swipe.count({ where: { userId } }),
    prisma.job.count({ where: { isActive: true } })
  ]);

  return {
    jobs: jobs.map(serializeJob),
    viewedCount,
    totalJobs
  };
}

export async function getSavedJobs(userId: string): Promise<SavedJob[]> {
  const swipes = await prisma.swipe.findMany({
    where: { userId, action: "SAVE" },
    include: {
      job: {
        select: jobSelect
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return swipes.map((swipe) => ({
    swipeId: swipe.id,
    createdAt: swipe.createdAt.toISOString(),
    job: serializeJob(swipe.job)
  }));
}

export async function getStudentApplications(userId: string): Promise<StudentApplication[]> {
  const applications = await prisma.application.findMany({
    where: { userId },
    include: {
      job: {
        select: jobSelect
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return applications.map((application) => ({
    id: application.id,
    status: application.status as ApplicationStatus,
    createdAt: application.createdAt.toISOString(),
    job: serializeJob(application.job)
  }));
}

export async function getRecruiterDashboard(userId: string) {
  const [company, jobs, applications] = await Promise.all([
    prisma.companyProfile.findUnique({ where: { userId } }),
    prisma.job.findMany({
      where: { recruiterId: userId },
      select: {
        ...jobSelect,
        _count: {
          select: { applications: true, swipes: true }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.application.findMany({
      where: {
        job: { recruiterId: userId }
      },
      include: {
        user: { select: { name: true, email: true } },
        job: { select: { title: true } }
      },
      orderBy: { createdAt: "desc" }
    })
  ]);

  const recruiterApplications: RecruiterApplication[] = applications.map((application) => ({
    id: application.id,
    status: application.status as ApplicationStatus,
    createdAt: application.createdAt.toISOString(),
    applicantName: application.user.name,
    applicantEmail: application.user.email,
    jobTitle: application.job.title
  }));

  return {
    company,
    jobs: jobs.map((job) => ({
      ...serializeJob(job),
      applications: job._count.applications,
      swipes: job._count.swipes
    })),
    applications: recruiterApplications
  };
}

export async function getAdminDashboard() {
  const [totalUsers, totalJobs, totalApplications, recruiters, jobs] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.application.count(),
    prisma.user.count({ where: { role: "RECRUITER" } }),
    prisma.job.findMany({
      select: {
        id: true,
        title: true,
        companyName: true,
        isActive: true,
        createdAt: true,
        recruiter: { select: { email: true } },
        _count: { select: { applications: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 8
    })
  ]);

  return {
    totalUsers,
    totalJobs,
    totalApplications,
    recruiters,
    jobs: jobs.map((job) => ({
      id: job.id,
      title: job.title,
      companyName: job.companyName,
      recruiterEmail: job.recruiter.email,
      isActive: job.isActive,
      createdAt: job.createdAt.toISOString(),
      applications: job._count.applications
    }))
  };
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  return prisma.application.update({
    where: { id },
    data: { status }
  });
}
