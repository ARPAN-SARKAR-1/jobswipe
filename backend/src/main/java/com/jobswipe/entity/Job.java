package com.jobswipe.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.Instant;
import java.time.LocalDate;

@Entity
public class Job {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private User recruiter;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private String companyName;

  private String companyLogoUrl;

  @Column(nullable = false)
  private String location;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private JobType jobType;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private WorkMode workMode;

  @Column(nullable = false)
  private String salary;

  @Column(length = 1000, nullable = false)
  private String requiredSkills;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ExperienceLevel requiredExperienceLevel;

  @Column(length = 4000, nullable = false)
  private String description;

  @Column(length = 2000, nullable = false)
  private String eligibility;

  @Column(nullable = false)
  private LocalDate deadline;

  @Column(nullable = false)
  private boolean active = true;

  private Instant createdAt = Instant.now();
  private Instant updatedAt = Instant.now();

  public boolean isExpired() {
    return deadline != null && deadline.isBefore(LocalDate.now());
  }

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

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
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

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public JobType getJobType() {
    return jobType;
  }

  public void setJobType(JobType jobType) {
    this.jobType = jobType;
  }

  public WorkMode getWorkMode() {
    return workMode;
  }

  public void setWorkMode(WorkMode workMode) {
    this.workMode = workMode;
  }

  public String getSalary() {
    return salary;
  }

  public void setSalary(String salary) {
    this.salary = salary;
  }

  public String getRequiredSkills() {
    return requiredSkills;
  }

  public void setRequiredSkills(String requiredSkills) {
    this.requiredSkills = requiredSkills;
  }

  public ExperienceLevel getRequiredExperienceLevel() {
    return requiredExperienceLevel;
  }

  public void setRequiredExperienceLevel(ExperienceLevel requiredExperienceLevel) {
    this.requiredExperienceLevel = requiredExperienceLevel;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getEligibility() {
    return eligibility;
  }

  public void setEligibility(String eligibility) {
    this.eligibility = eligibility;
  }

  public LocalDate getDeadline() {
    return deadline;
  }

  public void setDeadline(LocalDate deadline) {
    this.deadline = deadline;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
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
