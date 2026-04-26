package com.jobswipe.service;

import com.jobswipe.config.AppProperties;
import com.jobswipe.dto.AuthDtos.AuthResponse;
import com.jobswipe.dto.AuthDtos.ForgotPasswordRequest;
import com.jobswipe.dto.AuthDtos.ForgotPasswordResponse;
import com.jobswipe.dto.AuthDtos.LoginRequest;
import com.jobswipe.dto.AuthDtos.RegisterRequest;
import com.jobswipe.dto.AuthDtos.ResetPasswordRequest;
import com.jobswipe.dto.UserResponse;
import com.jobswipe.entity.CompanyProfile;
import com.jobswipe.entity.JobSeekerProfile;
import com.jobswipe.entity.PasswordResetToken;
import com.jobswipe.entity.User;
import com.jobswipe.entity.UserRole;
import com.jobswipe.exception.ApiException;
import com.jobswipe.repository.CompanyProfileRepository;
import com.jobswipe.repository.JobSeekerProfileRepository;
import com.jobswipe.repository.PasswordResetTokenRepository;
import com.jobswipe.repository.UserRepository;
import com.jobswipe.security.JwtService;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private static final Logger log = LoggerFactory.getLogger(AuthService.class);
  private final UserRepository userRepository;
  private final JobSeekerProfileRepository jobSeekerProfileRepository;
  private final CompanyProfileRepository companyProfileRepository;
  private final PasswordResetTokenRepository passwordResetTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AppProperties appProperties;

  public AuthService(
      UserRepository userRepository,
      JobSeekerProfileRepository jobSeekerProfileRepository,
      CompanyProfileRepository companyProfileRepository,
      PasswordResetTokenRepository passwordResetTokenRepository,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      AppProperties appProperties
  ) {
    this.userRepository = userRepository;
    this.jobSeekerProfileRepository = jobSeekerProfileRepository;
    this.companyProfileRepository = companyProfileRepository;
    this.passwordResetTokenRepository = passwordResetTokenRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.appProperties = appProperties;
  }

  @Transactional
  public AuthResponse register(RegisterRequest request) {
    if (request.role() == UserRole.ADMIN) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Admin accounts cannot be self-registered.");
    }
    if (!request.password().equals(request.confirmPassword())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Password and confirm password must match.");
    }
    if (userRepository.existsByEmailIgnoreCase(request.email())) {
      throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists.");
    }

    User user = new User();
    user.setName(request.name().trim());
    user.setEmail(request.email().trim().toLowerCase());
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setRole(request.role());
    user.setAcceptedTerms(true);
    user.setAcceptedTermsAt(Instant.now());
    userRepository.save(user);

    if (request.role() == UserRole.JOB_SEEKER) {
      JobSeekerProfile profile = new JobSeekerProfile();
      profile.setUser(user);
      jobSeekerProfileRepository.save(profile);
    } else if (request.role() == UserRole.RECRUITER) {
      CompanyProfile profile = new CompanyProfile();
      profile.setRecruiter(user);
      profile.setCompanyName(user.getName() + "'s Company");
      profile.setDescription("Company profile pending.");
      companyProfileRepository.save(profile);
    }

    return new AuthResponse(jwtService.createToken(user), UserResponse.from(user));
  }

  public AuthResponse login(LoginRequest request) {
    User user = userRepository.findByEmailIgnoreCase(request.email())
        .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));
    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
    }
    return new AuthResponse(jwtService.createToken(user), UserResponse.from(user));
  }

  @Transactional
  public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
    User user = userRepository.findByEmailIgnoreCase(request.email())
        .orElse(null);

    if (user == null) {
      return new ForgotPasswordResponse("If the email exists, a reset link has been generated.", null, null);
    }

    PasswordResetToken resetToken = new PasswordResetToken();
    resetToken.setUser(user);
    resetToken.setToken(UUID.randomUUID().toString().replace("-", ""));
    resetToken.setExpiryDate(Instant.now().plus(30, ChronoUnit.MINUTES));
    passwordResetTokenRepository.save(resetToken);

    String resetLink = appProperties.getFrontendUrl() + "/reset-password?token=" + resetToken.getToken();
    log.info("Password reset link for {}: {}", user.getEmail(), resetLink);

    if (appProperties.isDevMode()) {
      return new ForgotPasswordResponse("Demo reset link generated.", resetToken.getToken(), resetLink);
    }
    return new ForgotPasswordResponse("If the email exists, a reset link has been generated.", null, null);
  }

  @Transactional
  public void resetPassword(ResetPasswordRequest request) {
    if (!request.newPassword().equals(request.confirmPassword())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Password and confirm password must match.");
    }

    PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.token())
        .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Invalid reset token."));
    if (resetToken.isUsed() || resetToken.getExpiryDate().isBefore(Instant.now())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Reset token is expired or already used.");
    }

    User user = resetToken.getUser();
    user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
    user.setUpdatedAt(Instant.now());
    resetToken.setUsed(true);
    userRepository.save(user);
    passwordResetTokenRepository.save(resetToken);
  }
}
