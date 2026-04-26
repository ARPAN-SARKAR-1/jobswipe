package com.jobswipe.repository;

import com.jobswipe.entity.Job;
import com.jobswipe.entity.Swipe;
import com.jobswipe.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SwipeRepository extends JpaRepository<Swipe, String> {
  Optional<Swipe> findByJobSeekerAndJob(User jobSeeker, Job job);

  Optional<Swipe> findFirstByJobSeekerOrderByCreatedAtDesc(User jobSeeker);

  List<Swipe> findByJobSeekerOrderByCreatedAtDesc(User jobSeeker);

  boolean existsByJobSeekerAndJob(User jobSeeker, Job job);
}
