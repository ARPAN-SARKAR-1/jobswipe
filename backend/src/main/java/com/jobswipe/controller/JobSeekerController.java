package com.jobswipe.controller;

import com.jobswipe.dto.MessageResponse;
import com.jobswipe.dto.ProfileDtos.JobSeekerProfileRequest;
import com.jobswipe.dto.ProfileDtos.JobSeekerProfileResponse;
import com.jobswipe.service.CurrentUserService;
import com.jobswipe.service.JobSeekerService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/jobseeker")
public class JobSeekerController {
  private final CurrentUserService currentUserService;
  private final JobSeekerService jobSeekerService;

  public JobSeekerController(CurrentUserService currentUserService, JobSeekerService jobSeekerService) {
    this.currentUserService = currentUserService;
    this.jobSeekerService = jobSeekerService;
  }

  @GetMapping("/profile")
  public JobSeekerProfileResponse profile() {
    return jobSeekerService.getProfile(currentUserService.user());
  }

  @PutMapping("/profile")
  public JobSeekerProfileResponse updateProfile(@Valid @RequestBody JobSeekerProfileRequest request) {
    return jobSeekerService.updateProfile(currentUserService.user(), request);
  }

  @PostMapping("/profile-picture")
  public Map<String, String> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
    return Map.of("url", jobSeekerService.uploadProfilePicture(currentUserService.user(), file));
  }

  @PostMapping("/resume")
  public Map<String, String> uploadResume(@RequestParam("file") MultipartFile file) {
    return Map.of("url", jobSeekerService.uploadResume(currentUserService.user(), file));
  }
}
