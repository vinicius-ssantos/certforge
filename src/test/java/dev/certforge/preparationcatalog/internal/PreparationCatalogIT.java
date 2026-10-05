package dev.certforge.preparationcatalog.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.preparationcatalog.TrackKind;
import jakarta.servlet.http.Cookie;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@SpringBootTest(
    properties = {
      "certforge.identity.bootstrap-admin.email=catalog-admin@example.com",
      "certforge.identity.bootstrap-admin.password=correct horse battery"
    })
@AutoConfigureMockMvc
@Testcontainers
class PreparationCatalogIT {

  private static final String PASSWORD = "correct horse battery";
  private static final String SESSION_COOKIE = "CERTFORGE_SESSION";
  private static final String INTERVIEW_TRACK_ID = "a1000000-0000-4000-8000-000000000002";
  private static final String SEEDED_TOPIC_ID = "a3000000-0000-4000-8000-000000000001";
  private static final AtomicInteger IP_SEQUENCE = new AtomicInteger();

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired MockMvc mvc;
  @Autowired JdbcTemplate jdbc;
  @Autowired PreparationCatalog catalog;

  private Cookie admin;
  private Cookie learner;

  @BeforeEach
  void signIn() throws Exception {
    admin = login("catalog-admin@example.com");
    String email = "learner-" + UUID.randomUUID() + "@example.com";
    mvc.perform(
            post("/api/auth/register")
                .with(csrf())
                .with(freshIp())
                .contentType("application/json")
                .content(credentials(email)))
        .andExpect(status().isCreated());
    learner = login(email);
  }

  // ---- helpers -------------------------------------------------------------------------------

  private static RequestPostProcessor freshIp() {
    String ip = "10.2." + (IP_SEQUENCE.incrementAndGet() / 250) + "." + (IP_SEQUENCE.get() % 250);
    return request -> {
      request.setRemoteAddr(ip);
      return request;
    };
  }

  private static String credentials(String email) {
    return "{\"email\":\"" + email + "\",\"password\":\"" + PASSWORD + "\"}";
  }

  private Cookie login(String email) throws Exception {
    MvcResult result =
        mvc.perform(
                post("/api/auth/login")
                    .with(csrf())
                    .with(freshIp())
                    .contentType("application/json")
                    .content(credentials(email)))
            .andExpect(status().isOk())
            .andReturn();
    return result.getResponse().getCookie(SESSION_COOKIE);
  }

  private ResultActions send(MockHttpServletRequestBuilder request, Cookie session, String body)
      throws Exception {
    request.with(csrf());
    if (session != null) {
      request.cookie(session);
    }
    if (body != null) {
      request.contentType("application/json").content(body);
    }
    return mvc.perform(request);
  }

  private static String slug() {
    return "track-" + UUID.randomUUID().toString().substring(0, 8);
  }

  private static String read(ResultActions actions, String path) throws Exception {
    return JsonPath.read(actions.andReturn().getResponse().getContentAsString(), path).toString();
  }

  /** First value matched by a JsonPath filter, which always yields a list. */
  private static String firstOf(ResultActions actions, String path) throws Exception {
    java.util.List<String> values =
        JsonPath.read(actions.andReturn().getResponse().getContentAsString(), path);
    return values.get(0);
  }

  /** Creates a draft track and returns its id. */
  private String createTrack(String slug) throws Exception {
    ResultActions created =
        send(
                post("/api/admin/catalog/tracks"),
                admin,
                "{\"slug\":\""
                    + slug
                    + "\",\"name\":\"Test Track\",\"provider\":\"Acme\","
                    + "\"certificationName\":\"Acme Certified Tester\"}")
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.status").value("DRAFT"))
            .andExpect(jsonPath("$.kind").value("CERTIFICATION"));
    return read(created, "$.id");
  }

  private String createExamVersion(String trackId, String label) throws Exception {
    ResultActions created =
        send(
                post("/api/admin/catalog/tracks/" + trackId + "/exam-versions"),
                admin,
                "{\"label\":\""
                    + label
                    + "\",\"examCode\":\"T-1\",\"examName\":\"Tester Exam\",\"javaRelease\":21,"
                    + "\"objectivesUrl\":\"https://example.com/objectives\"}")
            .andExpect(status().isCreated());
    return firstOf(created, "$.examVersions[?(@.label=='" + label + "')].id");
  }

