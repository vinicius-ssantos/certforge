package dev.certforge.questionbank.internal;

import dev.certforge.questionbank.Difficulty;
import dev.certforge.questionbank.QuestionType;
import dev.certforge.questionbank.RevisionStatus;
import dev.certforge.questionbank.Seniority;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
class QuestionRepository {

  private static final String ID = "id";
  private static final String PROMPT = "prompt";
  private static final String EXPLANATION = "explanation";
  private static final String POSITION = "position";
  private static final String TEXT = "text";
  private static final String NOW = "now";
  private static final String QUESTION_ID = "questionId";
  private static final String REVISION_ID = "revisionId";
  private static final String REVISION_IDS = "revisionIds";
  private static final String REVISION_ID_COLUMN = "revision_id";
  private static final String STATUS = "status";
  private static final String REVISION_CHILDREN_ORDER =
      " where revision_id = :revisionId order by position";
  private static final String SELECT_REVISION =
      "select id, question_id, revision_number, status, question_type, topic_id, java_release,"
          + " seniority, difficulty, difficulty_rationale, prompt, explanation, author_id,"
          + " track_version_id,"
          + " created_at, submitted_at, published_at, published_by, deprecated_at"
          + " from certforge.qb_question_revision";

  private final JdbcClient jdbc;

