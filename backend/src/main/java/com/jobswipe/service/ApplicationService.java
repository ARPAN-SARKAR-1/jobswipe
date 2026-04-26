package com.jobswipe.service;

import com.jobswipe.dto.ApplicationDtos.ApplicationResponse;
import com.jobswipe.entity.Application;
import com.jobswipe.entity.ApplicationStatus;
import com.jobswipe.entity.Job;
import com.jobswipe.entity.JobSeekerProfile;
import com.jobswipe.entity.User;
import com.jobswipe.entity.UserRole;
import com.jobswipe.exception.ApiException;
import com.jobswipe.repository.ApplicationRepository;
import com.jobswipe.repository.JobRepository;
import com.jobswipe.repository.JobSeekerProfileRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApplicationService {
  private final ApplicationRepository applicationRepository;
  private final JobRepository jobRepository;
  private final JobSeekerProfileRepository profileRepository;

  public ApplicationService(ApplicationRepository applicationRepository, JobRepository jobRepository, JobSeekerProfileRepository profileRepository) {
    this.applicationRepository = applicationRepository;
    this.jobRepository = jobRepository;
    this.profileRepository = profileRepository;
  }

  @Transactional
  public ApplicationResponse apply(User user, String jobId) {
    ensureJobSeeker(user);
    Job job = jobRepository.findById(jobId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Job not found."));
    if (!job.isActive() || job.isExpired()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "This job is no longer accepting applications.");
    }
    JobSeekerProfile profile = profileRepository.findByUser(user).orElse(null);
    Application application = applicationRepository.findByJobSeekerAndJob(user, job).orElseGet(Application::new);
    application.setJobSeeker(user);
    application.setJob(job);
    application.setStatus(ApplicationStatus.APPLIED);
    application.setResumePdfUrl(profile == null ? null : profile.getResumePdfUrl());
    application.setGithubUrl(profile == null ? null : profile.getGithubUrl());
    application.setUpdatedAt(Instant.now());
    return ApplicationResponse.from(applicationRepository.save(application));
  }

  @Transactional(readOnly = true)
  public List<ApplicationResponse> myApplications(User user) {
    ensureJobSeeker(user);
    return applicationRepository.findByJobSeekerOrderByCreatedAtDesc(user).stream()
        .map(ApplicationResponse::from)
        .toList();
  }

  @Transactional
  public ApplicationResponse withdraw(User user, String id) {
    ensureJobSeeker(user);
    Application application = applicationRepository.findById(id)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Application not found."));
    if (!application.getJobSeeker().getId().equals(user.getId())) {
      throw new ApiException(HttpStatus.FORBIDDEN, "You can withdraw only your own applications.");
    }
    if (application.getStatus() != ApplicationStatus.APPLIED) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Only APPLIED applications can be withdrawn.");
    }
    application.setStatus(ApplicationStatus.WITHDRAWN);
    application.setUpdatedAt(Instant.now());
    return ApplicationResponse.from(applicationRepository.save(application));
  }

  @Transactional(readOnly = true)
  public List<ApplicationResponse> recruiterApplications(User user) {
    ensureRecruiter(user);
    return applicationRepository.findByJobRecruiterOrderByCreatedAtDesc(user).stream()
        .map(ApplicationResponse::from)
        .toList();
  }

  @Transactional
  public ApplicationResponse updateStatus(User user, String id, ApplicationStatus status) {
    ensureRecruiter(user);
    if (status == ApplicationStatus.WITHDRAWN) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Recruiters cannot mark applications as withdrawn.");
    }
    Application application = applicationRepository.findById(id)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Application not found."));
    if (user.getRole() != UserRole.ADMIN && !application.getJob().getRecruiter().getId().equals(user.getId())) {
      throw new ApiException(HttpStatus.FORBIDDEN, "You can update only applications for your jobs.");
    }
    application.setStatus(status);
    application.setUpdatedAt(Instant.now());
    return ApplicationResponse.from(applicationRepository.save(application));
  }

  private void ensureJobSeeker(User user) {
    if (user.getRole() != UserRole.JOB_SEEKER) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Job seeker account required.");
    }
  }

  private void ensureRecruiter(User user) {
    if (user.getRole() != UserRole.RECRUITER && user.getRole() != UserRole.ADMIN) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Recruiter account required.");
    }
  }
}
