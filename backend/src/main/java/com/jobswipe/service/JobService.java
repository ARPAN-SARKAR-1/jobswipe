package com.jobswipe.service;

import com.jobswipe.dto.JobDtos.JobFilters;
import com.jobswipe.dto.JobDtos.JobRequest;
import com.jobswipe.dto.JobDtos.JobResponse;
import com.jobswipe.entity.Job;
import com.jobswipe.entity.User;
import com.jobswipe.entity.UserRole;
import com.jobswipe.exception.ApiException;
import com.jobswipe.repository.CompanyProfileRepository;
import com.jobswipe.repository.JobRepository;
import com.jobswipe.repository.SwipeRepository;
import jakarta.persistence.criteria.Predicate;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobService {
  private final JobRepository jobRepository;
  private final SwipeRepository swipeRepository;
  private final CompanyProfileRepository companyProfileRepository;

  public JobService(JobRepository jobRepository, SwipeRepository swipeRepository, CompanyProfileRepository companyProfileRepository) {
    this.jobRepository = jobRepository;
    this.swipeRepository = swipeRepository;
    this.companyProfileRepository = companyProfileRepository;
  }

  @Transactional(readOnly = true)
  public List<JobResponse> feed(User user, JobFilters filters) {
    if (user.getRole() != UserRole.JOB_SEEKER) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Job seeker account required.");
    }
    return jobRepository.findAll(spec(filters, true)).stream()
        .filter(job -> !swipeRepository.existsByJobSeekerAndJob(user, job))
        .map(JobResponse::from)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<JobResponse> list(JobFilters filters) {
    return jobRepository.findAll(spec(filters, Boolean.TRUE.equals(filters.activeOnly()))).stream()
        .map(JobResponse::from)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<JobResponse> recruiterJobs(User user) {
    return jobRepository.findByRecruiterOrderByCreatedAtDesc(user).stream().map(JobResponse::from).toList();
  }

  @Transactional(readOnly = true)
  public JobResponse get(String id) {
    return JobResponse.from(job(id));
  }

  @Transactional
  public JobResponse create(User user, JobRequest request) {
    ensureRecruiter(user);
    Job job = new Job();
    job.setRecruiter(user);
    apply(job, request, user);
    return JobResponse.from(jobRepository.save(job));
  }

  @Transactional
  public JobResponse update(User user, String id, JobRequest request) {
    Job job = job(id);
    ensureOwnerOrAdmin(user, job);
    apply(job, request, user);
    job.setUpdatedAt(Instant.now());
    return JobResponse.from(jobRepository.save(job));
  }

  @Transactional
  public void delete(User user, String id, boolean confirm) {
    Job job = job(id);
    ensureOwnerOrAdmin(user, job);
    if (!confirm) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Confirm deletion before deleting this job.");
    }
    if (job.isExpired()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Expired jobs cannot be deleted from this action; pause them instead.");
    }
    jobRepository.delete(job);
  }

  private void apply(Job job, JobRequest request, User user) {
    job.setTitle(request.title());
    job.setCompanyName(request.companyName());
    job.setCompanyLogoUrl(request.companyLogoUrl());
    companyProfileRepository.findByRecruiter(user)
        .filter(profile -> request.companyLogoUrl() == null || request.companyLogoUrl().isBlank())
        .ifPresent(profile -> job.setCompanyLogoUrl(profile.getCompanyLogoUrl()));
    job.setLocation(request.location());
    job.setJobType(request.jobType());
    job.setWorkMode(request.workMode());
    job.setSalary(request.salary());
    job.setRequiredSkills(request.requiredSkills());
    job.setRequiredExperienceLevel(request.requiredExperienceLevel());
    job.setDescription(request.description());
    job.setEligibility(request.eligibility());
    job.setDeadline(request.deadline());
    job.setActive(request.active() == null || request.active());
  }

  private Specification<Job> spec(JobFilters filters, boolean feedOnly) {
    return (root, query, builder) -> {
      List<Predicate> predicates = new ArrayList<>();
      if (feedOnly || Boolean.TRUE.equals(filters.activeOnly())) {
        predicates.add(builder.isTrue(root.get("active")));
        predicates.add(builder.greaterThanOrEqualTo(root.get("deadline"), LocalDate.now()));
      }
      if ("expired".equalsIgnoreCase(filters.deadlineStatus())) {
        predicates.add(builder.lessThan(root.get("deadline"), LocalDate.now()));
      }
      if (filters.jobType() != null) predicates.add(builder.equal(root.get("jobType"), filters.jobType()));
      if (filters.experienceLevel() != null) predicates.add(builder.equal(root.get("requiredExperienceLevel"), filters.experienceLevel()));
      if (filters.workMode() != null) predicates.add(builder.equal(root.get("workMode"), filters.workMode()));
      if (filters.location() != null && !filters.location().isBlank()) {
        predicates.add(builder.like(builder.lower(root.get("location")), "%" + filters.location().toLowerCase() + "%"));
      }
      if (filters.skill() != null && !filters.skill().isBlank()) {
        predicates.add(builder.like(builder.lower(root.get("requiredSkills")), "%" + filters.skill().toLowerCase() + "%"));
      }
      query.orderBy(builder.desc(root.get("createdAt")));
      return builder.and(predicates.toArray(Predicate[]::new));
    };
  }

  private Job job(String id) {
    return jobRepository.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Job not found."));
  }

  private void ensureRecruiter(User user) {
    if (user.getRole() != UserRole.RECRUITER && user.getRole() != UserRole.ADMIN) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Recruiter account required.");
    }
  }

  private void ensureOwnerOrAdmin(User user, Job job) {
    if (user.getRole() != UserRole.ADMIN && !job.getRecruiter().getId().equals(user.getId())) {
      throw new ApiException(HttpStatus.FORBIDDEN, "You can manage only your own jobs.");
    }
  }
}
