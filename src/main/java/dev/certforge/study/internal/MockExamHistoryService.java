package dev.certforge.study.internal;

import dev.certforge.identity.CurrentActor;
import dev.certforge.platform.Page;
import dev.certforge.platform.PageCursor;
import dev.certforge.preparationcatalog.PreparationTrackId;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.QuestionBank;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.questionbank.RevisionEvidence;
import dev.certforge.study.internal.MockExamRepository.SnapshotQuestion;
import dev.certforge.study.internal.MockExamViews.MockExamHistoryItem;
import dev.certforge.study.internal.MockExamViews.MockExamTopicHistoryItem;
import java.time.Clock;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Read model for mock-exam history.
 *
 * <p>Unlike ordinary topic practice, mock results stay in their own evidence stream. Active runs
 * expose only participation counts; correctness and topic scores appear only after the run closes.
 */
@Service
@Transactional(readOnly = true)
class MockExamHistoryService {

  private final MockExamRepository repository;
  private final QuestionBank questionBank;
  private final CurrentActor currentActor;
  private final Clock clock;

  MockExamHistoryService(
      MockExamRepository repository,
      QuestionBank questionBank,
      CurrentActor currentActor,
      Clock clock) {
    this.repository = repository;
    this.questionBank = questionBank;
    this.currentActor = currentActor;
    this.clock = clock;
  }

  @Transactional
  Page<MockExamHistoryItem> list(String cursor, Integer size) {
    UUID learner = currentActor.require().value();
    repository.expireDue(learner, clock.instant());
    int limit = Page.size(size);
    List<MockExamSession> rows =
        repository.findByLearner(learner, PageCursor.decodeOrNull(cursor), limit + 1);
    List<MockExamSession> visible = rows.size() > limit ? rows.subList(0, limit) : rows;

    Map<UUID, List<SnapshotQuestion>> snapshots = new HashMap<>();
    Set<QuestionRevisionId> revisionIds = new LinkedHashSet<>();
    for (MockExamSession session : visible) {
      if (session.status() != MockExamStatus.IN_PROGRESS) {
        List<SnapshotQuestion> snapshot = repository.snapshot(session.id());
        snapshots.put(session.id(), snapshot);
        snapshot.forEach(item -> revisionIds.add(new QuestionRevisionId(item.revisionId())));
      }
    }
    Map<QuestionRevisionId, RevisionEvidence> evidence =
        revisionIds.isEmpty() ? Map.of() : questionBank.findRevisions(revisionIds);

    return Page.of(
        rows,
        limit,
        session -> toItem(session, snapshots.get(session.id()), evidence),
        session -> new PageCursor(session.createdAt(), session.id()));
  }

  private MockExamHistoryItem toItem(
      MockExamSession session,
      List<SnapshotQuestion> snapshot,
      Map<QuestionRevisionId, RevisionEvidence> evidence) {
    if (session.status() == MockExamStatus.IN_PROGRESS) {
      return new MockExamHistoryItem(
          session.id(),
          new PreparationTrackId(session.trackId()),
          session.status().name(),
          session.questionCount(),
          repository.answeredCount(session.id()),
          null,
          null,
          session.passingPercentage(),
          null,
          session.createdAt(),
          session.expiresAt(),
          session.closedAt(),
          List.of());
    }

    if (snapshot == null) {
      throw new IllegalStateException("Terminal mock " + session.id() + " has no snapshot");
    }
    Map<Integer, MockExamResponse> responses = new HashMap<>();
    repository
        .responses(session.id())
        .forEach(response -> responses.put(response.position(), response));

    int correct = 0;
    Map<UUID, TopicAccumulator> perTopic = new LinkedHashMap<>();
    for (SnapshotQuestion item : snapshot) {
      MockExamResponse response = responses.get(item.position());
      boolean answered = response != null;
      boolean isCorrect =
          answered
              && MockExamScoring.grade(
                  evidence(item.revisionId(), evidence), response.selectedOptions());
      if (isCorrect) {
        correct++;
      }

      TopicAccumulator topic =
          perTopic.computeIfAbsent(item.topicId(), ignored -> new TopicAccumulator());
      topic.total++;
      if (answered) {
        topic.answered++;
      }
      if (isCorrect) {
        topic.correct++;
      }
    }

    int percentage = MockExamScoring.percentage(correct, session.questionCount());
    int passingCorrect =
        MockExamScoring.passingCorrectCount(session.questionCount(), session.passingPercentage());
    List<MockExamTopicHistoryItem> topics = new ArrayList<>(perTopic.size());
    perTopic.forEach(
        (topicId, counts) -> {
          int topicPercentage = MockExamScoring.percentage(counts.correct, counts.total);
          topics.add(
              new MockExamTopicHistoryItem(
                  new TopicId(topicId),
                  counts.total,
                  counts.answered,
                  counts.correct,
                  topicPercentage,
                  topicPercentage < session.passingPercentage()));
        });

    return new MockExamHistoryItem(
        session.id(),
        new PreparationTrackId(session.trackId()),
        session.status().name(),
        session.questionCount(),
        responses.size(),
        correct,
        percentage,
        session.passingPercentage(),
        correct >= passingCorrect,
        session.createdAt(),
        session.expiresAt(),
        session.closedAt(),
        List.copyOf(topics));
  }

  private static RevisionEvidence evidence(
      UUID revisionId, Map<QuestionRevisionId, RevisionEvidence> evidence) {
    RevisionEvidence found = evidence.get(new QuestionRevisionId(revisionId));
    if (found == null) {
      throw new IllegalStateException("Revision " + revisionId + " is no longer readable");
    }
    return found;
  }

  private static final class TopicAccumulator {
    private int total;
    private int answered;
    private int correct;
  }
}
