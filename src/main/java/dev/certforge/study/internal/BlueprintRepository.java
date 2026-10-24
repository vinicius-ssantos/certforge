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

/** Persistence for job-description blueprints, their requirements, weights and matches. */
@Repository
class BlueprintRepository {

  private static final String ID = "id";
  private static final String LEARNER = "learner";
  private static final String BLUEPRINT = "blueprint";
  private static final String TOPIC = "topic";
  private static final String POSITION = "position";

  private final JdbcClient jdbc;

  BlueprintRepository(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  void insert(BlueprintRow blueprint, List<RequirementRow> requirements, List<TopicRow> topics) {
    jdbc.sql(
            "insert into certforge.interview_blueprint"
                + " (id, learner_id, track_version_id, job_title, source_text, created_at)"
                + " values (:id, :learner, :version, :title, :text, :created)")
        .param(ID, blueprint.id())
        .param(LEARNER, blueprint.learnerId())
        .param("version", blueprint.trackVersionId())
        .param("title", blueprint.jobTitle())
        .param("text", blueprint.sourceText())
        .param("created", utc(blueprint.createdAt()))
        .update();
    for (int position = 0; position < requirements.size(); position++) {
      RequirementRow requirement = requirements.get(position);
      jdbc.sql(
              "insert into certforge.interview_blueprint_requirement"
                  + " (blueprint_id, position, text, matched)"
                  + " values (:blueprint, :position, :text, :matched)")
          .param(BLUEPRINT, blueprint.id())
          .param(POSITION, position)
          .param("text", requirement.text())
          .param("matched", requirement.matched())
          .update();
    }
    for (TopicRow topic : topics) {
      jdbc.sql(
              "insert into certforge.interview_blueprint_topic"
                  + " (blueprint_id, topic_id, weight, source)"
                  + " values (:blueprint, :topic, :weight, :source)")
          .param(BLUEPRINT, blueprint.id())
          .param(TOPIC, topic.topicId())
          .param("weight", topic.weight())
          .param("source", topic.source())
          .update();
      for (MatchRow match : topic.matches()) {
        jdbc.sql(
                "insert into certforge.interview_blueprint_match"
                    + " (blueprint_id, topic_id, term, found_in)"
                    + " values (:blueprint, :topic, :term, :foundIn)")
            .param(BLUEPRINT, blueprint.id())
            .param(TOPIC, topic.topicId())
            .param("term", match.term())
            .param("foundIn", match.foundIn())
            .update();
      }
    }
  }

  Optional<BlueprintRow> find(UUID id) {
    return jdbc.sql(
            "select id, learner_id, track_version_id, job_title, source_text, created_at"
                + " from certforge.interview_blueprint where id = :id")
        .param(ID, id)
        .query(BlueprintRepository::map)
        .optional();
  }

  List<BlueprintRow> findByLearner(UUID learnerId) {
    return jdbc.sql(
            "select id, learner_id, track_version_id, job_title, source_text, created_at"
                + " from certforge.interview_blueprint where learner_id = :learner"
                + " order by created_at desc, id")
        .param(LEARNER, learnerId)
        .query(BlueprintRepository::map)
        .list();
  }

  List<RequirementRow> requirements(UUID blueprintId) {
    return jdbc.sql(
            "select text, matched from certforge.interview_blueprint_requirement"
                + " where blueprint_id = :blueprint order by position")
        .param(BLUEPRINT, blueprintId)
        .query((rs, n) -> new RequirementRow(rs.getString("text"), rs.getBoolean("matched")))
        .list();
  }

  /** The weights of one blueprint, each with the terms that produced it, in topic order. */
  List<TopicRow> topics(UUID blueprintId) {
    List<TopicRow> topics =
        jdbc.sql(
                "select topic_id, weight, source from certforge.interview_blueprint_topic"
                    + " where blueprint_id = :blueprint order by weight desc, topic_id")
            .param(BLUEPRINT, blueprintId)
            .query(
                (rs, n) ->
                    new TopicRow(
                        rs.getObject("topic_id", UUID.class),
                        rs.getInt("weight"),
                        rs.getString("source"),
                        List.of()))
            .list();
    return topics.stream()
        .map(
            topic ->
                new TopicRow(
                    topic.topicId(),
                    topic.weight(),
                    topic.source(),
                    matches(blueprintId, topic.topicId())))
        .toList();
  }

  private List<MatchRow> matches(UUID blueprintId, UUID topicId) {
    return jdbc.sql(
            "select term, found_in from certforge.interview_blueprint_match"
                + " where blueprint_id = :blueprint and topic_id = :topic"
                + " order by term, found_in")
        .param(BLUEPRINT, blueprintId)
        .param(TOPIC, topicId)
        .query((rs, n) -> new MatchRow(rs.getString("term"), rs.getString("found_in")))
        .list();
  }

  private static BlueprintRow map(ResultSet rs, int rowNum) throws SQLException {
    return new BlueprintRow(
        rs.getObject("id", UUID.class),
        rs.getObject("learner_id", UUID.class),
        rs.getObject("track_version_id", UUID.class),
        rs.getString("job_title"),
        rs.getString("source_text"),
        rs.getObject("created_at", OffsetDateTime.class).toInstant());
  }

  private static OffsetDateTime utc(Instant instant) {
    return OffsetDateTime.ofInstant(instant, ZoneOffset.UTC);
  }

  record BlueprintRow(
      UUID id,
      UUID learnerId,
      UUID trackVersionId,
      String jobTitle,
      String sourceText,
      Instant createdAt) {}

  record RequirementRow(String text, boolean matched) {}

  record TopicRow(UUID topicId, int weight, String source, List<MatchRow> matches) {}

  record MatchRow(String term, String foundIn) {}
}
