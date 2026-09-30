package dev.certforge.study;

import dev.certforge.identity.ActorId;
import dev.certforge.preparationcatalog.TopicId;
import java.time.Instant;
import java.util.UUID;

/**
 * Published, inside the submitting transaction, each time a new attempt is accepted. It is not
 * published for an idempotent replay. Listeners run synchronously, so a projection built from it is
 * updated atomically with the attempt and can never count one that was rolled back.
 */
public record AttemptRecorded(
    UUID attemptId, ActorId learner, TopicId topic, boolean correct, Instant submittedAt) {}
