package dev.certforge.study.internal;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
class AttemptRepository {

  private static final String SESSION = "session";
  private static final String POSITION = "position";
  private static final String SELECT_ATTEMPT =
      "select id, session_id, position, learner_id, revision_id, selected_options, correct,"
          + " confidence, elapsed_ms, submitted_at, idempotency_key, request_fingerprint"
          + " from certforge.study_attempt";

  private final JdbcClient jdbc;

  AttemptRepository(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  Optional<Attempt> findByKey(UUID learnerId, String key) {
    return jdbc.sql(SELECT_ATTEMPT + " where learner_id = :learner and idempotency_key = :key")
        .param("learner", learnerId)
        .param("key", key)
        .query(AttemptRepository::map)
        .optional();
  }

  Optional<Attempt> findByQuestion(UUID sessionId, int position) {
    return jdbc.sql(SELECT_ATTEMPT + " where session_id = :session and position = :position")
        .param(SESSION, sessionId)
        .param(POSITION, position)
        .query(AttemptRepository::map)
        .optional();
  }

  /** The revision at a position of a session's snapshot. */
  Optional<UUID> revisionAt(UUID sessionId, int position) {
    return jdbc.sql(
            "select revision_id from certforge.study_session_question"
                + " where session_id = :session and position = :position")
        .param(SESSION, sessionId)
        .param(POSITION, position)
        .query(UUID.class)
        .optional();
  }

  List<Integer> answeredPositions(UUID sessionId) {
    return jdbc.sql(
            "select position from certforge.study_attempt"
                + " where session_id = :session order by position")
        .param(SESSION, sessionId)
        .query(Integer.class)
        .list();
  }

  /** Inserts an attempt. A unique violation means a concurrent request won the same slot or key. */
  void insert(Attempt attempt) {
    jdbc.sql(
            "insert into certforge.study_attempt (id, session_id, position, learner_id,"
                + " revision_id, selected_options, correct, confidence, elapsed_ms, submitted_at,"
                + " idempotency_key, request_fingerprint)"
                + " values (:id, :session, :position, :learner, :revision, :selected, :correct,"
                + " :confidence, :elapsed, :submitted, :key, :fingerprint)")
        .param("id", attempt.id())
        .param(SESSION, attempt.sessionId())
        .param(POSITION, attempt.position())
        .param("learner", attempt.learnerId())
        .param("revision", attempt.revisionId())
        .param("selected", String.join(",", attempt.selectedOptions()))
        .param("correct", attempt.correct())
        .param("confidence", attempt.confidence().name())
        .param("elapsed", attempt.elapsedMillis())
        .param("submitted", OffsetDateTime.ofInstant(attempt.submittedAt(), ZoneOffset.UTC))
        .param("key", attempt.idempotencyKey())
        .param("fingerprint", attempt.fingerprint())
        .update();
  }

  private static Attempt map(ResultSet rs, int rowNum) throws SQLException {
    return new Attempt(
        rs.getObject("id", UUID.class),
        rs.getObject("session_id", UUID.class),
        rs.getInt(POSITION),
        rs.getObject("learner_id", UUID.class),
        rs.getObject("revision_id", UUID.class),
        Arrays.asList(rs.getString("selected_options").split(",")),
        rs.getBoolean("correct"),
        Confidence.valueOf(rs.getString("confidence")),
        rs.getLong("elapsed_ms"),
        rs.getObject("submitted_at", OffsetDateTime.class).toInstant(),
        rs.getString("idempotency_key"),
        rs.getString("request_fingerprint").strip());
  }
}
