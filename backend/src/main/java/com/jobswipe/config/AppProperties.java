package com.jobswipe.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppProperties {
  @Value("${app.jwt.secret}")
  private String jwtSecret;

  @Value("${app.jwt.expiration-ms}")
  private long jwtExpirationMs;

  @Value("${app.upload-dir}")
  private String uploadDir;

  @Value("${app.frontend-url}")
  private String frontendUrl;

  @Value("${app.dev-mode:true}")
  private boolean devMode;

  public String getJwtSecret() {
    return jwtSecret;
  }

  public long getJwtExpirationMs() {
    return jwtExpirationMs;
  }

  public String getUploadDir() {
    return uploadDir;
  }

  public String getFrontendUrl() {
    return frontendUrl;
  }

  public boolean isDevMode() {
    return devMode;
  }
}
