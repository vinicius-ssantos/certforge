package dev.certforge.study.internal;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import dev.certforge.platform.PageCursor;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Persistence boundary for the separate timed mock-exam aggregate. */
@Repository
class MockExamRepository {

  record SnapshotQuestion(int position, UUID topicId, UUID revisionId) {}

  private static final String ID = "id";
  private static final String LEARNER = "learner";
  private static final String SESSION = "session";
  private static final String POSITION = "position";
  private static final String STATUS = "status";
  private static final String SELECT_SESSION =
      "select id, learner_id, track_id, exam_version_id, status, question_count,"
          + " time_limit_seconds, passing_percentage, questions_per_topic, created_at, expires_at,"
          + " closed_at from certforge.mock_exam_session";
  private static final String SELECT_RESPONSE =
      "select id, session_id, position, learner_id, revision_id, selected_options, submitted_at,"
          + " idempotency_key, request_fingerprint from certforge.mock_exam_response";

  private final JdbcClient jdbc;

  MockExamRepository(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  /** Inserts the aggregate root and its complete immutable question snapshot. */
  void insert(MockExamSession session, List<SnapshotQuestion> questions) {
    validateSnapshot(session, questions);
    jdbc.sql(
            "insert into certforge.mock_exam_session"
                + " (id, learner_id, track_id, exam_version_id, status, question_count,"
                + " time_limit_seconds, passing_percentage, questions_per_topic, created_at,"
                + " expires_at, closed_at)"
                + " values (:id, :learner, :track, :exam, :status, :count, :limit,"
                + " :passing, :perTopic, :created, :expires, :closed)")
        .param(ID, session.id())
        .param(LEARNER, session.learnerId())
        .param("track", session.trackId())
        .param("exam", session.examVersionId())
        .param(STATUS, session.status().name())
        .param("count", session.questionCount())
        .param("limit", session.timeLimitSeconds())
        .param("passing", session.passingPercentage())
        .param("perTopic", session.questionsPerTopic())
        .param("created", utc(session.createdAt()))
        .param("expires", utc(session.expiresAt()))
        .param("closed", session.closedAt() == null ? null : utc(session.closedAt()))
        .update();

    for (SnapshotQuestion question : questions) {
      jdbc.sql(
              "insert into certforge.mock_exam_question"
                  + " (session_id, position, topic_id, revision_id)"
                  + " values (:session, :position, :topic, :revision)")
          .param(SESSION, session.id())
          .param(POSITION, question.position())
          .param("topic", question.topicId())
          .param("revision", question.revisionId())
          .update();
    }
  }

  private static void validateSnapshot(MockExamSession session, List<SnapshotQuestion> questions) {
    if (questions.size() != session.questionCount()) {
      throw new IllegalArgumentException(
          "Mock exam snapshot must contain exactly " + session.questionCount() + " questions");
    }

    Set<UUID> revisions = new HashSet<>();
    Map<UUID, Integer> perTopic = new HashMap<>();
    for (int index = 0; index < questions.size(); index++) {
      SnapshotQuestion question = questions.get(index);
      if (question.position() != index) {
        throw new IllegalArgumentException("Mock exam snapshot positions must be contiguous");
      }
      if (!revisions.add(question.revisionId())) {
        throw new IllegalArgumentException("Mock exam snapshot revisions must be distinct");
      }
      perTopic.merge(question.topicId(), 1, Integer::sum);
    }

    int expectedTopics = session.questionCount() / session.questionsPerTopic();
    if (perTopic.size() != expectedTopics
        || perTopic.values().stream().anyMatch(count -> count != session.questionsPerTopic())) {
      throw new IllegalArgumentException(
          "Mock exam snapshot must match the persisted topic distribution");
    }
  }

  Optional<MockExamSession> find(UUID id) {
    return jdbc.sql(SELECT_SESSION + " where id = :id")
        .param(ID, id)
        .query(MockExamRepository::mapSession)
        .optional();
  }

  Optional<MockExamSession> findActive(UUID learnerId, UUID trackId) {
    return jdbc.sql(
            SELECT_SESSION
                + " where learner_id = :learner and track_id = :track"
                + " and status = 'IN_PROGRESS'")
        .param(LEARNER, learnerId)
        .param("track", trackId)
        .query(MockExamRepository::mapSession)
        .optional();
  }

  List<MockExamSession> findByLearner(UUID learnerId) {
    return jdbc.sql(SELECT_SESSION + " where learner_id = :learner order by created_at desc, id")
        .param(LEARNER, learnerId)
        .query(MockExamRepository::mapSession)
        .list();
  }

  /** Terminal mock exams newest first, strictly after the cursor. */
  List<MockExamSession> history(UUID learnerId, PageCursor after, int limit) {
    String paging =
        after == null ? "" : " and (created_at, id) < (:cursorAt, :cursorId)";
    var statement =
        jdbc.sql(
                SELECT_SESSION
                    + " where learner_id = :learner and status <> 'IN_PROGRESS'"
                    + paging
                    + " order by created_at desc, id desc limit :limit")
            .param(LEARNER, learnerId)
            .param("limit", limit);
    if (after != null) {
      statement =
          statement
              .param("cursorAt", utc(after.at()))
              .param("cursorId", after.id());
    }
    return statement.query(MockExamRepository::mapSession).list();
  }

  List<SnapshotQuestion> snapshot(UUID sessionId) {
    return jdbc.sql(
            "select position, topic_id, revision_id from certforge.mock_exam_question"
                + " where session_id = :session order by position")
        .param(SESSION, sessionId)
        .query(MockExamRepository::mapSnapshot)
        .list();
  }

  Optional<SnapshotQuestion> snapshotAt(UUID sessionId, int position) {
    return jdbc.sql(
            "select position, topic_id, revision_id from certforge.mock_exam_question"
                + " where session_id = :session and position = :position")
        .param(SESSION, sessionId)
        .param(POSITION, position)
        .query(MockExamRepository::mapSnapshot)
        .optional();
  }

  int answeredCount(UUID sessionId) {
    Integer count =
        jdbc.sql("select count(*) from certforge.mock_exam_response where session_id = :session")
            .param(SESSION, sessionId)
            .query(Integer.class)
            .single();
    return count;
  }

  List<Integer> answeredPositions(UUID sessionId) {
    return jdbc.sql(
            "select position from certforge.mock_exam_response"
                + " where session_id = :session order by position")
        .param(SESSION, sessionId)
        .query(Integer.class)
        .list();
  }

  List<MockExamResponse> responses(UUID sessionId) {
    return jdbc.sql(SELECT_RESPONSE + " where session_id = :session order by position")
        .param(SESSION, sessionId)
        .query(MockExamRepository::mapResponse)
        .list();
  }

  Optional<MockExamResponse> findResponse(UUID sessionId, int position) {
    return jdbc.sql(SELECT_RESPONSE + " where session_id = :session and position = :position")
        .param(SESSION, sessionId)
        .param(POSITION, position)
        .query(MockExamRepository::mapResponse)
        .optional();
  }

  Optional<MockExamResponse> findResponseByKey(UUID learnerId, String key) {
    return jdbc.sql(SELECT_RESPONSE + " where learner_id = :learner and idempotency_key = :key")
        .param(LEARNER, learnerId)
        .param("key", key)
        .query(MockExamRepository::mapResponse)
        .optional();
  }

  void insertResponse(MockExamResponse response) {
    jdbc.sql(
            "insert into certforge.mock_exam_response"
                + " (id, session_id, position, learner_id, revision_id, selected_options,"
                + " submitted_at, idempotency_key, request_fingerprint)"
                + " values (:id, :session, :position, :learner, :revision, :selected,"
                + " :submitted, :key, :fingerprint)")
        .param(ID, response.id())
        .param(SESSION, response.sessionId())
        .param(POSITION, response.position())
        .param(LEARNER, response.learnerId())
        .param("revision", response.revisionId())
        .param("selected", String.join(",", response.selectedOptions()))
        .param("submitted", utc(response.submittedAt()))
        .param("key", response.idempotencyKey())
        .param("fingerprint", response.fingerprint())
        .update();
  }

  /**
   * Closes an in-progress mock exactly once. Competing response inserts hold a share row lock, so a
   * close waits for evidence already being written instead of racing past it.
   */
  boolean close(UUID id, MockExamStatus to, Instant now) {
    if (to == MockExamStatus.IN_PROGRESS) {
      throw new IllegalArgumentException("Mock exam can only close to a terminal status");
    }
    return jdbc.sql(
                "update certforge.mock_exam_session set status = :status, closed_at = :now"
                    + " where id = :id and status = 'IN_PROGRESS'")
            .param(STATUS, to.name())
            .param("now", utc(now))
            .param(ID, id)
            .update()
        > 0;
  }

  int expireDue(UUID learnerId, Instant now) {
    return jdbc.sql(
            "update certforge.mock_exam_session set status = 'EXPIRED', closed_at = :now"
                + " where learner_id = :learner and status = 'IN_PROGRESS'"
                + " and expires_at <= :now")
        .param("now", utc(now))
        .param(LEARNER, learnerId)
        .update();
  }

  private static MockExamSession mapSession(ResultSet rs, int rowNum) throws SQLException {
    OffsetDateTime closed = rs.getObject("closed_at", OffsetDateTime.class);
    return new MockExamSession(
        rs.getObject(ID, UUID.class),
        rs.getObject("learner_id", UUID.class),
        rs.getObject("track_id", UUID.class),
        rs.getObject("exam_version_id", UUID.class),
        MockExamStatus.valueOf(rs.getString(STATUS)),
        rs.getInt("question_count"),
        rs.getLong("time_limit_seconds"),
        rs.getInt("passing_percentage"),
        rs.getInt("questions_per_topic"),
        rs.getObject("created_at", OffsetDateTime.class).toInstant(),
        rs.getObject("expires_at", OffsetDateTime.class).toInstant(),
        closed == null ? null : closed.toInstant());
  }

  private static SnapshotQuestion mapSnapshot(ResultSet rs, int rowNum) throws SQLException {
    return new SnapshotQuestion(
        rs.getInt(POSITION),
        rs.getObject("topic_id", UUID.class),
        rs.getObject("revision_id", UUID.class));
  }

  private static MockExamResponse mapResponse(ResultSet rs, int rowNum) throws SQLException {
    String encoded = rs.getString("selected_options");
    List<String> selected = encoded.isEmpty() ? List.of() : Arrays.asList(encoded.split(","));
    return new MockExamResponse(
        rs.getObject(ID, UUID.class),
        rs.getObject("session_id", UUID.class),
        rs.getInt(POSITION),
        rs.getObject("learner_id", UUID.class),
        rs.getObject("revision_id", UUID.class),
        selected,
        rs.getObject("submitted_at", OffsetDateTime.class).toInstant(),
        rs.getString("idempotency_key"),
        rs.getString("request_fingerprint").strip());
  }

  private static OffsetDateTime utc(Instant instant) {
    return OffsetDateTime.ofInstant(instant, ZoneOffset.UTC);
  }
}
