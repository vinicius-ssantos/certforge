package dev.certforge.study.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import dev.certforge.study.internal.MockExamRepository.SnapshotQuestion;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@SpringBootTest
@Testcontainers
class MockExamPersistenceIT {

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired MockExamRepository repository;
  @Autowired JdbcTemplate jdbc;
  @Autowired PlatformTransactionManager transactionManager;

  @Test
  void persistsTheBlueprintAndAnImmutableOrderedSnapshot() {
    UUID learner = UUID.randomUUID();
    UUID track = UUID.randomUUID();
    MockExamSession session = session(learner, track, Instant.parse("2026-10-03T02:00:00Z"));
    List<SnapshotQuestion> questions = questions(3);

    insert(session, questions);

    assertThat(repository.find(session.id())).contains(session);
    assertThat(repository.findActive(learner, track)).contains(session);
    assertThat(repository.snapshot(session.id())).containsExactlyElementsOf(questions);

    assertThatThrownBy(
            () ->
                jdbc.update(
                    "update certforge.mock_exam_question set topic_id = ?"
                        + " where session_id = ? and position = 0",
                    UUID.randomUUID(),
                    session.id()))
        .hasMessageContaining("immutable");
    assertThatThrownBy(
            () ->
                jdbc.update(
                    "delete from certforge.mock_exam_question where session_id = ?", session.id()))
        .hasMessageContaining("immutable");
    assertThatThrownBy(
            () ->
                jdbc.update(
                    "insert into certforge.mock_exam_question"
                        + " (session_id, position, topic_id, revision_id) values (?, 99, ?, ?)",
                    session.id(),
                    UUID.randomUUID(),
                    UUID.randomUUID()))
        .hasMessageContaining("immutable");
  }

  @Test
  void onlyOneActiveMockExistsPerLearnerAndTrackAndTerminalRunsNoLongerBlockAStart() {
    UUID learner = UUID.randomUUID();
    UUID track = UUID.randomUUID();
    Instant now = Instant.parse("2026-10-03T03:00:00Z");
    MockExamSession first = session(learner, track, now);
    insert(first, questions(3));

    MockExamSession duplicate = session(learner, track, now.plusSeconds(1));
    assertThatThrownBy(() -> insert(duplicate, questions(3)))
        .isInstanceOf(DuplicateKeyException.class);

    assertThat(repository.close(first.id(), MockExamStatus.COMPLETED, now.plusSeconds(30)))
        .isTrue();
    assertThat(repository.close(first.id(), MockExamStatus.COMPLETED, now.plusSeconds(31)))
        .isFalse();

    MockExamSession next = session(learner, track, now.plusSeconds(40));
    insert(next, questions(3));
    assertThat(repository.findActive(learner, track)).contains(next);
  }

  @Test
  void expirationClosesDueMocksAndLeavesFutureMocksAlone() {
    UUID learner = UUID.randomUUID();
    Instant now = Instant.parse("2026-10-03T04:00:00Z");
    MockExamSession due = session(learner, UUID.randomUUID(), now.minusSeconds(8_000));
    MockExamSession future = session(learner, UUID.randomUUID(), now);
    insert(due, questions(3));
    insert(future, questions(3));

    assertThat(repository.expireDue(learner, now)).isEqualTo(1);
    assertThat(repository.find(due.id()).orElseThrow().status()).isEqualTo(MockExamStatus.EXPIRED);
    assertThat(repository.find(due.id()).orElseThrow().closedAt()).isEqualTo(now);
    assertThat(repository.find(future.id()).orElseThrow().status())
        .isEqualTo(MockExamStatus.IN_PROGRESS);
  }

  @Test
  void responsesAreImmutableBoundToTheSnapshotAndRejectedAfterClose() {
    UUID learner = UUID.randomUUID();
    Instant now = Instant.parse("2026-10-03T05:00:00Z");
    MockExamSession session = session(learner, UUID.randomUUID(), now);
    List<SnapshotQuestion> questions = questions(3);
    insert(session, questions);

    MockExamResponse response =
        new MockExamResponse(
            UUID.randomUUID(),
            session.id(),
            0,
            learner,
            questions.getFirst().revisionId(),
            List.of("A", "C"),
            now.plusSeconds(10),
            "response_key_0001",
            "a".repeat(64));
    repository.insertResponse(response);

    assertThat(repository.findResponse(session.id(), 0)).contains(response);
    assertThat(repository.findResponseByKey(learner, "response_key_0001")).contains(response);
    assertThat(repository.answeredPositions(session.id())).containsExactly(0);
    assertThat(repository.answeredCount(session.id())).isEqualTo(1);

    assertThatThrownBy(
            () ->
                jdbc.update(
                    "update certforge.mock_exam_response set selected_options = 'B'"
                        + " where id = ?",
                    response.id()))
        .hasMessageContaining("immutable evidence");
    assertThatThrownBy(
            () ->
                jdbc.update("delete from certforge.mock_exam_response where id = ?", response.id()))
        .hasMessageContaining("immutable evidence");

    MockExamResponse wrongRevision =
        new MockExamResponse(
            UUID.randomUUID(),
            session.id(),
            1,
            learner,
            UUID.randomUUID(),
            List.of("A"),
            now.plusSeconds(20),
            "response_key_0002",
            "b".repeat(64));
    assertThatThrownBy(() -> repository.insertResponse(wrongRevision))
        .hasMessageContaining("does not match the snapshot");

    assertThat(repository.close(session.id(), MockExamStatus.COMPLETED, now.plusSeconds(30)))
        .isTrue();
    SnapshotQuestion third = questions.get(2);
    MockExamResponse afterClose =
        new MockExamResponse(
            UUID.randomUUID(),
            session.id(),
            2,
            learner,
            third.revisionId(),
            List.of("B"),
            now.plusSeconds(31),
            "response_key_0003",
            "c".repeat(64));
    assertThatThrownBy(() -> repository.insertResponse(afterClose))
        .hasMessageContaining("not in progress");
  }

  @Test
  void aResponseTimestampPastTheServerDeadlineIsRejectedAtTheDatabaseBoundary() {
    UUID learner = UUID.randomUUID();
    Instant now = Instant.parse("2026-10-03T06:00:00Z");
    MockExamSession session = session(learner, UUID.randomUUID(), now);
    List<SnapshotQuestion> questions = questions(3);
    insert(session, questions);

    MockExamResponse late =
        new MockExamResponse(
            UUID.randomUUID(),
            session.id(),
            0,
            learner,
            questions.getFirst().revisionId(),
            List.of("A"),
            session.expiresAt().plusMillis(1),
            "response_key_late",
            "d".repeat(64));

    assertThatThrownBy(() -> repository.insertResponse(late)).hasMessageContaining("has expired");
  }

  private void insert(MockExamSession session, List<SnapshotQuestion> questions) {
    new TransactionTemplate(transactionManager)
        .executeWithoutResult(status -> repository.insert(session, questions));
  }

  private static MockExamSession session(UUID learner, UUID track, Instant createdAt) {
    Instant created = createdAt.truncatedTo(ChronoUnit.MICROS);
    return new MockExamSession(
        UUID.randomUUID(),
        learner,
        track,
        UUID.randomUUID(),
        MockExamStatus.IN_PROGRESS,
        3,
        7_200,
        68,
        1,
        created,
        created.plusSeconds(7_200),
        null);
  }

  private static List<SnapshotQuestion> questions(int count) {
    return java.util.stream.IntStream.range(0, count)
        .mapToObj(position -> new SnapshotQuestion(position, UUID.randomUUID(), UUID.randomUUID()))
        .toList();
  }
}
