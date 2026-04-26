package com.jobswipe.service;

import com.jobswipe.dto.SwipeDtos.SwipeResponse;
import com.jobswipe.entity.Job;
import com.jobswipe.entity.Swipe;
import com.jobswipe.entity.SwipeAction;
import com.jobswipe.entity.User;
import com.jobswipe.entity.UserRole;
import com.jobswipe.exception.ApiException;
import com.jobswipe.repository.JobRepository;
import com.jobswipe.repository.SwipeRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SwipeService {
  private final SwipeRepository swipeRepository;
  private final JobRepository jobRepository;
  private final ApplicationService applicationService;

  public SwipeService(SwipeRepository swipeRepository, JobRepository jobRepository, ApplicationService applicationService) {
    this.swipeRepository = swipeRepository;
    this.jobRepository = jobRepository;
    this.applicationService = applicationService;
  }

  @Transactional
  public SwipeResponse swipe(User user, String jobId, SwipeAction action) {
    ensureJobSeeker(user);
    Job job = jobRepository.findById(jobId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Job not found."));
    if (!job.isActive() || job.isExpired()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "This job is no longer available.");
    }

    Swipe swipe = swipeRepository.findByJobSeekerAndJob(user, job).orElseGet(Swipe::new);
    swipe.setJobSeeker(user);
    swipe.setJob(job);
    swipe.setAction(action);
    swipe.setCreatedAt(Instant.now());
    Swipe saved = swipeRepository.save(swipe);

    if (action == SwipeAction.LIKE) {
      applicationService.apply(user, jobId);
    }

    return SwipeResponse.from(saved);
  }

  @Transactional(readOnly = true)
  public List<SwipeResponse> history(User user) {
    ensureJobSeeker(user);
    return swipeRepository.findByJobSeekerOrderByCreatedAtDesc(user).stream().map(SwipeResponse::from).toList();
  }

  @Transactional
  public SwipeResponse undo(User user) {
    ensureJobSeeker(user);
    Swipe last = swipeRepository.findFirstByJobSeekerOrderByCreatedAtDesc(user)
        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Nothing to undo."));
    SwipeResponse response = SwipeResponse.from(last);
    swipeRepository.delete(last);
    return response;
  }

  private void ensureJobSeeker(User user) {
    if (user.getRole() != UserRole.JOB_SEEKER) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Job seeker account required.");
    }
  }
}
