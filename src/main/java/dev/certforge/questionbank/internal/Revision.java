package dev.certforge.questionbank.internal;

import dev.certforge.questionbank.RevisionStatus;
import java.time.Instant;
import java.util.UUID;

/** A persisted revision with its content and lifecycle provenance. */
record Revision(
    UUID id,
    UUID questionId,
    int number,
    RevisionStatus status,
    UUID authorId,
    UUID examVersionId,
    Instant createdAt,
    Instant submittedAt,
    Instant publishedAt,
    UUID publishedBy,
    Instant deprecatedAt,
    RevisionContent content) {}
