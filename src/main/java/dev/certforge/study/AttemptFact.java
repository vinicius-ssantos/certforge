package dev.certforge.study;

import dev.certforge.identity.ActorId;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.QuestionRevisionId;
import java.time.Instant;
import java.util.UUID;

/**
 * The facts of one accepted attempt that other modules may derive data from.
 *
 * <p>It carries no selected options and no answer key: what a learner chose is theirs, and nothing
 * derived from attempts has needed it. {@code confidence} and {@code revision} are here because a
 * review queue has to know which question was answered and how sure the learner was, which is the
 * difference between a gap and a misconception (ADR 0013).
 */
public record AttemptFact(
    UUID attemptId,
    ActorId learner,
    UUID sessionId,
    TopicId topic,
    QuestionRevisionId revision,
    boolean correct,
    Confidence confidence,
    Instant submittedAt) {}
