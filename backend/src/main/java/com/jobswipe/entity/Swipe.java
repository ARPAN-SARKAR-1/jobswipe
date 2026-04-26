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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"job_seeker_id", "job_id"}))
public class Swipe {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "job_seeker_id", nullable = false)
  private User jobSeeker;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "job_id", nullable = false)
  private Job job;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private SwipeAction action;

  private Instant createdAt = Instant.now();

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public User getJobSeeker() {
    return jobSeeker;
  }

  public void setJobSeeker(User jobSeeker) {
    this.jobSeeker = jobSeeker;
  }

  public Job getJob() {
    return job;
  }

  public void setJob(Job job) {
    this.job = job;
  }

  public SwipeAction getAction() {
    return action;
  }

  public void setAction(SwipeAction action) {
    this.action = action;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
