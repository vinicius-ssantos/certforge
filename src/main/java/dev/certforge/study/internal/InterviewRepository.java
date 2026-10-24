package dev.certforge.study.internal;

import dev.certforge.study.Confidence;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
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
  private static final String VERSION = "version";
  private static final String REVISION_ID = "revision_id";
  private static final String ITEM_KIND = "item_kind";
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
        .param(VERSION, session.trackVersionId())
        .param("count", session.requestedCount())
        .param("created", utc(session.createdAt()))
        .param("expires", utc(session.expiresAt()))
        .update();
    for (int position = 0; position < items.size(); position++) {
      SnapshotItem item = items.get(position);
      jdbc.sql(
              "insert into certforge.interview_session_question"
                  + " (session_id, position, revision_id, topic_id, item_kind)"
                  + " values (:session, :position, :revision, :topic, :kind)")
          .param(SESSION, session.id())
          .param(POSITION, position)
          .param("revision", item.revisionId())
          .param("topic", item.topicId())
          .param("kind", item.itemKind().name())
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
        .param(VERSION, trackVersionId)
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
            "select position, revision_id, topic_id, item_kind"
                + " from certforge.interview_session_question"
                + " where session_id = :session order by position")
        .param(SESSION, sessionId)
        .query(
            (rs, n) ->
                new SnapshotItem(
                    rs.getInt(POSITION),
                    rs.getObject(REVISION_ID, UUID.class),
                    rs.getObject("topic_id", UUID.class),
                    ItemKind.valueOf(rs.getString(ITEM_KIND))))
        .list();
  }

  /** The revision at one position, or empty when the session has no such position. */
  Optional<SnapshotItem> itemAt(UUID sessionId, int position) {
    return jdbc.sql(
            "select position, revision_id, topic_id, item_kind"
                + " from certforge.interview_session_question"
                + " where session_id = :session and position = :position")
        .param(SESSION, sessionId)
        .param(POSITION, position)
        .query(
            (rs, n) ->
                new SnapshotItem(
                    rs.getInt(POSITION),
                    rs.getObject(REVISION_ID, UUID.class),
                    rs.getObject("topic_id", UUID.class),
                    ItemKind.valueOf(rs.getString(ITEM_KIND))))
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

  /** The learner's own marks about one response. */
  void insertConceptMarks(UUID responseId, Map<Integer, Boolean> marks) {
    for (Map.Entry<Integer, Boolean> mark : marks.entrySet()) {
      jdbc.sql(
              "insert into certforge.interview_response_concept"
                  + " (response_id, concept_position, covered)"
                  + " values (:response, :position, :covered)")
          .param("response", responseId)
          .param(POSITION, mark.getKey())
          .param("covered", mark.getValue())
          .update();
    }
  }

  /** Whether this response already carries the learner's marks, which are written once. */
  boolean hasConceptMarks(UUID responseId) {
    return Boolean.TRUE.equals(
        jdbc.sql(
                "select exists (select 1 from certforge.interview_response_concept"
                    + " where response_id = :response)")
            .param("response", responseId)
            .query(Boolean.class)
            .single());
  }

  /**
   * Every response of one learner on one track version, with its topic, for building the evidence
   * read model.
   *
   * <p>Read rather than stored: #23 requires that rebuilding a projection gives the same answer,
   * and the only way to be sure of that is to have nothing to rebuild from but the evidence itself.
   */
  List<EvidenceRow> evidenceOf(UUID learnerId, UUID trackVersionId) {
    return jdbc.sql(
            "select r.id, r.revision_id, r.item_kind, r.correct, r.confidence, r.submitted_at,"
                + " q.topic_id from certforge.interview_response r"
                + " join certforge.interview_session s on s.id = r.session_id"
                + " join certforge.interview_session_question q"
                + "   on q.session_id = r.session_id and q.position = r.position"
                + " where r.learner_id = :learner and s.track_version_id = :version"
                + " order by r.submitted_at, r.id")
        .param(LEARNER, learnerId)
        .param(VERSION, trackVersionId)
        .query(
            (rs, n) ->
                new EvidenceRow(
                    rs.getObject("id", UUID.class),
                    rs.getObject(REVISION_ID, UUID.class),
                    rs.getObject("topic_id", UUID.class),
                    ItemKind.valueOf(rs.getString(ITEM_KIND)),
                    rs.getObject("correct", Boolean.class),
                    Confidence.valueOf(rs.getString("confidence")),
                    rs.getObject("submitted_at", OffsetDateTime.class).toInstant()))
        .list();
  }

  /** The concepts a learner marked as not covered, for the responses of one track version. */
  List<ConceptMarkRow> conceptsMarkedMissed(UUID learnerId, UUID trackVersionId) {
    return jdbc.sql(
            "select c.response_id, c.concept_position, r.revision_id"
                + " from certforge.interview_response_concept c"
                + " join certforge.interview_response r on r.id = c.response_id"
                + " join certforge.interview_session s on s.id = r.session_id"
                + " where c.covered = false and r.learner_id = :learner"
                + " and s.track_version_id = :version"
                + " order by r.revision_id, c.concept_position, c.response_id")
        .param(LEARNER, learnerId)
        .param(VERSION, trackVersionId)
        .query(
            (rs, n) ->
                new ConceptMarkRow(
                    rs.getObject("response_id", UUID.class),
                    rs.getObject(REVISION_ID, UUID.class),
                    rs.getInt("concept_position")))
        .list();
  }

  /** One answered item, as the evidence read model sees it. */
  record EvidenceRow(
      UUID responseId,
      UUID revisionId,
      UUID topicId,
      ItemKind itemKind,
      Boolean correct,
      Confidence confidence,
      Instant submittedAt) {}

  /** One concept a learner said their answer did not cover. */
  record ConceptMarkRow(UUID responseId, UUID revisionId, int conceptPosition) {}

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
        rs.getObject(REVISION_ID, UUID.class),
        ItemKind.valueOf(rs.getString(ITEM_KIND)),
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

  /**
   * One item of a session snapshot, including what kind of item it was when the session started:
   * answering it later reads the kind from here rather than from the question, so a session stays
   * reproducible from its own evidence.
   */
  record SnapshotItem(int position, UUID revisionId, UUID topicId, ItemKind itemKind) {}
}
