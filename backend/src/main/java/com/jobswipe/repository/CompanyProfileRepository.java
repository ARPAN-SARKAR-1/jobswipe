package com.jobswipe.repository;

import com.jobswipe.entity.CompanyProfile;
import com.jobswipe.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, String> {
  Optional<CompanyProfile> findByRecruiter(User recruiter);
}
