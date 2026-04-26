package com.jobswipe.service;

import com.jobswipe.dto.CompanyDtos.CompanyProfileRequest;
import com.jobswipe.dto.CompanyDtos.CompanyProfileResponse;
import com.jobswipe.entity.CompanyProfile;
import com.jobswipe.entity.User;
import com.jobswipe.entity.UserRole;
import com.jobswipe.exception.ApiException;
import com.jobswipe.repository.CompanyProfileRepository;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class RecruiterService {
  private final CompanyProfileRepository companyProfileRepository;
  private final FileStorageService fileStorageService;

  public RecruiterService(CompanyProfileRepository companyProfileRepository, FileStorageService fileStorageService) {
    this.companyProfileRepository = companyProfileRepository;
    this.fileStorageService = fileStorageService;
  }

  @Transactional(readOnly = true)
  public CompanyProfileResponse getCompanyProfile(User user) {
    ensureRecruiter(user);
    return CompanyProfileResponse.from(profile(user));
  }

  @Transactional
  public CompanyProfileResponse updateCompanyProfile(User user, CompanyProfileRequest request) {
    ensureRecruiter(user);
    CompanyProfile profile = profile(user);
    profile.setCompanyName(request.companyName());
    profile.setWebsite(request.website());
    profile.setDescription(request.description());
    profile.setLocation(request.location());
    profile.setUpdatedAt(Instant.now());
    return CompanyProfileResponse.from(companyProfileRepository.save(profile));
  }

  @Transactional
  public String uploadLogo(User user, MultipartFile file) {
    ensureRecruiter(user);
    String url = fileStorageService.storeImage(file, "company-logos");
    CompanyProfile profile = profile(user);
    profile.setCompanyLogoUrl(url);
    profile.setUpdatedAt(Instant.now());
    companyProfileRepository.save(profile);
    return url;
  }

  private CompanyProfile profile(User user) {
    return companyProfileRepository.findByRecruiter(user).orElseGet(() -> {
      CompanyProfile created = new CompanyProfile();
      created.setRecruiter(user);
      created.setCompanyName(user.getName() + "'s Company");
      return companyProfileRepository.save(created);
    });
  }

  private void ensureRecruiter(User user) {
    if (user.getRole() != UserRole.RECRUITER && user.getRole() != UserRole.ADMIN) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Recruiter account required.");
    }
  }
}
