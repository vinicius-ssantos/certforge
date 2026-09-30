package dev.certforge.study;

import dev.certforge.identity.ActorId;
import java.util.List;

/**
 * Read contract over the persisted attempts, which are the source of truth. Anything derived from
 * them, such as progress, can be rebuilt from this.
 */
public interface StudyEvidence {

  /** Every accepted attempt of a learner, oldest first, in a stable order. */
  List<AttemptFact> attemptsOf(ActorId learner);

  /** The learners that have at least one accepted attempt. */
  List<ActorId> learnersWithAttempts();
}
