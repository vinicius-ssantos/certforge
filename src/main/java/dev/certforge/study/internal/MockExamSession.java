package dev.certforge.study.internal;

import java.time.Instant;
import java.util.UUID;

/** Persisted timed mock-exam aggregate, without its immutable question snapshot. */
record MockExamSession(
    UUID id,
    UUID learnerId,
    UUID trackId,
    UUID examVersionId,
    MockExamStatus status,
    int questionCount,
    long timeLimitSeconds,
    int passingPercentage,
    int questionsPerTopic,
    Instant createdAt,
    Instant expiresAt,
    Instant closedAt) {}
