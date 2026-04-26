package com.jobswipe.entity;

public enum JobType {
  INTERNSHIP("Internship"),
  FULL_TIME("Full-time"),
  PART_TIME("Part-time"),
  REMOTE("Remote"),
  HYBRID("Hybrid"),
  CONTRACT("Contract");

  private final String label;

  JobType(String label) {
    this.label = label;
  }

  public String getLabel() {
    return label;
  }
}
