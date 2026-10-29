package dev.certforge.questionbank.internal;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Derives an AI-sourced approval's state from its own review history alone (ADR 0022), the same way
 * a self-review is derived from reviewer and author identity rather than a stored flag: nothing
 * here is written, only read back from decisions {@link QuestionBankService} already recorded as
 * {@code AI_APPROVED} or {@code AI_REVIEW_CONFIRMED}.
 */
final class AiReview {

  private static final String AI_APPROVED = "AI_APPROVED";
  private static final String AI_REVIEW_CONFIRMED = "AI_REVIEW_CONFIRMED";

  private AiReview() {}

  /** True while the most recent AI approval, if there is one, has not yet been confirmed. */
  static boolean pending(List<Review> reviews) {
    return latestUnconfirmedApproval(reviews).isPresent();
  }

  /**
   * {@link #pending(List)}, and old enough that the confirmation window ADR 0022 sets has run out
   * with nobody confirming it. Evaluated against the clock every time it is asked, never stored.
   */
  static boolean lapsed(List<Review> reviews, Instant now, Duration window) {
    return latestUnconfirmedApproval(reviews)
        .filter(approval -> now.isAfter(approval.decidedAt().plus(window)))
        .isPresent();
  }

  /** When the pending approval's window runs out, for the editorial desk; empty if not pending. */
  static Optional<Instant> confirmBy(List<Review> reviews, Duration window) {
    return latestUnconfirmedApproval(reviews).map(approval -> approval.decidedAt().plus(window));
  }

  /**
   * The most recent {@code AI_APPROVED} decision, unless a later {@code AI_REVIEW_CONFIRMED}
   * already covers it. {@code reviews} is read in the order {@code QuestionRepository.findReviews}
   * returns it: by {@code decided_at}, oldest first.
   */
  private static Optional<Review> latestUnconfirmedApproval(List<Review> reviews) {
    Review latestApproval = null;
    for (Review review : reviews) {
      if (review.decision().equals(AI_APPROVED)) {
        latestApproval = review;
      }
    }
    if (latestApproval == null) {
      return Optional.empty();
    }
    for (Review review : reviews) {
      if (review.decision().equals(AI_REVIEW_CONFIRMED)
          && review.decidedAt().isAfter(latestApproval.decidedAt())) {
        return Optional.empty();
      }
    }
    return Optional.of(latestApproval);
  }
}
