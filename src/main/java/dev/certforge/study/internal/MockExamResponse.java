package dev.certforge.study.internal;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Immutable learner response evidence for one position in a mock exam. */
record MockExamResponse(
    UUID id,
    UUID sessionId,
    int position,
    UUID learnerId,
    UUID revisionId,
    List<String> selectedOptions,
    Instant submittedAt,
    String idempotencyKey,
    String fingerprint) {}
