package dev.certforge.study.internal;

import dev.certforge.questionbank.RevisionEvidence;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/** Shared grading arithmetic for terminal mock-exam projections. */
final class MockExamScoring {

  private MockExamScoring() {}

  static boolean grade(RevisionEvidence evidence, List<String> selected) {
    Set<String> correct = new HashSet<>();
    evidence.options().stream()
        .filter(RevisionEvidence.Option::correct)
        .forEach(option -> correct.add(option.key()));
    return correct.equals(new HashSet<>(selected));
  }

  static int percentage(int correct, int total) {
    return total == 0 ? 0 : (correct * 100) / total;
  }

  static int passingCorrectCount(int total, int passingPercentage) {
    return (total * passingPercentage + 99) / 100;
  }
}
