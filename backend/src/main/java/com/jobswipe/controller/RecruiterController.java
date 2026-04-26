package com.jobswipe.controller;

import com.jobswipe.dto.ApplicationDtos.ApplicationResponse;
import com.jobswipe.dto.ApplicationDtos.ApplicationStatusRequest;
import com.jobswipe.dto.CompanyDtos.CompanyProfileRequest;
import com.jobswipe.dto.CompanyDtos.CompanyProfileResponse;
import com.jobswipe.dto.JobDtos.JobResponse;
import com.jobswipe.service.ApplicationService;
import com.jobswipe.service.CurrentUserService;
import com.jobswipe.service.JobService;
import com.jobswipe.service.RecruiterService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/recruiter")
public class RecruiterController {
  private final CurrentUserService currentUserService;
  private final RecruiterService recruiterService;
  private final JobService jobService;
  private final ApplicationService applicationService;

  public RecruiterController(CurrentUserService currentUserService, RecruiterService recruiterService, JobService jobService, ApplicationService applicationService) {
    this.currentUserService = currentUserService;
    this.recruiterService = recruiterService;
    this.jobService = jobService;
    this.applicationService = applicationService;
  }

  @GetMapping("/dashboard")
  public Map<String, Object> dashboard() {
    var user = currentUserService.user();
    return Map.of(
        "company", recruiterService.getCompanyProfile(user),
        "jobs", jobService.recruiterJobs(user),
        "applications", applicationService.recruiterApplications(user)
    );
  }

  @GetMapping("/company-profile")
  public CompanyProfileResponse companyProfile() {
    return recruiterService.getCompanyProfile(currentUserService.user());
  }

  @PutMapping("/company-profile")
  public CompanyProfileResponse updateCompanyProfile(@Valid @RequestBody CompanyProfileRequest request) {
    return recruiterService.updateCompanyProfile(currentUserService.user(), request);
  }

  @PostMapping("/company-logo")
  public Map<String, String> uploadCompanyLogo(@RequestParam("file") MultipartFile file) {
    return Map.of("url", recruiterService.uploadLogo(currentUserService.user(), file));
  }

  @GetMapping("/jobs")
  public List<JobResponse> jobs() {
    return jobService.recruiterJobs(currentUserService.user());
  }

  @GetMapping("/applications")
  public List<ApplicationResponse> applications() {
    return applicationService.recruiterApplications(currentUserService.user());
  }

  @PutMapping("/applications/{id}/status")
  public ApplicationResponse updateStatus(@PathVariable String id, @Valid @RequestBody ApplicationStatusRequest request) {
    return applicationService.updateStatus(currentUserService.user(), id, request.status());
  }
}
