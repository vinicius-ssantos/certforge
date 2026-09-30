package dev.certforge.questionbank;

import dev.certforge.preparationcatalog.TopicId;
import java.util.List;
import java.util.Optional;

/** Read contract of the question bank for other modules (for example study sessions). */
public interface QuestionBank {

  /** Published, learner-safe questions for a topic. Deprecated revisions are never included. */
  List<PublishedQuestion> eligibleForTopic(TopicId topicId);

  /** A published revision in learner-safe form; empty if it is not (or no longer) published. */
  Optional<PublishedQuestion> findPublished(QuestionRevisionId revisionId);

  /**
   * The exact revision, in any status including deprecated, with its answer key. Supports showing a
   * historical attempt with the revision the learner actually saw.
   */
  Optional<RevisionEvidence> findRevision(QuestionRevisionId revisionId);
}
