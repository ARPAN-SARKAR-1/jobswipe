package com.jobswipe.service;

import com.jobswipe.entity.User;
import com.jobswipe.exception.ApiException;
import com.jobswipe.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {
  public User user() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Login required.");
    }
    return principal.getUser();
  }
}
