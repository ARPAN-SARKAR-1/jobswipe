package com.jobswipe.repository;

import com.jobswipe.entity.JobSeekerProfile;
import com.jobswipe.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobSeekerProfileRepository extends JpaRepository<JobSeekerProfile, String> {
  Optional<JobSeekerProfile> findByUser(User user);
}
