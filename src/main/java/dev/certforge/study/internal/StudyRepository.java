package dev.certforge.study.internal;

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

@Repository
class StudyRepository {

  private static final String ID = "id";
  private static final String LEARNER = "learner";
  private static final String STATUS = "status";
  private static final String NOW = "now";
  private static final String SELECT_SESSION =
      "select id, learner_id, topic_id, exam_version_id, status, requested_count, created_at,"
          + " expires_at, closed_at from certforge.study_session";

  private final JdbcClient jdbc;

  StudyRepository(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  /** Inserts a session and its snapshot. Fails with a duplicate key if one is already active. */
  void insert(StudySession session, List<UUID> revisionIds) {
    jdbc.sql(
            "insert into certforge.study_session (id, learner_id, topic_id, exam_version_id,"
                + " requested_count, created_at, expires_at)"
                + " values (:id, :learner, :topic, :exam, :count, :created, :expires)")
        .param(ID, session.id())
        .param(LEARNER, session.learnerId())
        .param("topic", session.topicId())
        .param("exam", session.examVersionId())
        .param("count", session.requestedCount())
        .param("created", utc(session.createdAt()))
        .param("expires", utc(session.expiresAt()))
        .update();
    for (int position = 0; position < revisionIds.size(); position++) {
      jdbc.sql(
              "insert into certforge.study_session_question (session_id, position, revision_id)"
                  + " values (:session, :position, :revision)")
          .param("session", session.id())
          .param("position", position)
          .param("revision", revisionIds.get(position))
          .update();
    }
  }

  Optional<StudySession> find(UUID id) {
    return jdbc.sql(SELECT_SESSION + " where id = :id")
        .param(ID, id)
        .query(StudyRepository::map)
        .optional();
  }

  Optional<StudySession> findActive(UUID learnerId, UUID topicId) {
    return jdbc.sql(
            SELECT_SESSION
                + " where learner_id = :learner and topic_id = :topic and status = 'IN_PROGRESS'")
        .param(LEARNER, learnerId)
        .param("topic", topicId)
        .query(StudyRepository::map)
        .optional();
  }

  List<StudySession> findByLearner(UUID learnerId, SessionStatus status) {
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
    return statement.query(StudyRepository::map).list();
  }

  /** The snapshot revision ids of a session, in session order. */
  List<UUID> revisionIds(UUID sessionId) {
    return jdbc.sql(
            "select revision_id from certforge.study_session_question"
                + " where session_id = :session order by position")
        .param("session", sessionId)
        .query(UUID.class)
        .list();
  }

  int questionCount(UUID sessionId) {
    Integer count =
        jdbc.sql("select count(*) from certforge.study_session_question where session_id = :id")
            .param(ID, sessionId)
            .query(Integer.class)
            .single();
    return count;
  }

  /**
   * Moves an IN_PROGRESS session to a terminal status. Returns false when the session was no longer
   * in progress, which makes concurrent transitions safe: exactly one of them wins.
   */
  boolean close(UUID id, SessionStatus to, Instant now) {
    return jdbc.sql(
                "update certforge.study_session set status = :status, closed_at = :now"
                    + " where id = :id and status = 'IN_PROGRESS'")
            .param(STATUS, to.name())
            .param(NOW, utc(now))
            .param(ID, id)
            .update()
        > 0;
  }

  /** Expires every in-progress session of the learner whose time is up. */
  int expireDue(UUID learnerId, Instant now) {
    return jdbc.sql(
            "update certforge.study_session set status = 'EXPIRED', closed_at = :now"
                + " where learner_id = :learner and status = 'IN_PROGRESS'"
                + " and expires_at <= :now")
        .param(NOW, utc(now))
        .param(LEARNER, learnerId)
        .update();
  }

  private static StudySession map(ResultSet rs, int rowNum) throws SQLException {
    OffsetDateTime closed = rs.getObject("closed_at", OffsetDateTime.class);
    return new StudySession(
        rs.getObject("id", UUID.class),
        rs.getObject("learner_id", UUID.class),
        rs.getObject("topic_id", UUID.class),
        rs.getObject("exam_version_id", UUID.class),
        SessionStatus.valueOf(rs.getString(STATUS)),
        rs.getInt("requested_count"),
        rs.getObject("created_at", OffsetDateTime.class).toInstant(),
        rs.getObject("expires_at", OffsetDateTime.class).toInstant(),
        closed == null ? null : closed.toInstant());
  }

  private static OffsetDateTime utc(Instant instant) {
    return OffsetDateTime.ofInstant(instant, ZoneOffset.UTC);
  }
}
