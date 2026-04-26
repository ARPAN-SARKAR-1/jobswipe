package com.jobswipe.security;

import com.jobswipe.config.AppProperties;
import com.jobswipe.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final AppProperties appProperties;

  public JwtService(AppProperties appProperties) {
    this.appProperties = appProperties;
  }

  public String createToken(User user) {
    Instant now = Instant.now();
    return Jwts.builder()
        .subject(user.getEmail())
        .claim("role", user.getRole().name())
        .claim("userId", user.getId())
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plusMillis(appProperties.getJwtExpirationMs())))
        .signWith(key())
        .compact();
  }

  public String subject(String token) {
    return claims(token).getSubject();
  }

  public boolean isValid(String token, UserPrincipal principal) {
    Claims claims = claims(token);
    return claims.getSubject().equals(principal.getUsername()) && claims.getExpiration().after(new Date());
  }

  private Claims claims(String token) {
    return Jwts.parser()
        .verifyWith(key())
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  private SecretKey key() {
    return Keys.hmacShaKeyFor(appProperties.getJwtSecret().getBytes(StandardCharsets.UTF_8));
  }
}
