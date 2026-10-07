package dev.certforge.questionbank;

import dev.certforge.preparationcatalog.TopicId;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

/** Read contract of the question bank for other modules (for example study sessions). */
public interface QuestionBank {

  /**
   * Published, learner-safe questions eligible for the current objective Study/Review/Mock flows,
   * bound to the topic's current active track version. Deprecated revisions and revisions of a
   * replaced version are never included, and a topic that is not active has none. Guided-response
   * interview revisions remain excluded until the dedicated interview-session contract is added.
   */
  List<PublishedQuestion> eligibleForTopic(TopicId topicId);

  /**
   * The learner-safe view of a revision that has been published, even if it has since been
   * deprecated. A study session snapshots revisions when it starts and must keep showing exactly
   * those, so later deprecation or replacement does not change an existing session. Empty for
   * revisions that were never published.
   */
  Optional<PublishedQuestion> findSnapshotQuestion(QuestionRevisionId revisionId);

  /** A published revision in learner-safe form; empty if it is not (or no longer) published. */
  Optional<PublishedQuestion> findPublished(QuestionRevisionId revisionId);

  /**
   * The exact revision, in any status including deprecated, with its answer key. Supports showing a
   * historical attempt with the revision the learner actually saw.
   */
  Optional<RevisionEvidence> findRevision(QuestionRevisionId revisionId);

  /**
   * Exact historical revisions with answer evidence, loaded as one batch for aggregate read models.
   * Missing ids are omitted from the result.
   */
  Map<QuestionRevisionId, RevisionEvidence> findRevisions(Set<QuestionRevisionId> revisionIds);
}
