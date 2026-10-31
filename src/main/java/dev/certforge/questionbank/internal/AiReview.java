package dev.certforge.questionbank.internal;

import java.util.List;

/**
 * Whether a revision's standing approval came from the AI reviewer rather than a person (ADR 0022,
 * made final rather than provisional by ADR 0025): read back from the decision already recorded as
 * {@code AI_APPROVED}, the same way a self-review is derived from reviewer and author identity
 * rather than a stored flag. Nothing here is written, only read.
 */
final class AiReview {

  private static final String AI_APPROVED = "AI_APPROVED";

  private AiReview() {}

  /** True if this revision's standing approval is the AI reviewer's, not a person's. */
  static boolean approved(List<Review> reviews) {
    return reviews.stream().anyMatch(review -> review.decision().equals(AI_APPROVED));
  }
}
