package dev.certforge.study;

import dev.certforge.identity.ActorId;
import dev.certforge.preparationcatalog.TopicId;
import java.time.Instant;
import java.util.UUID;

/** The facts of one accepted attempt that other modules may derive data from. */
public record AttemptFact(
    UUID attemptId,
    ActorId learner,
    UUID sessionId,
    TopicId topic,
    boolean correct,
    Instant submittedAt) {}
