package com.jobswipe.dto;

import com.jobswipe.entity.User;
import com.jobswipe.entity.UserRole;
import java.time.Instant;

public record UserResponse(
    String id,
    String name,
    String email,
    UserRole role,
    String profilePictureUrl,
    boolean acceptedTerms,
    Instant acceptedTermsAt,
    Instant createdAt,
    Instant updatedAt
) {
  public static UserResponse from(User user) {
    return new UserResponse(
        user.getId(),
        user.getName(),
        user.getEmail(),
        user.getRole(),
        user.getProfilePictureUrl(),
        user.isAcceptedTerms(),
        user.getAcceptedTermsAt(),
        user.getCreatedAt(),
        user.getUpdatedAt()
    );
  }
}
