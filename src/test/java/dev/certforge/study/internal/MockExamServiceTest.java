package dev.certforge.study.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;

import org.mockito.ArgumentCaptor;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.questionbank.Difficulty;
import dev.certforge.questionbank.PublishedOption;
import dev.certforge.questionbank.PublishedQuestion;
import dev.certforge.questionbank.QuestionBank;
import dev.certforge.questionbank.QuestionId;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.questionbank.QuestionType;
import dev.certforge.questionbank.RevisionEvidence;
import dev.certforge.questionbank.RevisionStatus;
import dev.certforge.study.internal.MockExamRepository.SnapshotQuestion;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.PlatformTransactionManager;

class MockExamServiceTest {

  private final MockExamRepository repository = mock(MockExamRepository.class);
  private final MockExamPlanner planner = mock(MockExamPlanner.class);
  private final PreparationCatalog catalog = mock(PreparationCatalog.class);
  private final QuestionBank questionBank = mock(QuestionBank.class);
  private final CurrentActor currentActor = mock(CurrentActor.class);
  private final PlatformTransactionManager transactionManager =
      mock(PlatformTransactionManager.class);

  private final UUID learner = UUID.randomUUID();
  private final UUID track = UUID.randomUUID();
  private final UUID exam = UUID.randomUUID();
  private final Instant now = Instant.parse("2026-10-03T04:00:00Z");
  private final Clock clock = Clock.fixed(now, ZoneOffset.UTC);

  private MockExamService service;

  @BeforeEach
  void setUp() {
    when(currentActor.require()).thenReturn(new ActorId(learner));
    service =
        new MockExamService(
            repository, planner, catalog, questionBank, currentActor, clock, transactionManager);
  }

  @Test
  void activeResponseReturnsOnlyAReceiptAndPersistsNoCorrectnessField() {
    UUID sessionId = UUID.randomUUID();
    QuestionFixture question = question("Prompt", "A");
    MockExamSession session = active(sessionId, 1, 100);
    SnapshotQuestion snapshot =
        new SnapshotQuestion(0, question.published().topicId().value(), question.revisionId());

    when(repository.find(sessionId)).thenReturn(Optional.of(session));
    when(repository.snapshotAt(sessionId, 0)).thenReturn(Optional.of(snapshot));
    when(repository.findResponseByKey(learner, "response_0001")).thenReturn(Optional.empty());
    when(questionBank.findRevision(new QuestionRevisionId(question.revisionId())))
        .thenReturn(Optional.of(question.evidence()));

    MockExamService.ResponseOutcome outcome =
        service.respond(sessionId, 0, "response_0001", List.of("A"));

    assertThat(outcome.replayed()).isFalse();
    assertThat(outcome.receipt().position()).isZero();
    assertThat(outcome.receipt().selectedOptions()).containsExactly("A");
    assertThat(
            Arrays.stream(outcome.receipt().getClass().getRecordComponents())
                .map(component -> component.getName()))
        .doesNotContain("correct", "answer", "explanation", "references");
    ArgumentCaptor<MockExamResponse> persisted = ArgumentCaptor.forClass(MockExamResponse.class);
    verify(repository).insertResponse(persisted.capture());

    when(repository.findResponseByKey(learner, "response_0001"))
        .thenReturn(Optional.of(persisted.getValue()));
    MockExamService.ResponseOutcome replay =
        service.respond(sessionId, 0, "response_0001", List.of("A"));

    assertThat(replay.replayed()).isTrue();
    assertThat(replay.receipt()).isEqualTo(outcome.receipt());
  }

  @Test
  void expirationIsEnforcedByTheServerClockWhenTheRunIsRead() {
    UUID sessionId = UUID.randomUUID();
    QuestionFixture question = question("Deadline", "A");
    MockExamSession due =
        new MockExamSession(
            sessionId,
            learner,
            track,
            exam,
            MockExamStatus.IN_PROGRESS,
            1,
            60,
            68,
            1,
            now.minusSeconds(60),
            now,
            null);
    MockExamSession expired =
        new MockExamSession(
            sessionId,
            learner,
            track,
            exam,
            MockExamStatus.EXPIRED,
            1,
            60,
            68,
            1,
            now.minusSeconds(60),
            now,
            now);
    SnapshotQuestion snapshot =
        new SnapshotQuestion(0, question.published().topicId().value(), question.revisionId());

    when(repository.find(sessionId)).thenReturn(Optional.of(due), Optional.of(expired));
    when(repository.snapshot(sessionId)).thenReturn(List.of(snapshot));
    when(repository.answeredPositions(sessionId)).thenReturn(List.of());
    when(questionBank.findSnapshotQuestion(new QuestionRevisionId(question.revisionId())))
        .thenReturn(Optional.of(question.published()));

    MockExamViews.MockExamView view = service.get(sessionId);

    assertThat(view.status()).isEqualTo("EXPIRED");
    verify(repository).close(sessionId, MockExamStatus.EXPIRED, now);
  }

