package com.jobswipe.dto;

import com.jobswipe.entity.UserRole;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
  private AuthDtos() {
  }

  public record RegisterRequest(
      @NotBlank String name,
      @Email @NotBlank String email,
      @Size(min = 8) String password,
      @Size(min = 8) String confirmPassword,
      @NotNull UserRole role,
      @AssertTrue boolean acceptedTerms
  ) {
  }

  public record LoginRequest(
      @Email @NotBlank String email,
      @NotBlank String password
  ) {
  }

  public record AuthResponse(
      String token,
      UserResponse user
  ) {
  }

  public record ForgotPasswordRequest(
      @Email @NotBlank String email
  ) {
  }

  public record ForgotPasswordResponse(
      String message,
      String resetToken,
      String resetLink
  ) {
  }

  public record ResetPasswordRequest(
      @NotBlank String token,
      @Size(min = 8) String newPassword,
      @Size(min = 8) String confirmPassword
  ) {
  }
}
