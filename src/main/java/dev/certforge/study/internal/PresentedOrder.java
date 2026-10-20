package dev.certforge.study.internal;

import dev.certforge.questionbank.PublishedQuestion;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.UUID;

/**
 * The order one question's options are shown in, for one session.
 *
 * <p>The questions of a session are shuffled; the options were not, and they are stored in the
 * order they were authored in. That turned an authoring habit into information: no four-option
 * question in the Java SE 21 pack has a correct D, so a learner who noticed eliminated an option
 * for free in every mock exam, and the score and the weakness report built on it measured the pack
 * rather than the learner. Rebalancing the keys is not available: a reviewed question's verdict is
 * recorded against its text, so editing one to improve its optics discards a person's review (ADR
 * 0005).
 *
 * <p>The order is derived from the session and the revision rather than drawn fresh, so every
 * payload about the same question in the same session agrees — the question as it is answered, and
 * the answer as it is reviewed afterwards — across a refetch, a restart and a later visit to the
 * history, with nothing stored and no migration. {@link Random} is specified down to the bit, which
 * is why it is used here in place of a stronger generator: the order has to be the same tomorrow.
 *
 * <p>What this does not do is hide the answer key. The packs are published in a public repository,
 * and anyone reading them sees what every question answers. It removes an accidental tell from the
 * examination; it does not make the examination secret.
 */
final class PresentedOrder {

  private PresentedOrder() {}

  /** The options of one question, in the order that session shows them. */
  static <T> List<T> of(UUID session, UUID revision, List<T> options) {
    List<T> presented = new ArrayList<>(options);
    Collections.shuffle(presented, new Random(seed(session, revision)));
    return List.copyOf(presented);
  }

  /** One question as that session shows it: the same question, its options in presented order. */
  static PublishedQuestion of(UUID session, PublishedQuestion question) {
    return new PublishedQuestion(
        question.questionId(),
        question.revisionId(),
        question.revisionNumber(),
        question.type(),
        question.topicId(),
        question.javaRelease(),
        question.difficulty(),
        question.prompt(),
        of(session, question.revisionId().value(), question.options()));
  }

  private static long seed(UUID session, UUID revision) {
    // Both halves of both identifiers, so two revisions of one session cannot collide on a prefix.
    return session.getMostSignificantBits() * 31
        + session.getLeastSignificantBits() * 37
        + revision.getMostSignificantBits() * 41
        + revision.getLeastSignificantBits() * 43;
  }
}
