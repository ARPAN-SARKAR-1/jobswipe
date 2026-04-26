package com.jobswipe.controller;

import com.jobswipe.dto.AdminDtos.AdminDashboardResponse;
import com.jobswipe.dto.ApplicationDtos.ApplicationResponse;
import com.jobswipe.dto.CompanyDtos.CompanyProfileResponse;
import com.jobswipe.dto.JobDtos.JobResponse;
import com.jobswipe.dto.ProfileDtos.JobSeekerProfileResponse;
import com.jobswipe.dto.SwipeDtos.SwipeResponse;
import com.jobswipe.dto.UserResponse;
import com.jobswipe.service.AdminService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
  private final AdminService adminService;

  public AdminController(AdminService adminService) {
    this.adminService = adminService;
  }

  @GetMapping("/dashboard")
  public AdminDashboardResponse dashboard() {
    return adminService.dashboard();
  }

  @GetMapping("/users")
  public List<UserResponse> users() {
    return adminService.users();
  }

  @GetMapping("/jobs")
  public List<JobResponse> jobs() {
    return adminService.jobs();
  }

  @GetMapping("/jobseekers")
  public List<JobSeekerProfileResponse> jobSeekers() {
    return adminService.jobSeekers();
  }

  @GetMapping("/recruiters")
  public List<CompanyProfileResponse> recruiters() {
    return adminService.recruiters();
  }

  @GetMapping("/applications")
  public List<ApplicationResponse> applications() {
    return adminService.applications();
  }

  @GetMapping("/swipes")
  public List<SwipeResponse> swipes() {
    return adminService.swipes();
  }
}
