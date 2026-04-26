package com.jobswipe.controller;

import com.jobswipe.dto.ApplicationDtos.ApplicationRequest;
import com.jobswipe.dto.ApplicationDtos.ApplicationResponse;
import com.jobswipe.service.ApplicationService;
import com.jobswipe.service.CurrentUserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
  private final ApplicationService applicationService;
  private final CurrentUserService currentUserService;

  public ApplicationController(ApplicationService applicationService, CurrentUserService currentUserService) {
    this.applicationService = applicationService;
    this.currentUserService = currentUserService;
  }

  @PostMapping
  public ApplicationResponse apply(@Valid @RequestBody ApplicationRequest request) {
    return applicationService.apply(currentUserService.user(), request.jobId());
  }

  @GetMapping("/my")
  public List<ApplicationResponse> myApplications() {
    return applicationService.myApplications(currentUserService.user());
  }

  @PutMapping("/{id}/withdraw")
  public ApplicationResponse withdraw(@PathVariable String id) {
    return applicationService.withdraw(currentUserService.user(), id);
  }
}
