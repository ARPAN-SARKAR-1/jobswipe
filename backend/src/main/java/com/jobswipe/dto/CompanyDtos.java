package com.jobswipe.dto;

import com.jobswipe.entity.CompanyProfile;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

public final class CompanyDtos {
  private CompanyDtos() {
  }

  public record CompanyProfileRequest(
      @NotBlank String companyName,
      String website,
      String description,
      String location
  ) {
  }

  public record CompanyProfileResponse(
      String id,
      String recruiterId,
      String companyName,
      String companyLogoUrl,
      String website,
      String description,
      String location,
      Instant createdAt,
      Instant updatedAt
  ) {
    public static CompanyProfileResponse from(CompanyProfile profile) {
      return new CompanyProfileResponse(
          profile.getId(),
          profile.getRecruiter().getId(),
          profile.getCompanyName(),
          profile.getCompanyLogoUrl(),
          profile.getWebsite(),
          profile.getDescription(),
          profile.getLocation(),
          profile.getCreatedAt(),
          profile.getUpdatedAt()
      );
    }
  }
}
