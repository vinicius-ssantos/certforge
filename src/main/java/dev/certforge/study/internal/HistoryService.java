package dev.certforge.study.internal;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.platform.Page;
import dev.certforge.platform.PageCursor;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.QuestionBank;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.questionbank.RevisionEvidence;
import dev.certforge.study.AttemptFact;
import dev.certforge.study.StudyEvidence;
import dev.certforge.study.internal.HistoryRepository.AttemptRow;
import dev.certforge.study.internal.HistoryRepository.SessionRow;
import dev.certforge.study.internal.HistoryViews.AttemptHistoryItem;
import dev.certforge.study.internal.HistoryViews.HistoricalOption;
import dev.certforge.study.internal.HistoryViews.HistoricalQuestion;
import dev.certforge.study.internal.HistoryViews.HistoricalReference;
import dev.certforge.study.internal.HistoryViews.SessionHistoryItem;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The learner's own history. Every query is scoped to the current learner, so another learner's
 * data is unreachable whatever identifiers are passed in. Attempts are shown with the exact
 * revision that was answered, read from the question bank by id.
 */
@Service
@Transactional(readOnly = true)
class HistoryService implements StudyEvidence {

  private final HistoryRepository history;
  private final StudyRepository sessionStore;
  private final QuestionBank questionBank;
  private final CurrentActor currentActor;
  private final Clock clock;

  HistoryService(
      HistoryRepository history,
      StudyRepository sessions,
      QuestionBank questionBank,
      CurrentActor currentActor,
      Clock clock) {
    this.history = history;
    this.sessionStore = sessions;
    this.questionBank = questionBank;
    this.currentActor = currentActor;
    this.clock = clock;
  }

  // ---- learner history -----------------------------------------------------------------------

  /** Sessions newest first. In-progress sessions past their time are expired first. */
  @Transactional
  Page<SessionHistoryItem> sessions(String cursor, Integer size) {
    UUID learner = currentActor.require().value();
    sessionStore.expireDue(learner, clock.instant());
    int limit = Page.size(size);
    List<SessionRow> rows = history.sessions(learner, PageCursor.decodeOrNull(cursor), limit + 1);
    return Page.of(
        rows,
        limit,
        row ->
            new SessionHistoryItem(
                row.id(),
                new TopicId(row.topicId()),
                row.status(),
                row.requestedCount(),
                row.answeredCount(),
                row.correctCount(),
                row.createdAt(),
                row.closedAt()),
        row -> new PageCursor(row.createdAt(), row.id()));
  }

  /** Accepted attempts newest first, each with the revision that was answered. */
  Page<AttemptHistoryItem> attempts(UUID topicId, UUID sessionId, String cursor, Integer size) {
    UUID learner = currentActor.require().value();
    int limit = Page.size(size);
    List<AttemptRow> rows =
        history.attempts(learner, topicId, sessionId, PageCursor.decodeOrNull(cursor), limit + 1);
    return Page.of(rows, limit, this::toItem, row -> new PageCursor(row.submittedAt(), row.id()));
  }

  private AttemptHistoryItem toItem(AttemptRow row) {
    RevisionEvidence revision =
        questionBank
            .findRevision(new QuestionRevisionId(row.revisionId()))
            .orElseThrow(
                () ->
                    new IllegalStateException(
                        "Revision " + row.revisionId() + " of an attempt is not readable"));
    return new AttemptHistoryItem(
        row.id(),
        row.sessionId(),
        row.position(),
        new TopicId(row.topicId()),
        row.submittedAt(),
        row.selectedOptions(),
        row.correct(),
        row.confidence(),
        row.elapsedMillis(),
        new HistoricalQuestion(
            row.revisionId(),
            revision.revisionNumber(),
            revision.status().name(),
            revision.type().name(),
            revision.prompt(),
            revision.explanation(),
            revision.options().stream()
                .map(o -> new HistoricalOption(o.key(), o.text(), o.correct(), o.explanation()))
                .toList(),
            revision.references().stream()
                .map(r -> new HistoricalReference(r.title(), r.url()))
                .toList()));
  }

  // ---- evidence for other modules ------------------------------------------------------------

  @Override
  public List<AttemptFact> attemptsOf(ActorId learner) {
    return history.facts(learner.value());
  }

  @Override
  public List<ActorId> learnersWithAttempts() {
    return history.learnersWithAttempts().stream().map(ActorId::new).toList();
  }
}
