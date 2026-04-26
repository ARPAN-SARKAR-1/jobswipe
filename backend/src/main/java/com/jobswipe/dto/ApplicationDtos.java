package com.jobswipe.dto;

import com.jobswipe.entity.Application;
import com.jobswipe.entity.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public final class ApplicationDtos {
  private ApplicationDtos() {
  }

  public record ApplicationRequest(
      @NotBlank String jobId
  ) {
  }

  public record ApplicationStatusRequest(
      @NotNull ApplicationStatus status
  ) {
  }

  public record ApplicationResponse(
      String id,
      String jobSeekerId,
      String jobSeekerName,
      String jobSeekerEmail,
      JobDtos.JobResponse job,
      String resumePdfUrl,
      String githubUrl,
      ApplicationStatus status,
      Instant createdAt,
      Instant updatedAt
  ) {
    public static ApplicationResponse from(Application application) {
      return new ApplicationResponse(
          application.getId(),
          application.getJobSeeker().getId(),
          application.getJobSeeker().getName(),
          application.getJobSeeker().getEmail(),
          JobDtos.JobResponse.from(application.getJob()),
          application.getResumePdfUrl(),
          application.getGithubUrl(),
          application.getStatus(),
          application.getCreatedAt(),
          application.getUpdatedAt()
      );
    }
  }
}
