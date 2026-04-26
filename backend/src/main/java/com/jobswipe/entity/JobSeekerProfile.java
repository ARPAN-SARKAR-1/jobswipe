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
import jakarta.persistence.OneToOne;
import java.time.Instant;

@Entity
public class JobSeekerProfile {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(nullable = false, unique = true)
  private User user;

  private String phone;
  private String githubUrl;
  private String resumePdfUrl;

  @Column(length = 1000)
  private String education;

  private String degree;
  private String college;
  private Integer passingYear;
  private String cgpaOrPercentage;

  @Column(length = 1000)
  private String skills;

  @Enumerated(EnumType.STRING)
  private ExperienceLevel experienceLevel = ExperienceLevel.FRESHER;

  private String preferredLocation;

  @Enumerated(EnumType.STRING)
  private JobType preferredJobType = JobType.INTERNSHIP;

  private Instant createdAt = Instant.now();
  private Instant updatedAt = Instant.now();

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getGithubUrl() {
    return githubUrl;
  }

  public void setGithubUrl(String githubUrl) {
    this.githubUrl = githubUrl;
  }

  public String getResumePdfUrl() {
    return resumePdfUrl;
  }

  public void setResumePdfUrl(String resumePdfUrl) {
    this.resumePdfUrl = resumePdfUrl;
  }

  public String getEducation() {
    return education;
  }

  public void setEducation(String education) {
    this.education = education;
  }

  public String getDegree() {
    return degree;
  }

  public void setDegree(String degree) {
    this.degree = degree;
  }

  public String getCollege() {
    return college;
  }

  public void setCollege(String college) {
    this.college = college;
  }

  public Integer getPassingYear() {
    return passingYear;
  }

  public void setPassingYear(Integer passingYear) {
    this.passingYear = passingYear;
  }

  public String getCgpaOrPercentage() {
    return cgpaOrPercentage;
  }

  public void setCgpaOrPercentage(String cgpaOrPercentage) {
    this.cgpaOrPercentage = cgpaOrPercentage;
  }

  public String getSkills() {
    return skills;
  }

  public void setSkills(String skills) {
    this.skills = skills;
  }

  public ExperienceLevel getExperienceLevel() {
    return experienceLevel;
  }

  public void setExperienceLevel(ExperienceLevel experienceLevel) {
    this.experienceLevel = experienceLevel;
  }

  public String getPreferredLocation() {
    return preferredLocation;
  }

  public void setPreferredLocation(String preferredLocation) {
    this.preferredLocation = preferredLocation;
  }

  public JobType getPreferredJobType() {
    return preferredJobType;
  }

  public void setPreferredJobType(JobType preferredJobType) {
    this.preferredJobType = preferredJobType;
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
