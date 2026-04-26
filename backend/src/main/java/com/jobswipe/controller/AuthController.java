package com.jobswipe.controller;

import com.jobswipe.dto.AuthDtos.AuthResponse;
import com.jobswipe.dto.AuthDtos.ForgotPasswordRequest;
import com.jobswipe.dto.AuthDtos.ForgotPasswordResponse;
import com.jobswipe.dto.AuthDtos.LoginRequest;
import com.jobswipe.dto.AuthDtos.RegisterRequest;
import com.jobswipe.dto.AuthDtos.ResetPasswordRequest;
import com.jobswipe.dto.MessageResponse;
import com.jobswipe.dto.UserResponse;
import com.jobswipe.service.AuthService;
import com.jobswipe.service.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService authService;
  private final CurrentUserService currentUserService;

  public AuthController(AuthService authService, CurrentUserService currentUserService) {
    this.authService = authService;
    this.currentUserService = currentUserService;
  }

  @PostMapping("/register")
  public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
    return authService.register(request);
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest request) {
    return authService.login(request);
  }

  @PostMapping("/forgot-password")
  public ForgotPasswordResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
    return authService.forgotPassword(request);
  }

  @PostMapping("/reset-password")
  public MessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
    authService.resetPassword(request);
    return new MessageResponse("Password reset successful.");
  }

  @GetMapping("/me")
  public UserResponse me() {
    return UserResponse.from(currentUserService.user());
  }
}
