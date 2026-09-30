package dev.certforge.study.internal;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.TopicContext;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.PublishedQuestion;
import dev.certforge.questionbank.QuestionBank;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.study.internal.SessionViews.SessionQuestionView;
import dev.certforge.study.internal.SessionViews.SessionSummary;
import dev.certforge.study.internal.SessionViews.SessionView;
import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Study session lifecycle.
 *
 * <p>A session snapshots the revision ids and their order when it starts. Revisions are immutable,
 * so later publication, replacement or deprecation cannot change what an existing session contains.
 * Expiration is lazy: a session whose time is up becomes EXPIRED the next time it is touched, which
 * also frees the learner's slot for that topic.
 */
@Service
class StudyService {

  private final StudyRepository repository;
  private final AttemptRepository attempts;
  private final PreparationCatalog catalog;
  private final QuestionBank questionBank;
  private final QuestionSelector selector;
  private final CurrentActor currentActor;
  private final Clock clock;
  private final StudyProperties properties;
  private final TransactionTemplate transaction;

  StudyService(
      StudyRepository repository,
      AttemptRepository attempts,
      PreparationCatalog catalog,
      QuestionBank questionBank,
      QuestionSelector selector,
      CurrentActor currentActor,
      Clock clock,
      StudyProperties properties,
      PlatformTransactionManager transactionManager) {
    this.repository = repository;
    this.attempts = attempts;
    this.catalog = catalog;
    this.questionBank = questionBank;
    this.selector = selector;
    this.currentActor = currentActor;
    this.clock = clock;
    this.properties = properties;
    this.transaction = new TransactionTemplate(transactionManager);
  }

  int defaultQuestionCount() {
    return properties.defaultQuestionCount();
  }

  int maxQuestionCount() {
    return properties.maxQuestionCount();
  }

  // ---- start ---------------------------------------------------------------------------------

  /**
   * Starts a session for the current learner. The transaction is scoped to the insert so that a
   * concurrent start, rejected by the unique index, can be answered with the session that won.
   */
  SessionView start(UUID topicId, Integer requestedCount) {
    ActorId learner = currentActor.require();
    int count = requestedCount == null ? properties.defaultQuestionCount() : requestedCount;
    if (count < 1 || count > properties.maxQuestionCount()) {
      throw StudyException.invalid(
          "question_count_out_of_range",
          "The number of questions must be between 1 and " + properties.maxQuestionCount());
    }
    // PostgreSQL stores microseconds: truncating keeps the response equal to what is read later.
    Instant now = clock.instant().truncatedTo(ChronoUnit.MICROS);
    repository.expireDue(learner.value(), now);

    TopicContext context =
        catalog
            .findActiveTopicContext(new TopicId(topicId))
            .orElseThrow(() -> StudyException.notFound("topic_not_found", "Topic not found"));
    Optional<StudySession> existing = repository.findActive(learner.value(), topicId);
    if (existing.isPresent()) {
      throw activeSessionExists(existing.get());
    }

    List<PublishedQuestion> eligible = questionBank.eligibleForTopic(new TopicId(topicId));
    if (eligible.size() < count) {
      throw StudyException.conflict(
          "insufficient_content",
          "Not enough published questions for this topic",
          Map.of("requested", count, "available", eligible.size()));
    }
    List<PublishedQuestion> selected = selector.select(eligible, count);
    StudySession session =
        new StudySession(
            UUID.randomUUID(),
            learner.value(),
            topicId,
            context.examVersionId().value(),
            SessionStatus.IN_PROGRESS,
            count,
            now,
            now.plus(properties.sessionTtl()),
            null);
    List<UUID> revisionIds =
        selected.stream().map(question -> question.revisionId().value()).toList();
    try {
      transaction.executeWithoutResult(status -> repository.insert(session, revisionIds));
    } catch (DuplicateKeyException e) {
      // A concurrent start won the race for the unique in-progress slot.
      throw repository
          .findActive(learner.value(), topicId)
          .map(StudyService::activeSessionExists)
          .orElse(StudyException.conflict("active_session_exists", "A session is in progress"));
    }
    return view(session, selected, List.of());
  }

