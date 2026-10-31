package dev.certforge.questionbank.internal;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class AiReviewTest {

  private static final Instant NOW = Instant.parse("2026-10-29T00:00:00Z");

  private static Review review(String decision, Instant decidedAt) {
    return new Review(UUID.randomUUID(), decision, null, List.of(), decidedAt);
  }

  @Test
  void aRevisionApprovedByAPersonIsNotAiApproved() {
    List<Review> reviews = List.of(review("APPROVED", NOW));
    assertThat(AiReview.approved(reviews)).isFalse();
  }

  @Test
  void aRevisionApprovedByTheAiReviewerIsAiApproved() {
    List<Review> reviews = List.of(review("AI_APPROVED", NOW));
    assertThat(AiReview.approved(reviews)).isTrue();
  }

  @Test
  void aRevisionWithNoReviewsAtAllIsNotAiApproved() {
    assertThat(AiReview.approved(List.of())).isFalse();
  }
}
