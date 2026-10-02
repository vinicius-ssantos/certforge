package dev.certforge.study.internal;

import dev.certforge.study.Confidence;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Immutable evidence of one accepted answer. */
record Attempt(
    UUID id,
    UUID sessionId,
    int position,
    UUID learnerId,
    UUID revisionId,
    List<String> selectedOptions,
    boolean correct,
    Confidence confidence,
    long elapsedMillis,
    Instant submittedAt,
    String idempotencyKey,
    String fingerprint) {

  Attempt {
    selectedOptions = List.copyOf(selectedOptions);
  }
}
