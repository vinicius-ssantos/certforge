package dev.certforge.study.internal;

import java.time.Instant;
import java.util.UUID;

/** A persisted study session (without its question snapshot). */
record StudySession(
    UUID id,
    UUID learnerId,
    UUID topicId,
    UUID trackVersionId,
    SessionStatus status,
    int requestedCount,
    Instant createdAt,
    Instant expiresAt,
    Instant closedAt) {}
