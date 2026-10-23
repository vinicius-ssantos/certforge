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
   * Published, learner-safe questions of one topic for an interview session, **including
   * guided-response ones**.
   *
   * <p>This is the one read where the guided filter does not apply. Study, review and mock exclude
   * guided revisions because those flows grade an answer against options, and a guided question has
   * none — an empty option set falling through objective grading would mark a free-form answer
   * wrong. An interview session knows the difference and dispatches on {@link
   * PublishedQuestion#type()}, which is why it may see them (ADR 0020).
   */
  List<PublishedQuestion> eligibleForInterview(TopicId topicId);

  /**
   * What a reviewer wrote down about a guided question, for showing after the learner has answered
   * it. Empty for an objective question, which has an answer key instead.
   */
  Optional<GuidedMaterial> findGuidedMaterial(QuestionRevisionId revisionId);

  /**
   * The learner-safe view of a revision an interview session snapshotted, objective or guided.
   *
   * <p>{@link #findSnapshotQuestion(QuestionRevisionId)} is the objective-only read every other
   * flow uses, and it stays that way: a guided revision returned there would reach code that grades
   * an empty option set. This one exists because an interview session snapshotted the guided
   * revision deliberately and has to be able to show it again.
   */
  Optional<PublishedQuestion> findInterviewSnapshotQuestion(QuestionRevisionId revisionId);

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
