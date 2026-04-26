package com.jobswipe.service;

import com.jobswipe.dto.ProfileDtos.JobSeekerProfileRequest;
import com.jobswipe.dto.ProfileDtos.JobSeekerProfileResponse;
import com.jobswipe.entity.JobSeekerProfile;
import com.jobswipe.entity.User;
import com.jobswipe.entity.UserRole;
import com.jobswipe.exception.ApiException;
import com.jobswipe.repository.JobSeekerProfileRepository;
import com.jobswipe.repository.UserRepository;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class JobSeekerService {
  private final JobSeekerProfileRepository profileRepository;
  private final UserRepository userRepository;
  private final FileStorageService fileStorageService;

  public JobSeekerService(JobSeekerProfileRepository profileRepository, UserRepository userRepository, FileStorageService fileStorageService) {
    this.profileRepository = profileRepository;
    this.userRepository = userRepository;
    this.fileStorageService = fileStorageService;
  }

  @Transactional(readOnly = true)
  public JobSeekerProfileResponse getProfile(User user) {
    ensureJobSeeker(user);
    return JobSeekerProfileResponse.from(profile(user));
  }

  @Transactional
  public JobSeekerProfileResponse updateProfile(User user, JobSeekerProfileRequest request) {
    ensureJobSeeker(user);
    JobSeekerProfile profile = profile(user);
    profile.setPhone(request.phone());
    profile.setGithubUrl(request.githubUrl());
    profile.setEducation(request.education());
    profile.setDegree(request.degree());
    profile.setCollege(request.college());
    profile.setPassingYear(request.passingYear());
    profile.setCgpaOrPercentage(request.cgpaOrPercentage());
    profile.setSkills(request.skills());
    if (request.experienceLevel() != null) profile.setExperienceLevel(request.experienceLevel());
    profile.setPreferredLocation(request.preferredLocation());
    if (request.preferredJobType() != null) profile.setPreferredJobType(request.preferredJobType());
    profile.setUpdatedAt(Instant.now());
    return JobSeekerProfileResponse.from(profileRepository.save(profile));
  }

  @Transactional
  public String uploadProfilePicture(User user, MultipartFile file) {
    ensureJobSeeker(user);
    String url = fileStorageService.storeImage(file, "profile-pictures");
    user.setProfilePictureUrl(url);
    user.setUpdatedAt(Instant.now());
    userRepository.save(user);
    return url;
  }

  @Transactional
  public String uploadResume(User user, MultipartFile file) {
    ensureJobSeeker(user);
    String url = fileStorageService.storeResume(file);
    JobSeekerProfile profile = profile(user);
    profile.setResumePdfUrl(url);
    profile.setUpdatedAt(Instant.now());
    profileRepository.save(profile);
    return url;
  }

  private JobSeekerProfile profile(User user) {
    return profileRepository.findByUser(user).orElseGet(() -> {
      JobSeekerProfile created = new JobSeekerProfile();
      created.setUser(user);
      return profileRepository.save(created);
    });
  }

  private void ensureJobSeeker(User user) {
    if (user.getRole() != UserRole.JOB_SEEKER) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Job seeker account required.");
    }
  }
}
