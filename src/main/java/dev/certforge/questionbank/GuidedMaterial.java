package dev.certforge.questionbank;

import java.util.List;

/**
 * What a reviewer wrote down about a free-form answer: the answer they would give, the concepts they
 * expected to hear, the mistakes people make, and what they would ask next.
 *
 * <p>This is not an answer key and it cannot be used as one. There is no correct option, no score
 * and nothing to compare a learner's words against mechanically — by
 * [ADR 0019](../../../../../../docs/adr/0019-behavioural-preparation-is-guidance-not-grading.md)
 * nothing about a guided answer is scored, and the record carries no field in which a score could
 * be put. It is handed to a learner after they have answered, so they can judge their own answer
 * against what a person expected.
 *
 * <p>Separate from {@link RevisionEvidence} on purpose. That record exists for correctness checks
 * and carries an answer key; this one exists because there is no correctness to check.
 */
public record GuidedMaterial(
    QuestionRevisionId revisionId,
    String referenceAnswer,
    List<ExpectedConcept> expectedConcepts,
    List<String> commonMistakes,
    /** What a reviewer would ask next, shown only after the primary answer is recorded. */
    List<String> followUps) {

  public GuidedMaterial {
    expectedConcepts = expectedConcepts == null ? List.of() : List.copyOf(expectedConcepts);
    commonMistakes = commonMistakes == null ? List.of() : List.copyOf(commonMistakes);
    followUps = followUps == null ? List.of() : List.copyOf(followUps);
  }

  /**
   * A concept a reviewer expected the answer to cover. {@code required} marks the ones they
   * considered essential; it is guidance for the learner reading it, not a threshold anything is
   * measured against.
   */
  public record ExpectedConcept(String text, boolean required, String explanation) {}
}
