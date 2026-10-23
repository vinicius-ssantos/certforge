package dev.certforge.study.internal;

import dev.certforge.study.Confidence;
import java.time.Instant;
import java.util.UUID;

/**
 * Immutable evidence of one answered interview item.
 *
 * <p>{@code selectedOptions} and {@code correct} are null for a guided item and present for an
 * objective one, which the database enforces as a check constraint rather than leaving to this
 * record. A guided answer has no correctness to record (ADR 0019), and the learner's own words are
 * never sent: what is kept is that they answered, how confident they were and how long it took.
 */
record InterviewResponse(
    UUID id,
    UUID sessionId,
    int position,
    UUID learnerId,
    UUID revisionId,
    ItemKind itemKind,
    String selectedOptions,
    Boolean correct,
    Confidence confidence,
    long elapsedMillis,
    Instant submittedAt,
    String idempotencyKey,
    String fingerprint) {

  InterviewResponse {
    if (itemKind == ItemKind.GUIDED && (selectedOptions != null || correct != null)) {
      throw new IllegalArgumentException("A guided response carries no options and no correctness");
    }
    if (itemKind == ItemKind.OBJECTIVE && (selectedOptions == null || correct == null)) {
      throw new IllegalArgumentException("An objective response carries options and correctness");
    }
  }
}
