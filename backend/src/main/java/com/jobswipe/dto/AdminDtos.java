package com.jobswipe.dto;

import java.util.List;

public final class AdminDtos {
  private AdminDtos() {
  }

  public record AdminDashboardResponse(
      long totalUsers,
      long totalJobSeekers,
      long totalRecruiters,
      long totalJobs,
      long activeJobs,
      long expiredJobs,
      long totalApplications,
      long totalSwipes,
      List<UserResponse> users,
      List<ProfileDtos.JobSeekerProfileResponse> jobSeekers,
      List<CompanyDtos.CompanyProfileResponse> recruiters,
      List<JobDtos.JobResponse> jobs,
      List<ApplicationDtos.ApplicationResponse> applications,
      List<SwipeDtos.SwipeResponse> swipes
  ) {
  }
}
