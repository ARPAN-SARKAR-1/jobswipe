package com.jobswipe.dto;

import com.jobswipe.entity.Swipe;
import com.jobswipe.entity.SwipeAction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public final class SwipeDtos {
  private SwipeDtos() {
  }

  public record SwipeRequest(
      @NotBlank String jobId,
      @NotNull SwipeAction action
  ) {
  }

  public record SwipeResponse(
      String id,
      String jobSeekerId,
      JobDtos.JobResponse job,
      SwipeAction action,
      Instant createdAt
  ) {
    public static SwipeResponse from(Swipe swipe) {
      return new SwipeResponse(
          swipe.getId(),
          swipe.getJobSeeker().getId(),
          JobDtos.JobResponse.from(swipe.getJob()),
          swipe.getAction(),
          swipe.getCreatedAt()
      );
    }
  }
}
