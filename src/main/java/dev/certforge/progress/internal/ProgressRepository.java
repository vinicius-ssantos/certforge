package dev.certforge.progress.internal;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
class ProgressRepository {

  private static final String LEARNER = "learner";
  private static final String TOPIC = "topic";

  /** What the projection holds for one learner and topic. */
  record Counts(int attempted, int correct, Instant lastActivityAt) {}

  private final JdbcClient jdbc;

  ProgressRepository(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  /**
   * Serializes everything that changes one learner's projection (recording an attempt, rebuilding)
   * for the rest of the current transaction.
   */
  void lock(UUID learnerId) {
    jdbc.sql("select 1 from (select pg_advisory_xact_lock(hashtextextended(:key, 0))) locked")
        .param("key", learnerId.toString())
        .query(Integer.class)
        .single();
  }

  /** Counts one more accepted attempt. */
  void add(UUID learnerId, UUID topicId, boolean correct, Instant at) {
    jdbc.sql(
            "insert into certforge.progress_topic"
                + " (learner_id, topic_id, attempted, correct, last_activity_at)"
                + " values (:learner, :topic, 1, :correct, :at)"
                + " on conflict (learner_id, topic_id) do update set"
                + " attempted = certforge.progress_topic.attempted + 1,"
                + " correct = certforge.progress_topic.correct + excluded.correct,"
                + " last_activity_at = greatest(certforge.progress_topic.last_activity_at,"
                + " excluded.last_activity_at)")
        .param(LEARNER, learnerId)
        .param(TOPIC, topicId)
        .param("correct", correct ? 1 : 0)
        .param("at", utc(at))
        .update();
  }

  Map<UUID, Counts> find(UUID learnerId) {
    Map<UUID, Counts> result = new HashMap<>();
    jdbc.sql(
            "select topic_id, attempted, correct, last_activity_at"
                + " from certforge.progress_topic where learner_id = :learner")
        .param(LEARNER, learnerId)
        .query(
            (rs, n) -> {
              result.put(
                  rs.getObject("topic_id", UUID.class),
                  new Counts(
                      rs.getInt("attempted"),
                      rs.getInt("correct"),
                      rs.getObject("last_activity_at", OffsetDateTime.class).toInstant()));
              return null;
            })
        .list();
    return result;
  }

  void deleteAll(UUID learnerId) {
    jdbc.sql("delete from certforge.progress_topic where learner_id = :learner")
        .param(LEARNER, learnerId)
        .update();
  }

  void insert(UUID learnerId, UUID topicId, Counts counts) {
    jdbc.sql(
            "insert into certforge.progress_topic"
                + " (learner_id, topic_id, attempted, correct, last_activity_at)"
                + " values (:learner, :topic, :attempted, :correct, :at)")
        .param(LEARNER, learnerId)
        .param(TOPIC, topicId)
        .param("attempted", counts.attempted())
        .param("correct", counts.correct())
        .param("at", utc(counts.lastActivityAt()))
        .update();
  }

  /** Learners that have projection rows, including ones whose attempts no longer exist. */
  List<UUID> learnersWithRows() {
    return jdbc.sql("select distinct learner_id from certforge.progress_topic")
        .query(UUID.class)
        .list();
  }

  private static OffsetDateTime utc(Instant instant) {
    return OffsetDateTime.ofInstant(instant, ZoneOffset.UTC);
  }
}
