package dev.certforge.questionbank.internal;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class AiReviewTest {

  private static final Instant NOW = Instant.parse("2026-10-29T00:00:00Z");
  private static final Duration WINDOW = Duration.ofDays(14);

  private static Review review(String decision, Instant decidedAt) {
    return new Review(UUID.randomUUID(), decision, null, List.of(), decidedAt);
  }

  @Test
  void aRevisionWithNoAiApprovalIsNeitherPendingNorLapsed() {
    List<Review> reviews = List.of(review("APPROVED", NOW));
    assertThat(AiReview.pending(reviews)).isFalse();
    assertThat(AiReview.lapsed(reviews, NOW, WINDOW)).isFalse();
    assertThat(AiReview.confirmBy(reviews, WINDOW)).isEmpty();
  }

  @Test
  void anAiApprovalIsPendingButNotYetLapsedWithinTheWindow() {
    Instant decidedAt = NOW.minus(Duration.ofDays(1));
    List<Review> reviews = List.of(review("AI_APPROVED", decidedAt));
    assertThat(AiReview.pending(reviews)).isTrue();
    assertThat(AiReview.lapsed(reviews, NOW, WINDOW)).isFalse();
    assertThat(AiReview.confirmBy(reviews, WINDOW)).contains(decidedAt.plus(WINDOW));
  }

  @Test
  void anAiApprovalLapsesOnceTheWindowHasPassedWithNoConfirmation() {
    Instant decidedAt = NOW.minus(Duration.ofDays(15));
    List<Review> reviews = List.of(review("AI_APPROVED", decidedAt));
    assertThat(AiReview.pending(reviews)).isTrue();
    assertThat(AiReview.lapsed(reviews, NOW, WINDOW)).isTrue();
  }

  @Test
  void aConfirmationAfterTheApprovalMakesItNoLongerPendingOrLapsed() {
    Instant decidedAt = NOW.minus(Duration.ofDays(15));
    List<Review> reviews =
        List.of(review("AI_APPROVED", decidedAt), review("AI_REVIEW_CONFIRMED", NOW));
    assertThat(AiReview.pending(reviews)).isFalse();
    assertThat(AiReview.lapsed(reviews, NOW, WINDOW)).isFalse();
    assertThat(AiReview.confirmBy(reviews, WINDOW)).isEmpty();
  }

  @Test
  void aConfirmationBeforeTheApprovalDoesNotCountItIsStaleHistory() {
    // A revision can be AI-approved more than once across its DRAFT -> TECHNICAL_REVIEW cycles
    // (request-changes sends it back, a later approval is a new AI_APPROVED). A confirmation that
    // predates the latest approval confirmed an earlier one, not this one.
    Instant firstApproval = NOW.minus(Duration.ofDays(20));
    Instant staleConfirmation = NOW.minus(Duration.ofDays(18));
    Instant secondApproval = NOW.minus(Duration.ofDays(1));
    List<Review> reviews =
        List.of(
            review("AI_APPROVED", firstApproval),
            review("AI_REVIEW_CONFIRMED", staleConfirmation),
            review("AI_APPROVED", secondApproval));
    assertThat(AiReview.pending(reviews)).isTrue();
    assertThat(AiReview.lapsed(reviews, NOW, WINDOW)).isFalse();
  }

  @Test
  void onlyTheLatestAiApprovalDecidesLapseWhenItWasRequestedChangesAndReapprovedSince() {
    Instant oldApproval = NOW.minus(Duration.ofDays(30));
    Instant recentApproval = NOW.minus(Duration.ofDays(1));
    List<Review> reviews =
        List.of(review("AI_APPROVED", oldApproval), review("AI_APPROVED", recentApproval));
    assertThat(AiReview.lapsed(reviews, NOW, WINDOW)).isFalse();
    assertThat(AiReview.confirmBy(reviews, WINDOW)).contains(recentApproval.plus(WINDOW));
  }
}
