package dev.certforge.study.internal;

import dev.certforge.study.Confidence;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Persistence for interview sessions, their snapshot and the responses recorded against them. */
@Repository
class InterviewRepository {

  private static final String ID = "id";
  private static final String LEARNER = "learner";
  private static final String SESSION = "session";
  private static final String STATUS = "status";
  private static final String NOW = "now";
  private static final String POSITION = "position";
  private static final String SELECT_SESSION =
      "select id, learner_id, track_version_id, status, requested_count, created_at, expires_at,"
          + " closed_at from certforge.interview_session";

  private final JdbcClient jdbc;

  InterviewRepository(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  /** Inserts a session and its snapshot. Fails with a duplicate key if one is already active. */
  void insert(InterviewSession session, List<SnapshotItem> items) {
    jdbc.sql(
            "insert into certforge.interview_session (id, learner_id, track_version_id,"
                + " requested_count, created_at, expires_at)"
                + " values (:id, :learner, :version, :count, :created, :expires)")
        .param(ID, session.id())
        .param(LEARNER, session.learnerId())
        .param("version", session.trackVersionId())
        .param("count", session.requestedCount())
        .param("created", utc(session.createdAt()))
        .param("expires", utc(session.expiresAt()))
        .update();
    for (int position = 0; position < items.size(); position++) {
      SnapshotItem item = items.get(position);
      jdbc.sql(
              "insert into certforge.interview_session_question"
                  + " (session_id, position, revision_id, topic_id)"
                  + " values (:session, :position, :revision, :topic)")
          .param(SESSION, session.id())
          .param(POSITION, position)
          .param("revision", item.revisionId())
          .param("topic", item.topicId())
          .update();
    }
  }

  Optional<InterviewSession> find(UUID id) {
    return jdbc.sql(SELECT_SESSION + " where id = :id")
        .param(ID, id)
        .query(InterviewRepository::map)
        .optional();
  }

  Optional<InterviewSession> findActive(UUID learnerId, UUID trackVersionId) {
    return jdbc.sql(
            SELECT_SESSION
                + " where learner_id = :learner and track_version_id = :version"
                + " and status = 'IN_PROGRESS'")
        .param(LEARNER, learnerId)
        .param("version", trackVersionId)
        .query(InterviewRepository::map)
        .optional();
  }

  List<InterviewSession> findByLearner(UUID learnerId, SessionStatus status) {
    String filter = status == null ? "" : " and status = :status";
    var statement =
        jdbc.sql(
                SELECT_SESSION
                    + " where learner_id = :learner"
                    + filter
                    + " order by created_at desc, id")
            .param(LEARNER, learnerId);
    if (status != null) {
      statement = statement.param(STATUS, status.name());
    }
    return statement.query(InterviewRepository::map).list();
  }

  /** The snapshot of a session, in session order. */
  List<SnapshotItem> snapshot(UUID sessionId) {
    return jdbc.sql(
            "select position, revision_id, topic_id from certforge.interview_session_question"
                + " where session_id = :session order by position")
        .param(SESSION, sessionId)
        .query(
            (rs, n) ->
                new SnapshotItem(
                    rs.getInt(POSITION),
                    rs.getObject("revision_id", UUID.class),
                    rs.getObject("topic_id", UUID.class)))
        .list();
  }

  /** The revision at one position, or empty when the session has no such position. */
  Optional<SnapshotItem> itemAt(UUID sessionId, int position) {
    return jdbc.sql(
            "select position, revision_id, topic_id from certforge.interview_session_question"
                + " where session_id = :session and position = :position")
        .param(SESSION, sessionId)
        .param(POSITION, position)
        .query(
            (rs, n) ->
                new SnapshotItem(
                    rs.getInt(POSITION),
                    rs.getObject("revision_id", UUID.class),
                    rs.getObject("topic_id", UUID.class)))
        .optional();
  }

  void insertResponse(InterviewResponse response) {
    jdbc.sql(
            "insert into certforge.interview_response (id, session_id, position, learner_id,"
                + " revision_id, item_kind, selected_options, correct, confidence, elapsed_ms,"
                + " submitted_at, idempotency_key, request_fingerprint)"
                + " values (:id, :session, :position, :learner, :revision, :kind, :selected,"
                + " :correct, :confidence, :elapsed, :submitted, :key, :fingerprint)")
        .param(ID, response.id())
        .param(SESSION, response.sessionId())
        .param(POSITION, response.position())
        .param(LEARNER, response.learnerId())
        .param("revision", response.revisionId())
        .param("kind", response.itemKind().name())
        .param("selected", response.selectedOptions())
        .param("correct", response.correct())
        .param("confidence", response.confidence().name())
        .param("elapsed", response.elapsedMillis())
        .param("submitted", utc(response.submittedAt()))
        .param("key", response.idempotencyKey())
        .param("fingerprint", response.fingerprint())
        .update();
  }

  Optional<InterviewResponse> findByKey(UUID learnerId, String idempotencyKey) {
    return selectResponse(" where learner_id = :learner and idempotency_key = :key")
        .param(LEARNER, learnerId)
        .param("key", idempotencyKey)
        .query(InterviewRepository::mapResponse)
        .optional();
  }

  Optional<InterviewResponse> findAt(UUID sessionId, int position) {
    return selectResponse(" where session_id = :session and position = :position")
        .param(SESSION, sessionId)
        .param(POSITION, position)
        .query(InterviewRepository::mapResponse)
        .optional();
  }

  List<Integer> answeredPositions(UUID sessionId) {
    return jdbc.sql(
            "select position from certforge.interview_response where session_id = :session"
                + " order by position")
        .param(SESSION, sessionId)
        .query(Integer.class)
        .list();
  }

  /**
   * Moves an IN_PROGRESS session to a terminal status. False when it was no longer in progress,
   * which makes concurrent transitions safe: exactly one wins.
   */
  boolean close(UUID id, SessionStatus to, Instant now) {
    return jdbc.sql(
                "update certforge.interview_session set status = :status, closed_at = :now"
                    + " where id = :id and status = 'IN_PROGRESS'")
            .param(STATUS, to.name())
            .param(NOW, utc(now))
            .param(ID, id)
            .update()
        > 0;
  }

  /** Expires every in-progress interview session of the learner whose time is up. */
  int expireDue(UUID learnerId, Instant now) {
    return jdbc.sql(
            "update certforge.interview_session set status = 'EXPIRED', closed_at = :now"
                + " where learner_id = :learner and status = 'IN_PROGRESS' and expires_at <= :now")
        .param(NOW, utc(now))
        .param(LEARNER, learnerId)
        .update();
  }

  private JdbcClient.StatementSpec selectResponse(String where) {
    return jdbc.sql(
        "select id, session_id, position, learner_id, revision_id, item_kind, selected_options,"
            + " correct, confidence, elapsed_ms, submitted_at, idempotency_key, request_fingerprint"
            + " from certforge.interview_response"
            + where);
  }

  private static InterviewSession map(ResultSet rs, int rowNum) throws SQLException {
    OffsetDateTime closed = rs.getObject("closed_at", OffsetDateTime.class);
    return new InterviewSession(
        rs.getObject("id", UUID.class),
        rs.getObject("learner_id", UUID.class),
        rs.getObject("track_version_id", UUID.class),
        SessionStatus.valueOf(rs.getString(STATUS)),
        rs.getInt("requested_count"),
        rs.getObject("created_at", OffsetDateTime.class).toInstant(),
        rs.getObject("expires_at", OffsetDateTime.class).toInstant(),
        closed == null ? null : closed.toInstant());
  }

  private static InterviewResponse mapResponse(ResultSet rs, int rowNum) throws SQLException {
    Boolean correct = rs.getObject("correct", Boolean.class);
    return new InterviewResponse(
        rs.getObject("id", UUID.class),
        rs.getObject("session_id", UUID.class),
        rs.getInt(POSITION),
        rs.getObject("learner_id", UUID.class),
        rs.getObject("revision_id", UUID.class),
        ItemKind.valueOf(rs.getString("item_kind")),
        rs.getString("selected_options"),
        correct,
        Confidence.valueOf(rs.getString("confidence")),
        rs.getLong("elapsed_ms"),
        rs.getObject("submitted_at", OffsetDateTime.class).toInstant(),
        rs.getString("idempotency_key"),
        rs.getString("request_fingerprint"));
  }

  private static OffsetDateTime utc(Instant instant) {
    return OffsetDateTime.ofInstant(instant, ZoneOffset.UTC);
  }

  /** One item of a session snapshot. */
  record SnapshotItem(int position, UUID revisionId, UUID topicId) {}
}
