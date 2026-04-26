package com.jobswipe.entity;

public enum ExperienceLevel {
  FRESHER("Fresher"),
  ZERO_TO_ONE("0-1 years"),
  ONE_TO_TWO("1-2 years"),
  TWO_PLUS("2+ years");

  private final String label;

  ExperienceLevel(String label) {
    this.label = label;
  }

  public String getLabel() {
    return label;
  }
}
