package com.jobswipe.controller;

import com.jobswipe.dto.SwipeDtos.SwipeRequest;
import com.jobswipe.dto.SwipeDtos.SwipeResponse;
import com.jobswipe.service.CurrentUserService;
import com.jobswipe.service.SwipeService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/swipes")
public class SwipeController {
  private final SwipeService swipeService;
  private final CurrentUserService currentUserService;

  public SwipeController(SwipeService swipeService, CurrentUserService currentUserService) {
    this.swipeService = swipeService;
    this.currentUserService = currentUserService;
  }

  @PostMapping
  public SwipeResponse swipe(@Valid @RequestBody SwipeRequest request) {
    return swipeService.swipe(currentUserService.user(), request.jobId(), request.action());
  }

  @GetMapping("/history")
  public List<SwipeResponse> history() {
    return swipeService.history(currentUserService.user());
  }

  @PostMapping("/undo")
  public SwipeResponse undo() {
    return swipeService.undo(currentUserService.user());
  }
}