  @Test
  void aResultCannotBeReadBeforeTheMockCloses() {
    UUID sessionId = UUID.randomUUID();
    when(repository.find(sessionId)).thenReturn(Optional.of(active(sessionId, 2, 50)));

    assertThatThrownBy(() -> service.result(sessionId))
        .isInstanceOfSatisfying(
            StudyException.class,
            error -> assertThat(error.code()).isEqualTo("mock_exam_in_progress"));
  }

  @Test
  void terminalResultUsesTheFullDenominatorAndRevealsAnswersOnlyThen() {
    UUID sessionId = UUID.randomUUID();
    QuestionFixture first = question("First", "A");
    QuestionFixture second = question("Second", "B");
    MockExamSession session =
        new MockExamSession(
            sessionId,
            learner,
            track,
            exam,
            MockExamStatus.COMPLETED,
            2,
            7_200,
            50,
            1,
            now.minusSeconds(300),
            now.plusSeconds(6_900),
            now);

    SnapshotQuestion firstSnapshot =
        new SnapshotQuestion(0, first.published().topicId().value(), first.revisionId());
    SnapshotQuestion secondSnapshot =
        new SnapshotQuestion(1, second.published().topicId().value(), second.revisionId());
    MockExamResponse response =
        new MockExamResponse(
            UUID.randomUUID(),
            sessionId,
            0,
            learner,
            first.revisionId(),
            List.of("A"),
            now.minusSeconds(100),
            "response_0002",
            "f".repeat(64));

    when(repository.find(sessionId)).thenReturn(Optional.of(session));
    when(repository.snapshot(sessionId)).thenReturn(List.of(firstSnapshot, secondSnapshot));
    when(repository.responses(sessionId)).thenReturn(List.of(response));
    when(questionBank.findSnapshotQuestion(new QuestionRevisionId(first.revisionId())))
        .thenReturn(Optional.of(first.published()));
    when(questionBank.findSnapshotQuestion(new QuestionRevisionId(second.revisionId())))
        .thenReturn(Optional.of(second.published()));
    when(questionBank.findRevision(new QuestionRevisionId(first.revisionId())))
        .thenReturn(Optional.of(first.evidence()));
    when(questionBank.findRevision(new QuestionRevisionId(second.revisionId())))
        .thenReturn(Optional.of(second.evidence()));

    MockExamViews.MockExamResult result = service.result(sessionId);

    assertThat(result.total()).isEqualTo(2);
    assertThat(result.answered()).isEqualTo(1);
    assertThat(result.correct()).isEqualTo(1);
    assertThat(result.percentage()).isEqualTo(50);
    assertThat(result.passingCorrectCount()).isEqualTo(1);
    assertThat(result.passed()).isTrue();
    assertThat(result.elapsedSeconds()).isEqualTo(300);
    assertThat(result.questions()).hasSize(2);
    assertThat(result.questions().getFirst().answer().correctOptions()).containsExactly("A");
    assertThat(result.questions().get(1).answered()).isFalse();
    assertThat(result.questions().get(1).correct()).isFalse();
    assertThat(result.questions().get(1).answer().correctOptions()).containsExactly("B");
  }

  private MockExamSession active(UUID id, int questions, int passingPercentage) {
    return new MockExamSession(
        id,
        learner,
        track,
        exam,
        MockExamStatus.IN_PROGRESS,
        questions,
        7_200,
        passingPercentage,
        1,
        now.minusSeconds(60),
        now.plusSeconds(7_140),
        null);
  }

  private static QuestionFixture question(String prompt, String correctKey) {
    UUID topic = UUID.randomUUID();
    UUID question = UUID.randomUUID();
    UUID revision = UUID.randomUUID();
    List<PublishedOption> publishedOptions =
        List.of(new PublishedOption("A", "Alpha"), new PublishedOption("B", "Beta"));
    PublishedQuestion published =
        new PublishedQuestion(
            new QuestionId(question),
            new QuestionRevisionId(revision),
            1,
            QuestionType.SINGLE_CHOICE,
            new dev.certforge.preparationcatalog.TopicId(topic),
            21,
            Difficulty.MEDIUM,
            prompt,
            publishedOptions);
    List<RevisionEvidence.Option> options =
        List.of(
            new RevisionEvidence.Option(
                "A", "Alpha", correctKey.equals("A"), correctKey.equals("A") ? "Correct" : "Wrong"),
            new RevisionEvidence.Option(
                "B", "Beta", correctKey.equals("B"), correctKey.equals("B") ? "Correct" : "Wrong"));
    RevisionEvidence evidence =
        new RevisionEvidence(
            published.questionId(),
            published.revisionId(),
            1,
            RevisionStatus.PUBLISHED,
            QuestionType.SINGLE_CHOICE,
            published.topicId(),
            21,
            prompt,
            "Overall explanation",
            options,
            List.of(new RevisionEvidence.Reference("JLS", "https://docs.oracle.com/")));
    return new QuestionFixture(revision, published, evidence);
  }

  private record QuestionFixture(
      UUID revisionId, PublishedQuestion published, RevisionEvidence evidence) {}
}
