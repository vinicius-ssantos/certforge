package dev.certforge.questionbank.internal;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** A technical review decision recorded against one revision. */
record Review(
    UUID reviewerId, String decision, String comment, List<String> checklist, Instant decidedAt) {}
