package com.jobswipe.repository;

import com.jobswipe.entity.User;
import com.jobswipe.entity.UserRole;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
  Optional<User> findByEmailIgnoreCase(String email);

  boolean existsByEmailIgnoreCase(String email);

  long countByRole(UserRole role);
}
