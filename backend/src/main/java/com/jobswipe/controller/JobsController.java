package com.jobswipe.controller;

import com.jobswipe.dto.JobDtos.JobFilters;
import com.jobswipe.dto.JobDtos.JobRequest;
import com.jobswipe.dto.JobDtos.JobResponse;
import com.jobswipe.dto.MessageResponse;
import com.jobswipe.entity.ExperienceLevel;
import com.jobswipe.entity.JobType;
import com.jobswipe.entity.WorkMode;
import com.jobswipe.service.CurrentUserService;
import com.jobswipe.service.JobService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jobs")
public class JobsController {
  private final JobService jobService;
  private final CurrentUserService currentUserService;

  public JobsController(JobService jobService, CurrentUserService currentUserService) {
    this.jobService = jobService;
    this.currentUserService = currentUserService;
  }

  @GetMapping("/feed")
  public List<JobResponse> feed(
      @RequestParam(required = false) JobType jobType,
      @RequestParam(required = false) ExperienceLevel experienceLevel,
      @RequestParam(required = false) String location,
      @RequestParam(required = false) String skill,
      @RequestParam(required = false) WorkMode workMode,
      @RequestParam(required = false) Boolean activeOnly,
      @RequestParam(required = false) String deadlineStatus
  ) {
    return jobService.feed(currentUserService.user(), new JobFilters(jobType, experienceLevel, location, skill, workMode, activeOnly, deadlineStatus));
  }

  @GetMapping
  public List<JobResponse> list(
      @RequestParam(required = false) JobType jobType,
      @RequestParam(required = false) ExperienceLevel experienceLevel,
      @RequestParam(required = false) String location,
      @RequestParam(required = false) String skill,
      @RequestParam(required = false) WorkMode workMode,
      @RequestParam(required = false) Boolean activeOnly,
      @RequestParam(required = false) String deadlineStatus
  ) {
    return jobService.list(new JobFilters(jobType, experienceLevel, location, skill, workMode, activeOnly, deadlineStatus));
  }

  @GetMapping("/{id}")
  public JobResponse get(@PathVariable String id) {
    return jobService.get(id);
  }

  @PostMapping
  public JobResponse create(@Valid @RequestBody JobRequest request) {
    return jobService.create(currentUserService.user(), request);
  }

  @PutMapping("/{id}")
  public JobResponse update(@PathVariable String id, @Valid @RequestBody JobRequest request) {
    return jobService.update(currentUserService.user(), id, request);
  }

  @DeleteMapping("/{id}")
  public MessageResponse delete(@PathVariable String id, @RequestParam(defaultValue = "false") boolean confirm) {
    jobService.delete(currentUserService.user(), id, confirm);
    return new MessageResponse("Job deleted.");
  }
}
