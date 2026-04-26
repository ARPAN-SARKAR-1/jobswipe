package com.jobswipe.config;

import java.nio.file.Path;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {
  private final AppProperties appProperties;

  public StaticResourceConfig(AppProperties appProperties) {
    this.appProperties = appProperties;
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    Path uploadPath = Path.of(appProperties.getUploadDir()).toAbsolutePath().normalize();
    registry.addResourceHandler("/api/uploads/**").addResourceLocations(uploadPath.toUri().toString() + "/");
  }
}
