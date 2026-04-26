package com.jobswipe.service;

import com.jobswipe.config.AppProperties;
import com.jobswipe.exception.ApiException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
  private static final long MAX_PDF_SIZE = 5L * 1024L * 1024L;
  private static final long MAX_IMAGE_SIZE = 2L * 1024L * 1024L;
  private static final Set<String> IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
  private final AppProperties appProperties;

  public FileStorageService(AppProperties appProperties) {
    this.appProperties = appProperties;
  }

  public String storeResume(MultipartFile file) {
    requireFile(file);
    if (!"application/pdf".equalsIgnoreCase(file.getContentType()) || !safeName(file).toLowerCase().endsWith(".pdf")) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Only PDF resumes are allowed.");
    }
    if (file.getSize() > MAX_PDF_SIZE) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Resume PDF must be 5MB or smaller.");
    }
    return store(file, "resumes", ".pdf");
  }

  public String storeImage(MultipartFile file, String folder) {
    requireFile(file);
    if (!IMAGE_TYPES.contains(file.getContentType())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Only JPG, PNG, or WebP images are allowed.");
    }
    if (file.getSize() > MAX_IMAGE_SIZE) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Image must be 2MB or smaller.");
    }
    String extension = switch (file.getContentType()) {
      case "image/png" -> ".png";
      case "image/webp" -> ".webp";
      default -> ".jpg";
    };
    return store(file, folder, extension);
  }

  private String store(MultipartFile file, String folder, String extension) {
    try {
      Path base = Path.of(appProperties.getUploadDir()).toAbsolutePath().normalize();
      Path targetDir = base.resolve(folder).normalize();
      Files.createDirectories(targetDir);

      String fileName = UUID.randomUUID() + extension;
      Path target = targetDir.resolve(fileName).normalize();
      if (!target.startsWith(base)) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid upload path.");
      }

      file.transferTo(target);
      return "/api/uploads/" + folder + "/" + fileName;
    } catch (IOException exception) {
      throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not store uploaded file.");
    }
  }

  private void requireFile(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "Upload file is required.");
    }
  }

  private String safeName(MultipartFile file) {
    return StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
  }
}
