package dev.certforge.study.internal;

import dev.certforge.identity.ActorId;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.study.AttemptFact;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/** Read-only queries over sessions and attempts, always scoped to one learner. */
@Repository
class HistoryRepository {

  private static final String LEARNER = "learner";
  private static final String CURSOR_AT = "cursorAt";
  private static final String CURSOR_ID = "cursorId";
  private static final String LIMIT = "limit";

  record SessionRow(
      UUID id,
      UUID topicId,
      String status,
      int requestedCount,
      int answeredCount,
      int correctCount,
      java.time.Instant createdAt,
      java.time.Instant closedAt) {}

  record AttemptRow(
      UUID id,
      UUID sessionId,
      int position,
      UUID topicId,
      UUID revisionId,
      List<String> selectedOptions,
      boolean correct,
      String confidence,
      long elapsedMillis,
      java.time.Instant submittedAt) {}

  private final JdbcClient jdbc;

  HistoryRepository(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  /** Sessions newest first, strictly after the cursor, at most {@code limit} rows. */
  List<SessionRow> sessions(UUID learnerId, Cursor after, int limit) {
    String paging = after == null ? "" : " and (s.created_at, s.id) < (:cursorAt, :cursorId)";
    var statement =
        jdbc.sql(
                "select s.id, s.topic_id, s.status, s.requested_count, s.created_at, s.closed_at,"
                    + " (select count(*) from certforge.study_attempt a where a.session_id = s.id)"
                    + " as answered,"
                    + " (select count(*) from certforge.study_attempt a"
                    + " where a.session_id = s.id and a.correct) as correct"
                    + " from certforge.study_session s where s.learner_id = :learner"
                    + paging
                    + " order by s.created_at desc, s.id desc limit :limit")
            .param(LEARNER, learnerId)
            .param(LIMIT, limit);
    if (after != null) {
      statement = statement.param(CURSOR_AT, utc(after)).param(CURSOR_ID, after.id());
    }
    return statement
        .query(
            (rs, n) ->
                new SessionRow(
                    rs.getObject("id", UUID.class),
                    rs.getObject("topic_id", UUID.class),
                    rs.getString("status"),
                    rs.getInt("requested_count"),
                    rs.getInt("answered"),
                    rs.getInt("correct"),
                    rs.getObject("created_at", OffsetDateTime.class).toInstant(),
                    instant(rs, "closed_at")))
        .list();
  }

  /** Attempts newest first, optionally narrowed to a topic and/or a session. */
  List<AttemptRow> attempts(UUID learnerId, UUID topicId, UUID sessionId, Cursor after, int limit) {
    StringBuilder where = new StringBuilder(" where a.learner_id = :learner");
    if (topicId != null) {
      where.append(" and s.topic_id = :topic");
    }
    if (sessionId != null) {
      where.append(" and a.session_id = :session");
    }
    if (after != null) {
      where.append(" and (a.submitted_at, a.id) < (:cursorAt, :cursorId)");
    }
    var statement =
        jdbc.sql(
                "select a.id, a.session_id, a.position, s.topic_id, a.revision_id,"
                    + " a.selected_options, a.correct, a.confidence, a.elapsed_ms, a.submitted_at"
                    + " from certforge.study_attempt a"
                    + " join certforge.study_session s on s.id = a.session_id"
                    + where
                    + " order by a.submitted_at desc, a.id desc limit :limit")
            .param(LEARNER, learnerId)
            .param(LIMIT, limit);
    if (topicId != null) {
      statement = statement.param("topic", topicId);
    }
    if (sessionId != null) {
      statement = statement.param("session", sessionId);
    }
    if (after != null) {
      statement = statement.param(CURSOR_AT, utc(after)).param(CURSOR_ID, after.id());
    }
    return statement
        .query(
            (rs, n) ->
                new AttemptRow(
                    rs.getObject("id", UUID.class),
                    rs.getObject("session_id", UUID.class),
                    rs.getInt("position"),
                    rs.getObject("topic_id", UUID.class),
                    rs.getObject("revision_id", UUID.class),
                    Arrays.asList(rs.getString("selected_options").split(",")),
                    rs.getBoolean("correct"),
                    rs.getString("confidence"),
                    rs.getLong("elapsed_ms"),
                    rs.getObject("submitted_at", OffsetDateTime.class).toInstant()))
        .list();
  }

  /** Every accepted attempt of a learner, oldest first, for deriving data from the evidence. */
  List<AttemptFact> facts(UUID learnerId) {
    return jdbc.sql(
            "select a.id, a.session_id, s.topic_id, a.correct, a.submitted_at"
                + " from certforge.study_attempt a"
                + " join certforge.study_session s on s.id = a.session_id"
                + " where a.learner_id = :learner order by a.submitted_at, a.id")
        .param(LEARNER, learnerId)
        .query(
            (rs, n) ->
                new AttemptFact(
                    rs.getObject("id", UUID.class),
                    new ActorId(learnerId),
                    rs.getObject("session_id", UUID.class),
                    new TopicId(rs.getObject("topic_id", UUID.class)),
                    rs.getBoolean("correct"),
                    rs.getObject("submitted_at", OffsetDateTime.class).toInstant()))
        .list();
  }

  List<UUID> learnersWithAttempts() {
    return jdbc.sql("select distinct learner_id from certforge.study_attempt order by learner_id")
        .query(UUID.class)
        .list();
  }

  private static OffsetDateTime utc(Cursor cursor) {
    return OffsetDateTime.ofInstant(cursor.at(), ZoneOffset.UTC);
  }

  private static java.time.Instant instant(ResultSet rs, String column) throws SQLException {
    OffsetDateTime value = rs.getObject(column, OffsetDateTime.class);
    return value == null ? null : value.toInstant();
  }
}
