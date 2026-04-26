package com.jobswipe.service;

import com.jobswipe.dto.AdminDtos.AdminDashboardResponse;
import com.jobswipe.dto.ApplicationDtos.ApplicationResponse;
import com.jobswipe.dto.CompanyDtos.CompanyProfileResponse;
import com.jobswipe.dto.JobDtos.JobResponse;
import com.jobswipe.dto.ProfileDtos.JobSeekerProfileResponse;
import com.jobswipe.dto.SwipeDtos.SwipeResponse;
import com.jobswipe.dto.UserResponse;
import com.jobswipe.entity.UserRole;
import com.jobswipe.repository.ApplicationRepository;
import com.jobswipe.repository.CompanyProfileRepository;
import com.jobswipe.repository.JobRepository;
import com.jobswipe.repository.JobSeekerProfileRepository;
import com.jobswipe.repository.SwipeRepository;
import com.jobswipe.repository.UserRepository;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {
  private final UserRepository userRepository;
  private final JobSeekerProfileRepository jobSeekerProfileRepository;
  private final CompanyProfileRepository companyProfileRepository;
  private final JobRepository jobRepository;
  private final ApplicationRepository applicationRepository;
  private final SwipeRepository swipeRepository;

  public AdminService(
      UserRepository userRepository,
      JobSeekerProfileRepository jobSeekerProfileRepository,
      CompanyProfileRepository companyProfileRepository,
      JobRepository jobRepository,
      ApplicationRepository applicationRepository,
      SwipeRepository swipeRepository
  ) {
    this.userRepository = userRepository;
    this.jobSeekerProfileRepository = jobSeekerProfileRepository;
    this.companyProfileRepository = companyProfileRepository;
    this.jobRepository = jobRepository;
    this.applicationRepository = applicationRepository;
    this.swipeRepository = swipeRepository;
  }

  @Transactional(readOnly = true)
  public AdminDashboardResponse dashboard() {
    return new AdminDashboardResponse(
        userRepository.count(),
        userRepository.countByRole(UserRole.JOB_SEEKER),
        userRepository.countByRole(UserRole.RECRUITER),
        jobRepository.count(),
        jobRepository.countByActiveTrueAndDeadlineGreaterThanEqual(LocalDate.now()),
        jobRepository.countByDeadlineBefore(LocalDate.now()),
        applicationRepository.count(),
        swipeRepository.count(),
        users(),
        jobSeekers(),
        recruiters(),
        jobs(),
        applications(),
        swipes()
    );
  }

  @Transactional(readOnly = true)
  public java.util.List<UserResponse> users() {
    return userRepository.findAll().stream().map(UserResponse::from).toList();
  }

  @Transactional(readOnly = true)
  public java.util.List<JobSeekerProfileResponse> jobSeekers() {
    return jobSeekerProfileRepository.findAll().stream().map(JobSeekerProfileResponse::from).toList();
  }

  @Transactional(readOnly = true)
  public java.util.List<CompanyProfileResponse> recruiters() {
    return companyProfileRepository.findAll().stream().map(CompanyProfileResponse::from).toList();
  }

  @Transactional(readOnly = true)
  public java.util.List<JobResponse> jobs() {
    return jobRepository.findAll().stream().map(JobResponse::from).toList();
  }

  @Transactional(readOnly = true)
  public java.util.List<ApplicationResponse> applications() {
    return applicationRepository.findAll().stream().map(ApplicationResponse::from).toList();
  }

  @Transactional(readOnly = true)
  public java.util.List<SwipeResponse> swipes() {
    return swipeRepository.findAll().stream().map(SwipeResponse::from).toList();
  }
}
