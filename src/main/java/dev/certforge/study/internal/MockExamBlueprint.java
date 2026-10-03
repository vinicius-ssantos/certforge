package dev.certforge.study.internal;

import java.time.Duration;
import java.util.Objects;

/**
 * Immutable rules for one mock-exam format.
 *
 * <p>The blueprint is deliberately separate from the preparation catalog. The catalog says what an
 * exam covers; this object says how CertForge assembles a timed practice simulation for it.
 */
record MockExamBlueprint(
    String examCode,
    int questionCount,
    Duration timeLimit,
    int passingPercentage,
    int questionsPerTopic) {

  MockExamBlueprint {
    Objects.requireNonNull(examCode, "examCode");
    Objects.requireNonNull(timeLimit, "timeLimit");
    if (examCode.isBlank()) {
      throw new IllegalArgumentException("examCode must not be blank");
    }
    if (questionCount < 1) {
      throw new IllegalArgumentException("questionCount must be positive");
    }
    if (timeLimit.isZero() || timeLimit.isNegative()) {
      throw new IllegalArgumentException("timeLimit must be positive");
    }
    if (passingPercentage < 1 || passingPercentage > 100) {
      throw new IllegalArgumentException("passingPercentage must be between 1 and 100");
    }
    if (questionsPerTopic < 1 || questionCount % questionsPerTopic != 0) {
      throw new IllegalArgumentException(
          "questionsPerTopic must be positive and divide questionCount exactly");
    }
  }

  int topicCount() {
    return questionCount / questionsPerTopic;
  }

  int passingCorrectCount() {
    return (questionCount * passingPercentage + 99) / 100;
  }
}
