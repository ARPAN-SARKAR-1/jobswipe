package com.jobswipe.repository;

import com.jobswipe.entity.Job;
import com.jobswipe.entity.User;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface JobRepository extends JpaRepository<Job, String>, JpaSpecificationExecutor<Job> {
  List<Job> findByRecruiterOrderByCreatedAtDesc(User recruiter);

  long countByActiveTrueAndDeadlineGreaterThanEqual(LocalDate date);

  long countByDeadlineBefore(LocalDate date);
}
