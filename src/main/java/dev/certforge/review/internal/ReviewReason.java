package dev.certforge.review.internal;

/**
 * Why a question is in the review queue, in priority order (ADR 0013). These are stable codes; the
 * wording a learner reads belongs to the client, as it does for error codes, so it stays
 * translatable.
 *
 * <p>There is deliberately no score. The order of this enum is the order of the queue.
 */
enum ReviewReason {

  /**
   * Answered incorrectly having said {@code HIGH}. A misconception rather than a gap, and more
   * dangerous because the learner has no reason to look again. This is the reason the product
   * collects confidence in order to find.
   */
  WRONG_WHILE_CONFIDENT,

  /** Answered incorrectly at {@code MEDIUM} or {@code LOW}. A known gap. */
  WRONG,

  /**
   * Answered correctly having said {@code LOW}. A guess that landed, which accuracy calls success.
   */
  RIGHT_BUT_UNSURE,

  /** Answered correctly and confidently, long enough ago to be worth proving again. */
  DUE_FOR_RECALL
}
