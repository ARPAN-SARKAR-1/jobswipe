package com.jobswipe.dto;

import com.jobswipe.entity.ExperienceLevel;
import com.jobswipe.entity.JobSeekerProfile;
import com.jobswipe.entity.JobType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import java.time.Instant;

public final class ProfileDtos {
  private ProfileDtos() {
  }

  public record JobSeekerProfileRequest(
      String phone,
      @Pattern(regexp = "^(https://)?(www\\.)?github\\.com/[A-Za-z0-9-]+/?$", message = "Enter a valid GitHub profile URL.")
      String githubUrl,
      String education,
      String degree,
      String college,
      @Min(1950) Integer passingYear,
      String cgpaOrPercentage,
      String skills,
      ExperienceLevel experienceLevel,
      String preferredLocation,
      JobType preferredJobType
  ) {
  }

  public record JobSeekerProfileResponse(
      String id,
      UserResponse user,
      String phone,
      String githubUrl,
      String resumePdfUrl,
      String education,
      String degree,
      String college,
      Integer passingYear,
      String cgpaOrPercentage,
      String skills,
      ExperienceLevel experienceLevel,
      String preferredLocation,
      JobType preferredJobType,
      Instant createdAt,
      Instant updatedAt
  ) {
    public static JobSeekerProfileResponse from(JobSeekerProfile profile) {
      return new JobSeekerProfileResponse(
          profile.getId(),
          UserResponse.from(profile.getUser()),
          profile.getPhone(),
          profile.getGithubUrl(),
          profile.getResumePdfUrl(),
          profile.getEducation(),
          profile.getDegree(),
          profile.getCollege(),
          profile.getPassingYear(),
          profile.getCgpaOrPercentage(),
          profile.getSkills(),
          profile.getExperienceLevel(),
          profile.getPreferredLocation(),
          profile.getPreferredJobType(),
          profile.getCreatedAt(),
          profile.getUpdatedAt()
      );
    }
  }
}
