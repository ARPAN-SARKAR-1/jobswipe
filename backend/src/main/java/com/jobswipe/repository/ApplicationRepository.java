package com.jobswipe.repository;

import com.jobswipe.entity.Application;
import com.jobswipe.entity.Job;
import com.jobswipe.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, String> {
  Optional<Application> findByJobSeekerAndJob(User jobSeeker, Job job);

  List<Application> findByJobSeekerOrderByCreatedAtDesc(User jobSeeker);

  List<Application> findByJobRecruiterOrderByCreatedAtDesc(User recruiter);
}
