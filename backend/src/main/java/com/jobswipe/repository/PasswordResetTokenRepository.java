package com.jobswipe.repository;

import com.jobswipe.entity.PasswordResetToken;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {
  Optional<PasswordResetToken> findByToken(String token);
}
