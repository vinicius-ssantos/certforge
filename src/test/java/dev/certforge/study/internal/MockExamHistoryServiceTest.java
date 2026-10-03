package dev.certforge.study.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.platform.Page;
import dev.certforge.questionbank.QuestionBank;
import dev.certforge.questionbank.QuestionId;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.questionbank.QuestionType;
import dev.certforge.questionbank.RevisionEvidence;
import dev.certforge.questionbank.RevisionStatus;
import dev.certforge.study.internal.MockExamRepository.SnapshotQuestion;
import dev.certforge.study.internal.MockExamViews.MockExamHistoryItem;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MockExamHistoryServiceTest {

  private final MockExamRepository repository = mock(MockExamRepository.class);
  private final QuestionBank questionBank = mock(QuestionBank.class);
  private final CurrentActor currentActor = mock(CurrentActor.class);

  private final UUID learner = UUID.randomUUID();
  private final UUID track = UUID.randomUUID();
  private final UUID exam = UUID.randomUUID();
  private final Instant now = Instant.parse("2026-10-03T17:00:00Z");
  private final Clock clock = Clock.fixed(now, ZoneOffset.UTC);

  private MockExamHistoryService service;

  @BeforeEach
  void setUp() {
    when(currentActor.require()).thenReturn(new ActorId(learner));
    service = new MockExamHistoryService(repository, questionBank, currentActor, clock);
  }

  @Test
  void activeHistoryExposesParticipationButNoCorrectnessOrTopicScores() {
    MockExamSession active =
        session(MockExamStatus.IN_PROGRESS, now.minusSeconds(600), null, 50, 68, 5);
    when(repository.findByLearner(learner, null, 21)).thenReturn(List.of(active));
    when(repository.answeredCount(active.id())).thenReturn(7);

    Page<MockExamHistoryItem> page = service.list(null, 20);

    assertThat(page.items()).hasSize(1);
    MockExamHistoryItem item = page.items().getFirst();
    assertThat(item.answeredCount()).isEqualTo(7);
    assertThat(item.correctCount()).isNull();
    assertThat(item.percentage()).isNull();
    assertThat(item.passed()).isNull();
    assertThat(item.topics()).isEmpty();
    verify(repository).expireDue(learner, now);
    verifyNoInteractions(questionBank);
  }

  @Test
  void terminalHistoryUsesTheFullDenominatorAndMarksTopicsBelowThePracticeTarget() {
    UUID topicStrong = UUID.randomUUID();
    UUID topicWeak = UUID.randomUUID();
    MockExamSession completed =
        session(MockExamStatus.COMPLETED, now.minusSeconds(3_600), now, 4, 68, 2);

    QuestionFixture q0 = question(topicStrong, "A");
    QuestionFixture q1 = question(topicStrong, "B");
    QuestionFixture q2 = question(topicWeak, "A");
    QuestionFixture q3 = question(topicWeak, "B");
    List<SnapshotQuestion> snapshot =
        List.of(
            new SnapshotQuestion(0, topicStrong, q0.revisionId()),
            new SnapshotQuestion(1, topicStrong, q1.revisionId()),
            new SnapshotQuestion(2, topicWeak, q2.revisionId()),
            new SnapshotQuestion(3, topicWeak, q3.revisionId()));
    List<MockExamResponse> responses =
        List.of(
            response(completed.id(), 0, q0.revisionId(), "A"),
            response(completed.id(), 1, q1.revisionId(), "B"),
            response(completed.id(), 2, q2.revisionId(), "B"));

    when(repository.findByLearner(learner, null, 21)).thenReturn(List.of(completed));
    when(repository.snapshot(completed.id())).thenReturn(snapshot);
    when(repository.responses(completed.id())).thenReturn(responses);
    for (QuestionFixture fixture : List.of(q0, q1, q2, q3)) {
      when(questionBank.findRevision(new QuestionRevisionId(fixture.revisionId())))
          .thenReturn(Optional.of(fixture.evidence()));
    }

    MockExamHistoryItem item = service.list(null, 20).items().getFirst();

    assertThat(item.answeredCount()).isEqualTo(3);
    assertThat(item.correctCount()).isEqualTo(2);
    assertThat(item.percentage()).isEqualTo(50);
    assertThat(item.passed()).isFalse();
    assertThat(item.topics()).hasSize(2);
    assertThat(item.topics())
        .anySatisfy(
            topic -> {
              assertThat(topic.topicId().value()).isEqualTo(topicStrong);
              assertThat(topic.percentage()).isEqualTo(100);
              assertThat(topic.needsReview()).isFalse();
            })
        .anySatisfy(
            topic -> {
              assertThat(topic.topicId().value()).isEqualTo(topicWeak);
              assertThat(topic.answered()).isEqualTo(1);
              assertThat(topic.correct()).isZero();
              assertThat(topic.percentage()).isZero();
              assertThat(topic.needsReview()).isTrue();
            });
  }

  private MockExamSession session(
      MockExamStatus status,
      Instant createdAt,
      Instant closedAt,
      int questionCount,
      int passingPercentage,
      int questionsPerTopic) {
    return new MockExamSession(
        UUID.randomUUID(),
        learner,
        track,
        exam,
        status,
        questionCount,
        7_200,
        passingPercentage,
        questionsPerTopic,
        createdAt,
        createdAt.plusSeconds(7_200),
        closedAt);
  }

  private MockExamResponse response(UUID sessionId, int position, UUID revisionId, String option) {
    return new MockExamResponse(
        UUID.randomUUID(),
        sessionId,
        position,
        learner,
        revisionId,
        List.of(option),
        now.minusSeconds(100),
        "response_" + position + "000000",
        "a".repeat(64));
  }

  private static QuestionFixture question(UUID topicId, String correctKey) {
    UUID revision = UUID.randomUUID();
    RevisionEvidence evidence =
        new RevisionEvidence(
            new QuestionId(UUID.randomUUID()),
            new QuestionRevisionId(revision),
            1,
            RevisionStatus.PUBLISHED,
            QuestionType.SINGLE_CHOICE,
            new dev.certforge.preparationcatalog.TopicId(topicId),
            21,
            "Prompt",
            "Explanation",
            List.of(
                new RevisionEvidence.Option(
                    "A", "Alpha", correctKey.equals("A"), correctKey.equals("A") ? "Correct" : "Wrong"),
                new RevisionEvidence.Option(
                    "B", "Beta", correctKey.equals("B"), correctKey.equals("B") ? "Correct" : "Wrong")),
            List.of());
    return new QuestionFixture(revision, evidence);
  }

  private record QuestionFixture(UUID revisionId, RevisionEvidence evidence) {}
}
