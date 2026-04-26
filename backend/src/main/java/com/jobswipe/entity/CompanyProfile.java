package com.jobswipe.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.time.Instant;

@Entity
public class CompanyProfile {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(nullable = false, unique = true)
  private User recruiter;

  @Column(nullable = false)
  private String companyName;

  private String companyLogoUrl;
  private String website;

  @Column(length = 2000)
  private String description;

  private String location;
  private Instant createdAt = Instant.now();
  private Instant updatedAt = Instant.now();

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public User getRecruiter() {
    return recruiter;
  }

  public void setRecruiter(User recruiter) {
    this.recruiter = recruiter;
  }

  public String getCompanyName() {
    return companyName;
  }

  public void setCompanyName(String companyName) {
    this.companyName = companyName;
  }

  public String getCompanyLogoUrl() {
    return companyLogoUrl;
  }

  public void setCompanyLogoUrl(String companyLogoUrl) {
    this.companyLogoUrl = companyLogoUrl;
  }

  public String getWebsite() {
    return website;
  }

  public void setWebsite(String website) {
    this.website = website;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(Instant updatedAt) {
    this.updatedAt = updatedAt;
  }
}