  private String createTopic(String trackId, String slug, String parentId) throws Exception {
    String parent = parentId == null ? "null" : "\"" + parentId + "\"";
    ResultActions created =
        send(
                post("/api/admin/catalog/tracks/" + trackId + "/topics"),
                admin,
                "{\"slug\":\""
                    + slug
                    + "\",\"name\":\"Topic "
                    + slug
                    + "\",\"parentId\":"
                    + parent
                    + "}")
            .andExpect(status().isCreated());
    return firstOf(created, "$.topics[?(@.slug=='" + slug + "')].id");
  }

  private ResultActions map(String versionId, String... topicIdsInOrder) throws Exception {
    StringBuilder entries = new StringBuilder();
    for (int i = 0; i < topicIdsInOrder.length; i++) {
      if (i > 0) {
        entries.append(',');
      }
      entries
          .append("{\"topicId\":\"")
          .append(topicIdsInOrder[i])
          .append("\",\"objectiveRef\":\"Objective ")
          .append(i)
          .append("\",\"position\":")
          .append(i)
          .append('}');
    }
    return send(
        put("/api/admin/catalog/exam-versions/" + versionId + "/topics"),
        admin,
        "{\"topics\":[" + entries + "]}");
  }

  private boolean learnerSees(String slug) throws Exception {
    String body =
        mvc.perform(get("/api/catalog/tracks").cookie(learner))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    return !JsonPath.<java.util.List<String>>read(body, "$[?(@.slug=='" + slug + "')].slug")
        .isEmpty();
  }

  // ---- learner view --------------------------------------------------------------------------

  @Test
  void learnerSeesTheSeededJavaCertificationWithOrderedTopics() throws Exception {
    mvc.perform(get("/api/catalog/tracks/java-certification").cookie(learner))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.kind").value("CERTIFICATION"))
        .andExpect(jsonPath("$.provider").value("Oracle"))
        .andExpect(jsonPath("$.examVersion.examCode").value("1Z0-830"))
        .andExpect(jsonPath("$.examVersion.javaRelease").value(21))
        .andExpect(
            jsonPath("$.examVersion.objectivesUrl")
                .value(
                    "https://education.oracle.com/java-se-21-developer-professional/pexam_1Z0-830"))
        .andExpect(
            jsonPath("$.certificationName")
                .value("Oracle Certified Professional Java SE 21 Developer"))
        .andExpect(jsonPath("$.topics.length()").value(10))
        .andExpect(jsonPath("$.topics[0].slug").value("date-time-text-numeric-boolean"))
        .andExpect(jsonPath("$.topics[0].id").value(SEEDED_TOPIC_ID))
        .andExpect(jsonPath("$.topics[0].objectiveRef").isNotEmpty())
        .andExpect(jsonPath("$.topics[9].slug").value("localization"));
  }

  @Test
  void learnerListOnlyContainsCertificationTracks() throws Exception {
    mvc.perform(get("/api/catalog/tracks").cookie(learner))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[?(@.kind!='CERTIFICATION')]").isEmpty());
  }

