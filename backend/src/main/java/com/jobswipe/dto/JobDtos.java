package com.jobswipe.dto;

import com.jobswipe.entity.ExperienceLevel;
import com.jobswipe.entity.Job;
import com.jobswipe.entity.JobType;
import com.jobswipe.entity.WorkMode;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;

public final class JobDtos {
  private JobDtos() {
  }

  public record JobRequest(
      @NotBlank String title,
      @NotBlank String companyName,
      String companyLogoUrl,
      @NotBlank String location,
      @NotNull JobType jobType,
      @NotNull WorkMode workMode,
      @NotBlank String salary,
      @NotBlank String requiredSkills,
      @NotNull ExperienceLevel requiredExperienceLevel,
      @Size(min = 20) String description,
      @Size(min = 10) String eligibility,
      @FutureOrPresent LocalDate deadline,
      Boolean active
  ) {
  }

  public record JobResponse(
      String id,
      String recruiterId,
      String title,
      String companyName,
      String companyLogoUrl,
      String location,
      JobType jobType,
      WorkMode workMode,
      String salary,
      String requiredSkills,
      ExperienceLevel requiredExperienceLevel,
      String description,
      String eligibility,
      LocalDate deadline,
      boolean active,
      boolean expired,
      Instant createdAt,
      Instant updatedAt
  ) {
    public static JobResponse from(Job job) {
      return new JobResponse(
          job.getId(),
          job.getRecruiter().getId(),
          job.getTitle(),
          job.getCompanyName(),
          job.getCompanyLogoUrl(),
          job.getLocation(),
          job.getJobType(),
          job.getWorkMode(),
          job.getSalary(),
          job.getRequiredSkills(),
          job.getRequiredExperienceLevel(),
          job.getDescription(),
          job.getEligibility(),
          job.getDeadline(),
          job.isActive(),
          job.isExpired(),
          job.getCreatedAt(),
          job.getUpdatedAt()
      );
    }
  }

  public record JobFilters(
      JobType jobType,
      ExperienceLevel experienceLevel,
      String location,
      String skill,
      WorkMode workMode,
      Boolean activeOnly,
      String deadlineStatus
  ) {
  }
}
