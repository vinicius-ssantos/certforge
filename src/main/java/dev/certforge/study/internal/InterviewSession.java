package dev.certforge.study.internal;

import java.time.Instant;
import java.util.UUID;

/**
 * A persisted interview session, without its question snapshot.
 *
 * <p>Bound to a track version rather than a topic: an interview session spans a subset of a track's
 * topics, which is the difference ADR 0020 gave it its own aggregate for.
 */
record InterviewSession(
    UUID id,
    UUID learnerId,
    UUID trackVersionId,
    SessionStatus status,
    int requestedCount,
    Instant createdAt,
    Instant expiresAt,
    Instant closedAt) {}