  private static StudyException activeSessionExists(StudySession existing) {
    return StudyException.conflict(
        "active_session_exists",
        "A session for this topic is already in progress",
        Map.of("sessionId", existing.id()));
  }

  // ---- reads ---------------------------------------------------------------------------------

  SessionView get(UUID sessionId) {
    StudySession session = owned(sessionId);
    return view(session, snapshot(session), attempts.answeredPositions(sessionId));
  }

  List<SessionSummary> list(SessionStatus status) {
    ActorId learner = currentActor.require();
    repository.expireDue(learner.value(), clock.instant());
    return repository.findByLearner(learner.value(), status).stream()
        .map(
            session ->
                new SessionSummary(
                    session.id(),
                    new TopicId(session.topicId()),
                    session.status().name(),
                    repository.questionCount(session.id()),
                    attempts.answeredPositions(session.id()).size(),
                    session.createdAt(),
                    session.expiresAt(),
                    session.closedAt()))
        .toList();
  }

  // ---- transitions ---------------------------------------------------------------------------

  SessionView complete(UUID sessionId) {
    return close(sessionId, SessionStatus.COMPLETED);
  }

  SessionView abandon(UUID sessionId) {
    return close(sessionId, SessionStatus.ABANDONED);
  }

  private SessionView close(UUID sessionId, SessionStatus to) {
    StudySession session = owned(sessionId);
    if (session.status() == SessionStatus.EXPIRED) {
      throw StudyException.conflict("session_expired", "The session has expired");
    }
    if (!repository.close(sessionId, to, clock.instant())) {
      // Another request closed it first (or it was already closed).
      throw StudyException.conflict(
          "session_not_in_progress", "The session is no longer in progress");
    }
    StudySession closed = repository.find(sessionId).orElseThrow();
    return view(closed, snapshot(closed), attempts.answeredPositions(sessionId));
  }

  // ---- internals -----------------------------------------------------------------------------

  /** The session if it belongs to the current learner, expiring it first when its time is up. */
  StudySession owned(UUID sessionId) {
    ActorId learner = currentActor.require();
    StudySession session =
        repository
            .find(sessionId)
            .filter(found -> found.learnerId().equals(learner.value()))
            .orElseThrow(() -> StudyException.notFound("session_not_found", "Session not found"));
    if (session.status() == SessionStatus.IN_PROGRESS
        && !session.expiresAt().isAfter(clock.instant())) {
      repository.close(sessionId, SessionStatus.EXPIRED, clock.instant());
      return repository.find(sessionId).orElseThrow();
    }
    return session;
  }

  /** The learner-safe questions of the snapshot, exactly as they were selected. */
  private List<PublishedQuestion> snapshot(StudySession session) {
    List<PublishedQuestion> questions = new ArrayList<>();
    for (UUID revisionId : repository.revisionIds(session.id())) {
      questions.add(
          questionBank
              .findSnapshotQuestion(new QuestionRevisionId(revisionId))
              .orElseThrow(
                  () ->
                      new IllegalStateException(
                          "Snapshot revision " + revisionId + " is no longer readable")));
    }
    return questions;
  }

  private static SessionView view(
      StudySession session, List<PublishedQuestion> questions, List<Integer> answered) {
    List<SessionQuestionView> views = new ArrayList<>();
    for (int position = 0; position < questions.size(); position++) {
      views.add(
          new SessionQuestionView(position, questions.get(position), answered.contains(position)));
    }
    return new SessionView(
        session.id(),
        new TopicId(session.topicId()),
        session.status().name(),
        session.requestedCount(),
        session.createdAt(),
        session.expiresAt(),
        session.closedAt(),
        views);
  }
}