  QuestionRepository(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  // ---- questions and revisions ---------------------------------------------------------------

  void insertQuestion(UUID id, UUID createdBy) {
    jdbc.sql("insert into certforge.qb_question (id, created_by) values (:id, :by)")
        .param(ID, id)
        .param("by", createdBy)
        .update();
  }

  Optional<UUID> findQuestionCreator(UUID questionId) {
    return jdbc.sql("select created_by from certforge.qb_question where id = :id")
        .param(ID, questionId)
        .query(UUID.class)
        .optional();
  }

  void insertRevision(UUID id, UUID questionId, int number, UUID authorId, RevisionContent c) {
    jdbc.sql(
            "insert into certforge.qb_question_revision (id, question_id, revision_number,"
                + " question_type, topic_id, java_release, seniority, difficulty,"
                + " difficulty_rationale,"
                + " prompt, explanation, author_id)"
                + " values (:id, :questionId, :number, :type, :topic, :release, :seniority,"
                + " :difficulty,"
                + " :rationale, :prompt, :explanation, :author)")
        .param(ID, id)
        .param(QUESTION_ID, questionId)
        .param("number", number)
        .param("type", c.type().name())
        .param("topic", c.topicId())
        .param("release", c.javaRelease())
        .param("seniority", c.seniority() == null ? null : c.seniority().name())
        .param("difficulty", c.difficulty() == null ? null : c.difficulty().name())
        .param("rationale", c.difficultyRationale())
        .param(PROMPT, c.prompt())
        .param(EXPLANATION, c.explanation())
        .param("author", authorId)
        .update();
    replaceChildren(id, c);
  }

  /** Overwrites the content of a DRAFT revision. The database rejects it for any other status. */
  void updateContent(UUID id, RevisionContent c) {
    jdbc.sql(
            "update certforge.qb_question_revision set question_type = :type, topic_id = :topic,"
                + " java_release = :release, seniority = :seniority, difficulty = :difficulty,"
                + " difficulty_rationale = :rationale, prompt = :prompt,"
                + " explanation = :explanation where id = :id")
        .param(ID, id)
        .param("type", c.type().name())
        .param("topic", c.topicId())
        .param("release", c.javaRelease())
        .param("seniority", c.seniority() == null ? null : c.seniority().name())
        .param("difficulty", c.difficulty() == null ? null : c.difficulty().name())
        .param("rationale", c.difficultyRationale())
        .param(PROMPT, c.prompt())
        .param(EXPLANATION, c.explanation())
        .update();
    replaceChildren(id, c);
  }

  private void replaceChildren(UUID revisionId, RevisionContent c) {
    jdbc.sql("delete from certforge.qb_revision_option where revision_id = :revisionId")
        .param(REVISION_ID, revisionId)
        .update();
    jdbc.sql("delete from certforge.qb_revision_reference where revision_id = :revisionId")
        .param(REVISION_ID, revisionId)
        .update();
    jdbc.sql("delete from certforge.qb_guided_expected_concept where revision_id = :revisionId")
        .param(REVISION_ID, revisionId)
        .update();
    jdbc.sql("delete from certforge.qb_guided_common_mistake where revision_id = :revisionId")
        .param(REVISION_ID, revisionId)
        .update();
    jdbc.sql("delete from certforge.qb_guided_follow_up where revision_id = :revisionId")
        .param(REVISION_ID, revisionId)
        .update();
    jdbc.sql("delete from certforge.qb_guided_response where revision_id = :revisionId")
        .param(REVISION_ID, revisionId)
        .update();
    int position = 0;
    for (RevisionContent.Option option : c.options()) {
      jdbc.sql(
              "insert into certforge.qb_revision_option"
                  + " (revision_id, option_key, position, text, correct, explanation)"
                  + " values (:revisionId, :key, :position, :text, :correct, :explanation)")
          .param(REVISION_ID, revisionId)
          .param("key", option.key())
          .param(POSITION, position)
          .param(TEXT, option.text())
          .param("correct", option.correct())
          .param(EXPLANATION, option.explanation())
          .update();
      position++;
    }
    if (c.guidedResponse() != null) {
      RevisionContent.GuidedResponse guided = c.guidedResponse();
      jdbc.sql(
              "insert into certforge.qb_guided_response (revision_id, reference_answer)"
                  + " values (:revisionId, :answer)")
          .param(REVISION_ID, revisionId)
          .param("answer", guided.referenceAnswer())
          .update();

      position = 0;
      for (RevisionContent.ExpectedConcept concept : guided.expectedConcepts()) {
        jdbc.sql(
                "insert into certforge.qb_guided_expected_concept"
                    + " (revision_id, position, required, text, explanation)"
                    + " values (:revisionId, :position, :required, :text, :explanation)")
            .param(REVISION_ID, revisionId)
            .param(POSITION, position)
            .param("required", concept.required())
            .param(TEXT, concept.text())
            .param(EXPLANATION, concept.explanation())
            .update();
        position++;
      }

      position = 0;
      for (String mistake : guided.commonMistakes()) {
        jdbc.sql(
                "insert into certforge.qb_guided_common_mistake"
                    + " (revision_id, position, text)"
                    + " values (:revisionId, :position, :text)")
            .param(REVISION_ID, revisionId)
            .param(POSITION, position)
            .param(TEXT, mistake)
            .update();
        position++;
      }

      position = 0;
      for (String followUp : guided.followUps()) {
        jdbc.sql(
                "insert into certforge.qb_guided_follow_up"
                    + " (revision_id, position, prompt)"
                    + " values (:revisionId, :position, :prompt)")
            .param(REVISION_ID, revisionId)
            .param(POSITION, position)
            .param(PROMPT, followUp)
            .update();
        position++;
      }
    }
    position = 0;
    for (RevisionContent.Reference reference : c.references()) {
      jdbc.sql(
              "insert into certforge.qb_revision_reference (revision_id, position, title, url)"
                  + " values (:revisionId, :position, :title, :url)")
          .param(REVISION_ID, revisionId)
          .param(POSITION, position)
          .param("title", reference.title())
          .param("url", reference.url())
          .update();
      position++;
    }
  }

  Optional<Revision> findRevision(UUID id) {
    return jdbc.sql(SELECT_REVISION + " where id = :id")
        .param(ID, id)
        .query(this::mapRevision)
        .optional();
  }

  List<Revision> findRevisions(UUID questionId) {
    return jdbc.sql(SELECT_REVISION + " where question_id = :questionId order by revision_number")
        .param(QUESTION_ID, questionId)
        .query(this::mapRevision)
        .list();
  }

  /**
   * Loads exact revisions and all of their children in three queries total, instead of two child
   * queries per revision.
   */
  List<Revision> findRevisionsByIds(List<UUID> ids) {
    if (ids.isEmpty()) {
      return List.of();
    }
    Map<UUID, List<RevisionContent.Option>> options = options(ids);
    Map<UUID, RevisionContent.GuidedResponse> guided = guidedResponses(ids);
    Map<UUID, List<RevisionContent.Reference>> references = references(ids);
    return jdbc.sql(SELECT_REVISION + " where id in (:ids)")
        .param("ids", ids)
        .query(
            (rs, n) -> {
              UUID id = rs.getObject("id", UUID.class);
              return mapRevision(
                  rs,
                  id,
                  options.getOrDefault(id, List.of()),
                  guided.get(id),
                  references.getOrDefault(id, List.of()));
            })
        .list();
  }

  /** Published revisions of a topic that are bound to the given (current) exam version. */
  List<Revision> findPublishedByTopic(UUID topicId, UUID trackVersionId) {
    return jdbc.sql(
            SELECT_REVISION
                + " where topic_id = :topic and track_version_id = :version"
                + " and status = 'PUBLISHED' order by published_at, revision_number")
        .param("topic", topicId)
        .param("version", trackVersionId)
        .query(this::mapRevision)
        .list();
  }

  Optional<Revision> findPublishedForContext(UUID questionId, UUID trackVersionId) {
    return jdbc.sql(
            SELECT_REVISION
                + " where question_id = :questionId and track_version_id = :version"
                + " and status = 'PUBLISHED'")
        .param(QUESTION_ID, questionId)
        .param("version", trackVersionId)
        .query(this::mapRevision)
        .optional();
  }

  int latestRevisionNumber(UUID questionId) {
    Integer latest =
        jdbc.sql(
                "select coalesce(max(revision_number), 0)"
                    + " from certforge.qb_question_revision where question_id = :questionId")
            .param(QUESTION_ID, questionId)
            .query(Integer.class)
            .single();
    return latest;
  }

  boolean hasOpenRevision(UUID questionId) {
    Integer open =
        jdbc.sql(
                "select count(*) from certforge.qb_question_revision"
                    + " where question_id = :questionId"
                    + " and status in ('DRAFT', 'TECHNICAL_REVIEW', 'APPROVED')")
            .param(QUESTION_ID, questionId)
            .query(Integer.class)
            .single();
    return open > 0;
  }

  /** One row per question describing its most recent revision, optionally filtered by status. */
  List<AdminQuestionViews.QuestionSummary> summaries(RevisionStatus statusFilter) {
    var statement =
        jdbc.sql(
            "select r.question_id, r.id, r.revision_number, r.status, r.prompt, r.topic_id"
                + " from certforge.qb_question_revision r"
                + " where r.revision_number = (select max(x.revision_number)"
                + " from certforge.qb_question_revision x where x.question_id = r.question_id)"
                + (statusFilter == null ? "" : " and r.status = :status")
                + " order by r.created_at desc");
    if (statusFilter != null) {
      statement = statement.param(STATUS, statusFilter.name());
    }
    return statement
        .query(
            (rs, n) ->
                new AdminQuestionViews.QuestionSummary(
                    rs.getObject("question_id", UUID.class),
                    rs.getObject("id", UUID.class),
                    rs.getInt("revision_number"),
                    rs.getString("status"),
                    rs.getString(PROMPT),
                    rs.getObject("topic_id", UUID.class)))
        .list();
  }

  // ---- lifecycle -----------------------------------------------------------------------------

  void setStatus(UUID id, RevisionStatus status) {
    jdbc.sql("update certforge.qb_question_revision set status = :status where id = :id")
        .param(STATUS, status.name())
        .param(ID, id)
        .update();
  }

  void markSubmitted(UUID id, Instant now) {
    jdbc.sql(
            "update certforge.qb_question_revision set status = 'TECHNICAL_REVIEW',"
                + " submitted_at = :now where id = :id")
        .param(NOW, utc(now))
        .param(ID, id)
        .update();
  }

  void markPublished(UUID id, UUID trackVersionId, UUID publishedBy, Instant now) {
    jdbc.sql(
            "update certforge.qb_question_revision set status = 'PUBLISHED',"
                + " track_version_id = :version, published_by = :by, published_at = :now"
                + " where id = :id")
        .param("version", trackVersionId)
        .param("by", publishedBy)
        .param(NOW, utc(now))
        .param(ID, id)
        .update();
  }

  void markDeprecated(UUID id, Instant now) {
    jdbc.sql(
            "update certforge.qb_question_revision set status = 'DEPRECATED',"
                + " deprecated_at = :now where id = :id")
        .param(NOW, utc(now))
        .param(ID, id)
        .update();
  }

  // ---- reviews -------------------------------------------------------------------------------

  void insertReview(
      UUID revisionId,
      UUID reviewerId,
      String decision,
      String comment,
      List<String> checklist,
      Instant now) {
    jdbc.sql(
            "insert into certforge.qb_content_review"
                + " (id, revision_id, reviewer_id, decision, comment, checklist, decided_at)"
                + " values (:id, :revisionId, :reviewer, :decision, :comment, :checklist, :now)")
        .param(ID, UUID.randomUUID())
        .param(REVISION_ID, revisionId)
        .param("reviewer", reviewerId)
        .param("decision", decision)
        .param("comment", comment)
        .param("checklist", ReviewChecklist.store(checklist))
        .param(NOW, utc(now))
        .update();
  }

  List<Review> findReviews(UUID revisionId) {
    return jdbc.sql(
            "select reviewer_id, decision, comment, checklist, decided_at"
                + " from certforge.qb_content_review where revision_id = :revisionId"
                + " order by decided_at")
        .param(REVISION_ID, revisionId)
        .query(
            (rs, n) ->
                new Review(
                    rs.getObject("reviewer_id", UUID.class),
                    rs.getString("decision"),
                    rs.getString("comment"),
                    ReviewChecklist.load(rs.getString("checklist")),
                    instant(rs, "decided_at")))
        .list();
  }

  // ---- mapping -------------------------------------------------------------------------------

  private Revision mapRevision(ResultSet rs, int rowNum) throws SQLException {
    UUID id = rs.getObject("id", UUID.class);
    return mapRevision(rs, id, options(id), guidedResponse(id), references(id));
  }

  private Revision mapRevision(
      ResultSet rs,
      UUID id,
      List<RevisionContent.Option> options,
      RevisionContent.GuidedResponse guidedResponse,
      List<RevisionContent.Reference> references)
      throws SQLException {
    String difficulty = rs.getString("difficulty");
    Integer release = (Integer) rs.getObject("java_release");
    String seniority = rs.getString("seniority");
    RevisionContent content =
        new RevisionContent(
            QuestionType.valueOf(rs.getString("question_type")),
            rs.getObject("topic_id", UUID.class),
            release,
            seniority == null ? null : Seniority.valueOf(seniority),
            difficulty == null ? null : Difficulty.valueOf(difficulty),
            rs.getString("difficulty_rationale"),
            rs.getString(PROMPT),
            rs.getString(EXPLANATION),
            options,
            guidedResponse,
            references);
    return new Revision(
        id,
        rs.getObject("question_id", UUID.class),
        rs.getInt("revision_number"),
        RevisionStatus.valueOf(rs.getString(STATUS)),
        rs.getObject("author_id", UUID.class),
        rs.getObject("track_version_id", UUID.class),
        instant(rs, "created_at"),
        instant(rs, "submitted_at"),
        instant(rs, "published_at"),
        rs.getObject("published_by", UUID.class),
        instant(rs, "deprecated_at"),
        content);
  }

  private List<RevisionContent.Option> options(UUID revisionId) {
    return jdbc.sql(
            "select option_key, text, correct, explanation from certforge.qb_revision_option"
                + REVISION_CHILDREN_ORDER)
        .param(REVISION_ID, revisionId)
        .query(
            (rs, n) ->
                new RevisionContent.Option(
                    rs.getString("option_key"),
                    rs.getString(TEXT),
                    rs.getBoolean("correct"),
                    rs.getString(EXPLANATION)))
        .list();
  }

  private RevisionContent.GuidedResponse guidedResponse(UUID revisionId) {
    Optional<String> answer =
        jdbc.sql(
                "select reference_answer from certforge.qb_guided_response"
                    + " where revision_id = :revisionId")
            .param(REVISION_ID, revisionId)
            .query(String.class)
            .optional();
    if (answer.isEmpty()) {
      return null;
    }
    List<RevisionContent.ExpectedConcept> concepts =
        jdbc.sql(
                "select text, required, explanation from certforge.qb_guided_expected_concept"
                    + REVISION_CHILDREN_ORDER)
            .param(REVISION_ID, revisionId)
            .query(
                (rs, n) ->
                    new RevisionContent.ExpectedConcept(
                        rs.getString(TEXT), rs.getBoolean("required"), rs.getString(EXPLANATION)))
            .list();
    List<String> mistakes =
        jdbc.sql("select text from certforge.qb_guided_common_mistake" + REVISION_CHILDREN_ORDER)
            .param(REVISION_ID, revisionId)
            .query(String.class)
            .list();
    List<String> followUps =
        jdbc.sql("select prompt from certforge.qb_guided_follow_up" + REVISION_CHILDREN_ORDER)
            .param(REVISION_ID, revisionId)
            .query(String.class)
            .list();
    return new RevisionContent.GuidedResponse(answer.orElseThrow(), concepts, mistakes, followUps);
  }

  private List<RevisionContent.Reference> references(UUID revisionId) {
    return jdbc.sql(
            "select title, url from certforge.qb_revision_reference" + REVISION_CHILDREN_ORDER)
        .param(REVISION_ID, revisionId)
        .query((rs, n) -> new RevisionContent.Reference(rs.getString("title"), rs.getString("url")))
        .list();
  }

  private Map<UUID, List<RevisionContent.Option>> options(List<UUID> revisionIds) {
    Map<UUID, List<RevisionContent.Option>> grouped = new LinkedHashMap<>();
    jdbc.sql(
            "select revision_id, option_key, text, correct, explanation"
                + " from certforge.qb_revision_option where revision_id in (:revisionIds)"
                + " order by revision_id, position")
        .param(REVISION_IDS, revisionIds)
        .query(
            (rs, n) ->
                new OptionRow(
                    rs.getObject(REVISION_ID_COLUMN, UUID.class),
                    new RevisionContent.Option(
                        rs.getString("option_key"),
                        rs.getString(TEXT),
                        rs.getBoolean("correct"),
                        rs.getString(EXPLANATION))))
        .list()
        .forEach(
            row ->
                grouped
                    .computeIfAbsent(row.revisionId(), ignored -> new ArrayList<>())
                    .add(row.option()));
    return grouped;
  }

  private Map<UUID, RevisionContent.GuidedResponse> guidedResponses(List<UUID> revisionIds) {
    Map<UUID, String> answers = new LinkedHashMap<>();
    jdbc.sql(
            "select revision_id, reference_answer from certforge.qb_guided_response"
                + " where revision_id in (:revisionIds) order by revision_id")
        .param(REVISION_IDS, revisionIds)
        .query(
            (rs, n) ->
                new GuidedAnswerRow(
                    rs.getObject(REVISION_ID_COLUMN, UUID.class), rs.getString("reference_answer")))
        .list()
        .forEach(row -> answers.put(row.revisionId(), row.referenceAnswer()));

    Map<UUID, List<RevisionContent.ExpectedConcept>> concepts = new LinkedHashMap<>();
    jdbc.sql(
            "select revision_id, text, required, explanation"
                + " from certforge.qb_guided_expected_concept"
                + " where revision_id in (:revisionIds) order by revision_id, position")
        .param(REVISION_IDS, revisionIds)
        .query(
            (rs, n) ->
                new ConceptRow(
                    rs.getObject(REVISION_ID_COLUMN, UUID.class),
                    new RevisionContent.ExpectedConcept(
                        rs.getString(TEXT), rs.getBoolean("required"), rs.getString(EXPLANATION))))
        .list()
        .forEach(
            row ->
                concepts
                    .computeIfAbsent(row.revisionId(), ignored -> new ArrayList<>())
                    .add(row.concept()));

    Map<UUID, List<String>> mistakes = guidedStrings(revisionIds, "qb_guided_common_mistake", TEXT);
    Map<UUID, List<String>> followUps = guidedStrings(revisionIds, "qb_guided_follow_up", PROMPT);

    Map<UUID, RevisionContent.GuidedResponse> result = new LinkedHashMap<>();
    answers.forEach(
        (revisionId, answer) ->
            result.put(
                revisionId,
                new RevisionContent.GuidedResponse(
                    answer,
                    concepts.getOrDefault(revisionId, List.of()),
                    mistakes.getOrDefault(revisionId, List.of()),
                    followUps.getOrDefault(revisionId, List.of()))));
    return result;
  }

  private Map<UUID, List<String>> guidedStrings(
      List<UUID> revisionIds, String table, String column) {
    Map<UUID, List<String>> grouped = new LinkedHashMap<>();
    jdbc.sql(
            "select revision_id, "
                + column
                + " as value from certforge."
                + table
                + " where revision_id in (:revisionIds) order by revision_id, position")
        .param(REVISION_IDS, revisionIds)
        .query(
            (rs, n) ->
                new GuidedStringRow(
                    rs.getObject(REVISION_ID_COLUMN, UUID.class), rs.getString("value")))
        .list()
        .forEach(
            row ->
                grouped
                    .computeIfAbsent(row.revisionId(), ignored -> new ArrayList<>())
                    .add(row.value()));
    return grouped;
  }

  private Map<UUID, List<RevisionContent.Reference>> references(List<UUID> revisionIds) {
    Map<UUID, List<RevisionContent.Reference>> grouped = new LinkedHashMap<>();
    jdbc.sql(
            "select revision_id, title, url from certforge.qb_revision_reference"
                + " where revision_id in (:revisionIds) order by revision_id, position")
        .param(REVISION_IDS, revisionIds)
        .query(
            (rs, n) ->
                new ReferenceRow(
                    rs.getObject(REVISION_ID_COLUMN, UUID.class),
                    new RevisionContent.Reference(rs.getString("title"), rs.getString("url"))))
        .list()
        .forEach(
            row ->
                grouped
                    .computeIfAbsent(row.revisionId(), ignored -> new ArrayList<>())
                    .add(row.reference()));
    return grouped;
  }

  private record OptionRow(UUID revisionId, RevisionContent.Option option) {}

  private record GuidedAnswerRow(UUID revisionId, String referenceAnswer) {}

  private record ConceptRow(UUID revisionId, RevisionContent.ExpectedConcept concept) {}

  private record GuidedStringRow(UUID revisionId, String value) {}

  private record ReferenceRow(UUID revisionId, RevisionContent.Reference reference) {}

  private static OffsetDateTime utc(Instant instant) {
    return OffsetDateTime.ofInstant(instant, ZoneOffset.UTC);
  }

  private static Instant instant(ResultSet rs, String column) throws SQLException {
    OffsetDateTime value = rs.getObject(column, OffsetDateTime.class);
    return value == null ? null : value.toInstant();
  }
}