  @Test
  void unknownOrInactiveTrackIsNotFound() throws Exception {
    mvc.perform(get("/api/catalog/tracks/does-not-exist").cookie(learner))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("track_not_found"));
  }

  @Test
  void catalogRequiresAuthentication() throws Exception {
    mvc.perform(get("/api/catalog/tracks")).andExpect(status().isUnauthorized());
  }

  @Test
  void seededTopicsAreReachableThroughTheModuleContract() {
    assertThat(catalog.findActiveTopic(new TopicId(UUID.fromString(SEEDED_TOPIC_ID)))).isPresent();
    assertThat(catalog.findActiveTopic(new TopicId(UUID.randomUUID()))).isEmpty();
    assertThat(catalog.activeTrack("java-certification")).isPresent();
    var context = catalog.findActiveTopicContext(new TopicId(UUID.fromString(SEEDED_TOPIC_ID)));
    assertThat(context).isPresent();
    assertThat(context.orElseThrow().kind()).isEqualTo(TrackKind.CERTIFICATION);
    assertThat(context.orElseThrow().javaRelease()).contains(21);
    assertThat(catalog.findActiveTopicContext(new TopicId(UUID.randomUUID()))).isEmpty();

    assertThat(catalog.findTrackKindOfTopic(new TopicId(UUID.fromString(SEEDED_TOPIC_ID))))
        .contains(TrackKind.CERTIFICATION);
    assertThat(catalog.findTrackKindOfTopic(new TopicId(UUID.randomUUID()))).isEmpty();
  }

  /**
   * The context of an interview topic, which is what decision 6 made possible: a version with no
   * exam produces a context all the same, and it carries no Java release rather than a nullable one
   * a reader has to interpret.
   */
  @Test
  void theSeededInterviewTaxonomyIsTwelveWeightedTopicsWithNoExamAndNoObjectives() {
    String track = "a1000000-0000-4000-8000-000000000002";
    String version = "a2000000-0000-4000-8000-000000000002";

    assertThat(
            jdbc.queryForObject(
                "select kind || ':' || status from certforge.catalog_track where id = ?::uuid",
                String.class,
                track))
        .isEqualTo("INTERVIEW:DRAFT");
    assertThat(
            jdbc.queryForObject(
                "select count(*) from certforge.catalog_topic where track_id = ?::uuid",
                Integer.class,
                track))
        .isEqualTo(12);
    assertThat(
            jdbc.queryForObject(
                "select count(*) from certforge.catalog_track_version_topic"
                    + " where track_version_id = ?::uuid",
                Integer.class,
                version))
        .isEqualTo(12);
    // No objective is cited, because there is no published objective to cite.
    assertThat(
            jdbc.queryForObject(
                "select count(*) from certforge.catalog_track_version_topic"
                    + " where track_version_id = ?::uuid and objective_ref is not null",
                Integer.class,
                version))
        .isZero();
    // Every topic carries a canonical weight, in the documented 1 to 5 range.
    assertThat(
            jdbc.queryForObject(
                "select count(*) from certforge.catalog_track_version_topic"
                    + " where track_version_id = ?::uuid and weight between 1 and 5",
                Integer.class,
                version))
        .isEqualTo(12);
    // And it is a taxonomy version, not an exam revision.
    assertThat(
            jdbc.queryForObject(
                "select count(*) from certforge.catalog_certification_exam"
                    + " where track_version_id = ?::uuid",
                Integer.class,
                version))
        .isZero();
    // Reading order is independent of weight, and is a gapless sequence.
    assertThat(
            jdbc.queryForList(
                "select position from certforge.catalog_track_version_topic"
                    + " where track_version_id = ?::uuid order by position",
                Integer.class,
                version))
        .containsExactly(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);
  }

  /**
   * The administrator has to be able to see a track that is not a certification, or the catalog is
   * lying to the person responsible for it. Before this, every track query inner-joined
   * catalog_certification_profile, so a track with no profile — which an interview track has no
   * reason to have — was silently absent from the admin catalog as well as from the learner's.
   */
  @Test
  void theAdminCatalogShowsTracksThatAreNotCertifications() throws Exception {
    mvc.perform(get("/api/admin/catalog/tracks").cookie(admin))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[?(@.slug=='java-backend-interview')].kind", hasItem("INTERVIEW")))
        .andExpect(jsonPath("$[?(@.slug=='java-backend-interview')].status", hasItem("DRAFT")))
        // No exam identity, rather than an invented one or a crash on unboxing a null.
        .andExpect(
            jsonPath("$[?(@.slug=='java-backend-interview')].provider", hasItem(nullValue())))
        .andExpect(
            jsonPath(
                "$[?(@.slug=='java-backend-interview')].examVersions[0].javaRelease",
                hasItem(nullValue())))
        .andExpect(
            jsonPath(
                "$[?(@.slug=='java-backend-interview')].examVersions[0].label",
                hasItem("Taxonomy 2026.1")));

    mvc.perform(get("/api/admin/catalog/tracks/" + INTERVIEW_TRACK_ID).cookie(admin))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.topics", hasSize(12)));
  }

  /** Both rows are DRAFT, so no learner can see the track and nothing can be published to it. */
  @Test
  void theSeededInterviewTrackIsNotOfferedToLearnersYet() throws Exception {
    assertThat(catalog.activeTracks()).extracting("slug").doesNotContain("java-backend-interview");
    assertThat(catalog.activeTrack("java-backend-interview")).isEmpty();
    assertThat(
            catalog.findActiveTopicContext(
                new TopicId(UUID.fromString("a3000000-0000-4000-8000-000000000102"))))
        .as("a draft version maps the topic, but publishing needs an active one")
        .isEmpty();

    // The kind is still answerable, which is what lets an editor write for it before it opens.
    assertThat(
            catalog.findTrackKindOfTopic(
                new TopicId(UUID.fromString("a3000000-0000-4000-8000-000000000102"))))
        .contains(TrackKind.INTERVIEW);

    mvc.perform(get("/api/catalog/tracks").cookie(learner))
        .andExpect(status().isOk())
        .andExpect(
            jsonPath("$[?(@.slug=='java-backend-interview')]", org.hamcrest.Matchers.empty()))
        // The same filter against the track that *is* served, so the assertion above is known to
        // be the filter finding nothing rather than the filter not working at all.
        .andExpect(
            jsonPath("$[?(@.slug=='java-certification')]", org.hamcrest.Matchers.hasSize(1)));
  }

  @Test
  void anInterviewTopicHasAContextWithNoJavaRelease() {
    UUID trackId = UUID.randomUUID();
    UUID versionId = UUID.randomUUID();
    UUID topicId = UUID.randomUUID();
    jdbc.update(
        "insert into certforge.catalog_track (id, slug, name, kind, status)"
            + " values (?, 'interview-"
            + slug()
            + "', 'Java Backend', 'INTERVIEW', 'ACTIVE')",
        trackId);
    jdbc.update(
        "insert into certforge.catalog_track_version (id, track_id, label, status)"
            + " values (?, ?, 'Taxonomy 1', 'ACTIVE')",
        versionId,
        trackId);
    jdbc.update(
        "insert into certforge.catalog_topic (id, track_id, slug, name)"
            + " values (?, ?, 'system-design', 'System design')",
        topicId,
        trackId);
    jdbc.update(
        "insert into certforge.catalog_track_version_topic"
            + " (track_version_id, topic_id, objective_ref, position, weight)"
            + " values (?, ?, null, 0, 2)",
        versionId,
        topicId);

    var context = catalog.findActiveTopicContext(new TopicId(topicId));

    assertThat(context).isPresent();
    assertThat(context.orElseThrow().kind()).isEqualTo(TrackKind.INTERVIEW);
    assertThat(context.orElseThrow().trackVersionId().value()).isEqualTo(versionId);
    assertThat(context.orElseThrow().javaRelease()).isEmpty();
  }

  // ---- lifecycle -----------------------------------------------------------------------------

  @Test
  void draftContentIsHiddenUntilTrackAndExamVersionAreActive() throws Exception {
    String slug = slug();
    String trackId = createTrack(slug);
    String versionId = createExamVersion(trackId, "V1");
    String parentId = createTopic(trackId, "parent", null);
    String childId = createTopic(trackId, "child", parentId);
    map(versionId, parentId, childId).andExpect(status().isOk());

    assertThat(learnerSees(slug)).isFalse();

    send(post("/api/admin/catalog/exam-versions/" + versionId + "/activate"), admin, null)
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("track_not_active"));

    send(post("/api/admin/catalog/tracks/" + trackId + "/activate"), admin, null)
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("ACTIVE"));
    assertThat(learnerSees(slug)).isFalse();

    send(post("/api/admin/catalog/exam-versions/" + versionId + "/activate"), admin, null)
        .andExpect(status().isOk());
    assertThat(learnerSees(slug)).isTrue();

    mvc.perform(get("/api/catalog/tracks/" + slug).cookie(learner))
        .andExpect(jsonPath("$.topics.length()").value(1))
        .andExpect(jsonPath("$.topics[0].slug").value("parent"))
        .andExpect(jsonPath("$.topics[0].subtopics[0].slug").value("child"))
        .andExpect(jsonPath("$.topics[0].subtopics[0].objectiveRef").value("Objective 1"));

    send(post("/api/admin/catalog/tracks/" + trackId + "/deactivate"), admin, null)
        .andExpect(status().isOk());
    assertThat(learnerSees(slug)).isFalse();
  }

  @Test
  void activeExamVersionIsFrozenAndOnlyOneCanBeActive() throws Exception {
    String trackId = createTrack(slug());
    String first = createExamVersion(trackId, "V1");
    String second = createExamVersion(trackId, "V2");
    String topic = createTopic(trackId, "t1", null);
    map(first, topic).andExpect(status().isOk());
    map(second, topic).andExpect(status().isOk());
    send(post("/api/admin/catalog/tracks/" + trackId + "/activate"), admin, null);
    send(post("/api/admin/catalog/exam-versions/" + first + "/activate"), admin, null)
        .andExpect(status().isOk());

    map(first, topic)
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("exam_version_not_editable"));
    send(post("/api/admin/catalog/exam-versions/" + second + "/activate"), admin, null)
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("active_exam_version_exists"));

    send(post("/api/admin/catalog/exam-versions/" + first + "/deactivate"), admin, null)
        .andExpect(status().isOk());
    send(post("/api/admin/catalog/exam-versions/" + second + "/activate"), admin, null)
        .andExpect(status().isOk());
  }

  @Test
  void examVersionWithoutTopicsCannotBeActivated() throws Exception {
    String trackId = createTrack(slug());
    String versionId = createExamVersion(trackId, "V1");
    send(post("/api/admin/catalog/tracks/" + trackId + "/activate"), admin, null);

    send(post("/api/admin/catalog/exam-versions/" + versionId + "/activate"), admin, null)
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("exam_version_has_no_topics"));
  }

  @Test
  void renamingATopicKeepsItsIdentity() throws Exception {
    String trackId = createTrack(slug());
    String topicId = createTopic(trackId, "stable-slug", null);

    send(put("/api/admin/catalog/topics/" + topicId), admin, "{\"name\":\"Corrected name\"}")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.topics[0].id").value(topicId))
        .andExpect(jsonPath("$.topics[0].slug").value("stable-slug"))
        .andExpect(jsonPath("$.topics[0].name").value("Corrected name"));
  }

  // ---- validation ----------------------------------------------------------------------------

  @Test
  void mappingRulesAreEnforced() throws Exception {
    String trackId = createTrack(slug());
    String otherTrackId = createTrack(slug());
    String versionId = createExamVersion(trackId, "V1");
    String parent = createTopic(trackId, "parent", null);
    String child = createTopic(trackId, "child", parent);
    String foreign = createTopic(otherTrackId, "foreign", null);

    map(versionId, foreign)
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("topic_not_in_track"));
    map(versionId, child)
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("parent_topic_not_mapped"));
    map(versionId, parent, parent)
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("duplicate_topic"));
    send(
            put("/api/admin/catalog/exam-versions/" + versionId + "/topics"),
            admin,
            "{\"topics\":[{\"topicId\":\""
                + parent
                + "\",\"objectiveRef\":\"A\",\"position\":0},{\"topicId\":\""
                + child
                + "\",\"objectiveRef\":\"B\",\"position\":0}]}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("duplicate_position"));
  }

  @Test
  void subtopicsCannotNestDeeperThanOneLevel() throws Exception {
    String trackId = createTrack(slug());
    String parent = createTopic(trackId, "parent", null);
    String child = createTopic(trackId, "child", parent);

    send(
            post("/api/admin/catalog/tracks/" + trackId + "/topics"),
            admin,
            "{\"slug\":\"grandchild\",\"name\":\"Grandchild\",\"parentId\":\"" + child + "\"}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("topic_too_deep"));
  }

  @Test
  void slugsAreValidatedAndUnique() throws Exception {
    String slug = slug();
    createTrack(slug);

    send(
            post("/api/admin/catalog/tracks"),
            admin,
            "{\"slug\":\"Bad Slug\",\"name\":\"n\",\"provider\":\"p\",\"certificationName\":\"c\"}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("validation_failed"))
        .andExpect(jsonPath("$.fields[0]").value("slug"));
    send(
            post("/api/admin/catalog/tracks"),
            admin,
            "{\"slug\":\""
                + slug
                + "\",\"name\":\"n\",\"provider\":\"p\",\"certificationName\":\"c\"}")
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("slug_already_exists"));
  }

  @Test
  void objectivesUrlMustBeHttps() throws Exception {
    String trackId = createTrack(slug());

    send(
            post("/api/admin/catalog/tracks/" + trackId + "/exam-versions"),
            admin,
            "{\"label\":\"V1\",\"examCode\":\"T\",\"examName\":\"E\",\"javaRelease\":21,"
                + "\"objectivesUrl\":\"javascript:alert(1)\"}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.fields[0]").value("objectivesUrl"));
  }

  // ---- what a track version is, now that it is not only an exam (ADR 0016) -------------------

  /**
   * The point of generalising the exam version: a track with no exam can hold a version, map topics
   * into it without inventing objectives, and carry canonical weights. Written against the schema
   * rather than through the API because there is no endpoint that creates an interview track yet —
   * which is the honest state of this change, and is why it is asserted here instead of claimed.
   */
  @Test
  void anInterviewTrackCanHoldAVersionWithWeightedTopicsAndNoObjectives() {
    UUID trackId = UUID.randomUUID();
    UUID versionId = UUID.randomUUID();
    UUID topicId = UUID.randomUUID();
    jdbc.update(
        "insert into certforge.catalog_track (id, slug, name, kind, status)"
            + " values (?, 'interview-"
            + slug()
            + "', 'Java Backend', 'INTERVIEW', 'DRAFT')",
        trackId);
    jdbc.update(
        "insert into certforge.catalog_track_version (id, track_id, label)"
            + " values (?, ?, 'Taxonomy 1')",
        versionId,
        trackId);
    jdbc.update(
        "insert into certforge.catalog_topic (id, track_id, slug, name)"
            + " values (?, ?, 'concurrency', 'Concurrency')",
        topicId,
        trackId);
    jdbc.update(
        "insert into certforge.catalog_track_version_topic"
            + " (track_version_id, topic_id, objective_ref, position, weight)"
            + " values (?, ?, null, 0, 3)",
        versionId,
        topicId);

    assertThat(
            jdbc.queryForObject(
                "select weight from certforge.catalog_track_version_topic"
                    + " where track_version_id = ? and topic_id = ?",
                Integer.class,
                versionId,
                topicId))
        .isEqualTo(3);
    // No exam row, which is what makes it an interview version rather than a certification one.
    assertThat(
            jdbc.queryForObject(
                "select count(*) from certforge.catalog_certification_exam"
                    + " where track_version_id = ?",
                Integer.class,
                versionId))
        .isZero();
  }

  /**
   * The other half of the same decision: dropping NOT NULL from {@code objective_ref} must not let
   * a certification version stop citing its objectives. That rule spans two tables, so a CHECK
   * cannot express it and a trigger does.
   */
  @Test
  void aCertificationVersionStillCannotMapATopicWithoutAnObjective() {
    UUID versionId =
        jdbc.queryForObject(
            "select id from certforge.catalog_track_version where status = 'ACTIVE' limit 1",
            UUID.class);

    assertThatThrownBy(
            () ->
                jdbc.update(
                    "update certforge.catalog_track_version_topic set objective_ref = null"
                        + " where track_version_id = ?",
                    versionId))
        // The message, not the exception type: a plpgsql RAISE arrives as SQLSTATE P0001, which
        // Spring translates to UncategorizedSQLException rather than a constraint violation. The
        // other trigger tests in this repository assert the same way, for the same reason.
        .hasMessageContaining("needs an objective_ref");
  }

  /** The exam identity moved to its own table and must still read back unchanged. */
  @Test
  void theSeededExamKeptItsIdentityThroughTheMigration() {
    assertThat(
            jdbc.queryForObject(
                "select e.exam_code from certforge.catalog_certification_exam e"
                    + " join certforge.catalog_track_version v on v.id = e.track_version_id"
                    + " join certforge.catalog_track t on t.id = v.track_id"
                    + " where t.slug = 'java-certification' and v.status = 'ACTIVE'",
                String.class))
        .isEqualTo("1Z0-830");
  }

  // ---- authorization -------------------------------------------------------------------------

  @Test
  void catalogAdministrationRequiresTheCatalogManagePermission() throws Exception {
    String body =
        "{\"slug\":\"x-"
            + slug()
            + "\",\"name\":\"n\",\"provider\":\"p\",\"certificationName\":\"c\"}";

    send(post("/api/admin/catalog/tracks"), null, body).andExpect(status().isUnauthorized());
    send(post("/api/admin/catalog/tracks"), learner, body).andExpect(status().isForbidden());
    mvc.perform(get("/api/admin/catalog/tracks").cookie(learner)).andExpect(status().isForbidden());
    mvc.perform(get("/api/admin/catalog/tracks").cookie(admin))
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(
                "$[?(@.slug=='java-certification')].status",
                org.hamcrest.Matchers.hasItem("ACTIVE")));
  }
}
