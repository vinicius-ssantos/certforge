package dev.certforge.questionbank.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.certforge.audit.AuditFact;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.PublishedQuestion;
import dev.certforge.questionbank.QuestionBank;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.questionbank.RevisionEvidence;
import dev.certforge.questionbank.RevisionStatus;
import jakarta.servlet.http.Cookie;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.event.ApplicationEvents;
import org.springframework.test.context.event.RecordApplicationEvents;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;
import tools.jackson.databind.json.JsonMapper;

@SpringBootTest(
    properties = {
      "certforge.identity.bootstrap-admin.email=qb-admin@example.com",
      "certforge.identity.bootstrap-admin.password=correct horse battery"
    })
@AutoConfigureMockMvc
@Testcontainers
@RecordApplicationEvents
class QuestionBankIT {

  private static final String PASSWORD = "correct horse battery";
  private static final String SESSION_COOKIE = "CERTFORGE_SESSION";

  /** Seeded topic "Handling exceptions" of the active Java 21 exam version. */
  private static final String TOPIC = "a3000000-0000-4000-8000-000000000004";

  private static final AtomicInteger IP_SEQUENCE = new AtomicInteger();

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired MockMvc mvc;
  @Autowired JdbcTemplate jdbc;
  @Autowired QuestionBank bank;
  @Autowired JsonMapper json;
  @Autowired ApplicationEvents events;

  private User admin;
  private User editor;
  private User reviewer;

  record User(UUID id, Cookie session) {}

  @BeforeEach
  void signIn() throws Exception {
    admin = new User(null, login("qb-admin@example.com"));
    editor = user("EDITOR");
    reviewer = user("REVIEWER");
  }

  // ---- helpers -------------------------------------------------------------------------------

  private static RequestPostProcessor freshIp() {
    String ip = "10.3." + (IP_SEQUENCE.incrementAndGet() / 250) + "." + (IP_SEQUENCE.get() % 250);
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

  /** Registers an account, grants it the roles through the administrator, and signs it in. */
  private User user(String... roles) throws Exception {
    String email = "qb-" + UUID.randomUUID() + "@example.com";
    MvcResult registered =
        mvc.perform(
                post("/api/auth/register")
                    .with(csrf())
                    .with(freshIp())
                    .contentType("application/json")
                    .content(credentials(email)))
            .andExpect(status().isCreated())
            .andReturn();
    UUID id =
        UUID.fromString(
            JsonPath.read(registered.getResponse().getContentAsString(), "$.id").toString());
    if (roles.length > 0) {
      String list = "\"" + String.join("\",\"", roles) + "\"";
      mvc.perform(
              put("/api/admin/accounts/" + id + "/roles")
                  .with(csrf())
                  .cookie(admin.session())
                  .contentType("application/json")
                  .content("{\"roles\":[" + list + "]}"))
          .andExpect(status().isOk());
    }
    return new User(id, login(email));
  }

  private ResultActions send(MockHttpServletRequestBuilder request, User as, String body)
      throws Exception {
    request.with(csrf());
    if (as != null) {
      request.cookie(as.session());
    }
    if (body != null) {
      request.contentType("application/json").content(body);
    }
    return mvc.perform(request);
  }

  private static String body(String prompt) {
    return body(prompt, "SINGLE_CHOICE", TOPIC, 21, true, false);
  }

  private static String body(
      String prompt, String type, String topic, int release, boolean aCorrect, boolean bCorrect) {
    return "{\"type\":\""
        + type
        + "\",\"topicId\":\""
        + topic
        + "\",\"javaRelease\":"
        + release
        + ",\"difficulty\":\"MEDIUM\",\"difficultyRationale\":\"Needs care with checked exceptions\","
        + "\"prompt\":\""
        + prompt
        + "\",\"explanation\":\"Overall explanation\","
        + "\"options\":[{\"key\":\"A\",\"text\":\"First\",\"correct\":"
        + aCorrect
        + ",\"explanation\":\"Why A\"},{\"key\":\"B\",\"text\":\"Second\",\"correct\":"
        + bCorrect
        + ",\"explanation\":\"Why B\"}],"
        + "\"references\":[{\"title\":\"JLS 11\","
        + "\"url\":\"https://docs.oracle.com/javase/specs/jls/se21/html/jls-11.html\"}]}";
  }

  private static String firstRevisionId(ResultActions actions, int index) throws Exception {
    return JsonPath.read(
        actions.andReturn().getResponse().getContentAsString(), "$.revisions[" + index + "].id");
  }

  private static String questionId(ResultActions actions) throws Exception {
    return JsonPath.read(actions.andReturn().getResponse().getContentAsString(), "$.id");
  }

  /** Creates a complete draft as the editor and returns {questionId, revisionId}. */
  private String[] createComplete(String prompt) throws Exception {
    ResultActions created =
        send(post("/api/admin/questions"), editor, body(prompt)).andExpect(status().isCreated());
    return new String[] {questionId(created), firstRevisionId(created, 0)};
  }

  private void submit(String revisionId) throws Exception {
    send(post("/api/admin/question-revisions/" + revisionId + "/submit"), editor, null)
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.revisions[-1:].status").value("TECHNICAL_REVIEW"));
  }

  private void approve(String revisionId) throws Exception {
    send(post("/api/admin/question-revisions/" + revisionId + "/approve"), reviewer, "{}")
        .andExpect(status().isOk());
  }

  private ResultActions publish(String revisionId) throws Exception {
    return send(post("/api/admin/question-revisions/" + revisionId + "/publish"), admin, null);
  }

  /** Runs a complete revision through to PUBLISHED and returns {questionId, revisionId}. */
  private String[] publishNew(String prompt) throws Exception {
    String[] ids = createComplete(prompt);
    submit(ids[1]);
    approve(ids[1]);
    publish(ids[1]).andExpect(status().isOk());
    return ids;
  }

  private static RevisionStatus statusOf(QuestionBank bank, String revisionId) {
    return bank.findRevision(new QuestionRevisionId(UUID.fromString(revisionId)))
        .orElseThrow()
        .status();
  }

  private List<String> auditActions() {
    return events.stream(AuditFact.class).map(AuditFact::action).toList();
  }

  // ---- lifecycle -----------------------------------------------------------------------------

  @Test
  void fullEditorialLifecycleEndsWithALearnerSafePublishedQuestion() throws Exception {
    String[] ids = createComplete("Which exception is checked?");
    assertThat(statusOf(bank, ids[1])).isEqualTo(RevisionStatus.DRAFT);
    submit(ids[1]);
    assertThat(statusOf(bank, ids[1])).isEqualTo(RevisionStatus.TECHNICAL_REVIEW);
    approve(ids[1]);
    assertThat(statusOf(bank, ids[1])).isEqualTo(RevisionStatus.APPROVED);

    publish(ids[1])
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.revisions[0].status").value("PUBLISHED"))
        .andExpect(jsonPath("$.revisions[0].examVersionId").isNotEmpty())
        .andExpect(jsonPath("$.revisions[0].reviews[0].decision").value("APPROVED"));

    List<PublishedQuestion> eligible = bank.eligibleForTopic(new TopicId(UUID.fromString(TOPIC)));
    PublishedQuestion published =
        eligible.stream()
            .filter(q -> q.revisionId().value().toString().equals(ids[1]))
            .findFirst()
            .orElseThrow();
    assertThat(published.options()).hasSize(2);

    assertThat(auditActions())
        .contains("QUESTION_REVISION_APPROVED", "QUESTION_REVISION_PUBLISHED");
  }

  @Test
  void learnerProjectionNeverContainsAnswerOrEditorialData() throws Exception {
    String[] ids = publishNew("Which option is correct?");
    PublishedQuestion published =
        bank.findPublished(new QuestionRevisionId(UUID.fromString(ids[1]))).orElseThrow();

    String serialized = json.writeValueAsString(published);

    assertThat(serialized).contains("Which option is correct?").contains("First");
    assertThat(serialized)
        .doesNotContainIgnoringCase("correct\"")
        .doesNotContainIgnoringCase("explanation")
        .doesNotContainIgnoringCase("Why A")
        .doesNotContainIgnoringCase("references")
        .doesNotContainIgnoringCase("jls-11")
        .doesNotContainIgnoringCase("author")
        .doesNotContainIgnoringCase("reviewer")
        .doesNotContainIgnoringCase("rationale")
        .doesNotContainIgnoringCase("status");
  }

  @Test
  void correctionReplacesThePublishedRevisionAndKeepsHistory() throws Exception {
    String[] ids = publishNew("Original wording");
    ResultActions corrected =
        send(post("/api/admin/questions/" + ids[0] + "/revisions"), editor, null)
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.revisions.length()").value(2))
            .andExpect(jsonPath("$.revisions[1].number").value(2))
            .andExpect(jsonPath("$.revisions[1].status").value("DRAFT"))
            .andExpect(jsonPath("$.revisions[1].prompt").value("Original wording"));
    String secondId = firstRevisionId(corrected, 1);
    send(put("/api/admin/question-revisions/" + secondId), editor, body("Corrected wording"))
        .andExpect(status().isOk());
    submit(secondId);
    approve(secondId);
    publish(secondId).andExpect(status().isOk());

    assertThat(statusOf(bank, ids[1])).isEqualTo(RevisionStatus.DEPRECATED);
    assertThat(statusOf(bank, secondId)).isEqualTo(RevisionStatus.PUBLISHED);
    List<String> eligible =
        bank.eligibleForTopic(new TopicId(UUID.fromString(TOPIC))).stream()
            .map(q -> q.revisionId().value().toString())
            .toList();
    assertThat(eligible).contains(secondId).doesNotContain(ids[1]);
    assertThat(bank.findPublished(new QuestionRevisionId(UUID.fromString(ids[1])))).isEmpty();

    // The historical revision is still retrievable, unchanged, for showing an old attempt.
    RevisionEvidence original =
        bank.findRevision(new QuestionRevisionId(UUID.fromString(ids[1]))).orElseThrow();
    assertThat(original.status()).isEqualTo(RevisionStatus.DEPRECATED);
    assertThat(original.prompt()).isEqualTo("Original wording");
    assertThat(original.options()).extracting(RevisionEvidence.Option::correct).contains(true);
    assertThat(original.references()).isNotEmpty();
    assertThat(auditActions()).contains("QUESTION_REVISION_REPLACED");
  }

  @Test
  void deprecatedRevisionsAreExcludedFromNewSelection() throws Exception {
    String[] ids = publishNew("Soon deprecated");

    send(post("/api/admin/question-revisions/" + ids[1] + "/deprecate"), admin, null)
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.revisions[0].status").value("DEPRECATED"));

    assertThat(
            bank.eligibleForTopic(new TopicId(UUID.fromString(TOPIC))).stream()
                .map(q -> q.revisionId().value().toString()))
        .doesNotContain(ids[1]);
    assertThat(bank.findRevision(new QuestionRevisionId(UUID.fromString(ids[1])))).isPresent();
    assertThat(auditActions()).contains("QUESTION_REVISION_DEPRECATED");
  }

  @Test
  void requestedChangesReturnTheRevisionToDraftWithTheReviewRecorded() throws Exception {
    String[] ids = createComplete("Needs work");
    submit(ids[1]);

    send(
            post("/api/admin/question-revisions/" + ids[1] + "/request-changes"),
            reviewer,
            "{\"comment\":\"Distractor B is ambiguous\"}")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.revisions[0].status").value("DRAFT"))
        .andExpect(jsonPath("$.revisions[0].reviews[0].decision").value("CHANGES_REQUESTED"))
        .andExpect(
            jsonPath("$.revisions[0].reviews[0].comment").value("Distractor B is ambiguous"));
    send(put("/api/admin/question-revisions/" + ids[1]), editor, body("Reworded"))
        .andExpect(status().isOk());
    send(post("/api/admin/question-revisions/" + ids[1] + "/request-changes"), reviewer, "{}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("validation_failed"));
  }

  // ---- who and what, as shown to editorial staff ----------------------------------------------

  private String emailOf(User user) {
    return jdbc.queryForObject(
        "select email from certforge.identity_account where id = ?", String.class, user.id());
  }

  @Test
  void staffSeeWhoWroteReviewedAndPublishedARevision() throws Exception {
    String[] ids = createComplete("Who did what");
    submit(ids[1]);
    send(
            post("/api/admin/question-revisions/" + ids[1] + "/approve"),
            reviewer,
            "{\"comment\":\"Checked\"}")
        .andExpect(status().isOk());
    publish(ids[1]).andExpect(status().isOk());

    send(get("/api/admin/questions/" + ids[0]), reviewer, null)
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.revisions[0].authorName").value(emailOf(editor)))
        .andExpect(jsonPath("$.revisions[0].reviews[0].reviewerName").value(emailOf(reviewer)))
        .andExpect(jsonPath("$.revisions[0].publishedByName").value("qb-admin@example.com"));
  }

  @Test
  void aRevisionNotYetPublishedHasNoPublisherName() throws Exception {
    String[] ids = createComplete("Not published");

    send(get("/api/admin/questions/" + ids[0]), editor, null)
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.revisions[0].authorName").value(emailOf(editor)))
        .andExpect(jsonPath("$.revisions[0].publishedByName").value(nullValue()));
  }

  @Test
  void aReviewRecordsTheChecklistItemsTheReviewerTicked() throws Exception {
    String[] approved = createComplete("Approved with a checklist");
    submit(approved[1]);
    send(
            post("/api/admin/question-revisions/" + approved[1] + "/approve"),
            reviewer,
            "{\"checklist\":[\"TECHNICAL_ACCURACY\",\"CODE_VERIFIED\",\"TECHNICAL_ACCURACY\"]}")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.revisions[0].reviews[0].checklist.length()").value(2))
        .andExpect(jsonPath("$.revisions[0].reviews[0].checklist[0]").value("TECHNICAL_ACCURACY"))
        .andExpect(jsonPath("$.revisions[0].reviews[0].checklist[1]").value("CODE_VERIFIED"));

    String[] returned = createComplete("Returned with a checklist");
    submit(returned[1]);
    send(
            post("/api/admin/question-revisions/" + returned[1] + "/request-changes"),
            reviewer,
            "{\"comment\":\"Fix B\",\"checklist\":[\"NO_AMBIGUITY\"]}")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.revisions[0].reviews[0].checklist[0]").value("NO_AMBIGUITY"));

    String[] bare = createComplete("Approved without a checklist");
    submit(bare[1]);
    approve(bare[1]);
    send(get("/api/admin/questions/" + bare[0]), reviewer, null)
        .andExpect(jsonPath("$.revisions[0].reviews[0].checklist.length()").value(0));
  }

  @Test
  void anUnknownChecklistItemIsRejectedAndNothingChanges() throws Exception {
    String[] ids = createComplete("Unknown item");
    submit(ids[1]);

    send(
            post("/api/admin/question-revisions/" + ids[1] + "/approve"),
            reviewer,
            "{\"checklist\":[\"LOOKS_GOOD_TO_ME\"]}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("invalid_checklist"));

    assertThat(statusOf(bank, ids[1])).isEqualTo(RevisionStatus.TECHNICAL_REVIEW);
    send(get("/api/admin/questions/" + ids[0]), reviewer, null)
        .andExpect(jsonPath("$.revisions[0].reviews.length()").value(0));
  }

  // ---- invariants ----------------------------------------------------------------------------

  @Test
  void incompleteDraftsCanBeSavedButNotSubmitted() throws Exception {
    ResultActions created =
        send(post("/api/admin/questions"), editor, "{\"type\":\"SINGLE_CHOICE\"}")
            .andExpect(status().isCreated());

    send(
            post("/api/admin/question-revisions/" + firstRevisionId(created, 0) + "/submit"),
            editor,
            null)
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("revision_incomplete"))
        .andExpect(
            jsonPath(
                "$.violations",
                org.hamcrest.Matchers.hasItems(
                    "prompt_missing", "topic_missing", "references_missing")));
  }

  @Test
  void answerInvariantsAreEnforcedBeforeReview() throws Exception {
    ResultActions two =
        send(
                post("/api/admin/questions"),
                editor,
                body("Two correct", "SINGLE_CHOICE", TOPIC, 21, true, true))
            .andExpect(status().isCreated());
    send(post("/api/admin/question-revisions/" + firstRevisionId(two, 0) + "/submit"), editor, null)
        .andExpect(status().isConflict())
        .andExpect(
            jsonPath(
                "$.violations[0]",
                org.hamcrest.Matchers.is("single_choice_requires_exactly_one_correct_option")));

    ResultActions none =
        send(
                post("/api/admin/questions"),
                editor,
                body("No correct", "MULTIPLE_CHOICE", TOPIC, 21, false, false))
            .andExpect(status().isCreated());
    send(
            post("/api/admin/question-revisions/" + firstRevisionId(none, 0) + "/submit"),
            editor,
            null)
        .andExpect(status().isConflict())
        .andExpect(
            jsonPath(
                "$.violations[0]",
                org.hamcrest.Matchers.is("multiple_choice_requires_a_correct_option")));
  }

  @Test
  void lifecycleTransitionsCannotBeSkipped() throws Exception {
    String[] ids = createComplete("Stage checks");

    publish(ids[1])
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("revision_not_approved"));
    send(post("/api/admin/question-revisions/" + ids[1] + "/approve"), reviewer, "{}")
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("revision_not_in_review"));
    send(post("/api/admin/question-revisions/" + ids[1] + "/deprecate"), admin, null)
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("revision_not_published"));

    submit(ids[1]);
    send(put("/api/admin/question-revisions/" + ids[1]), editor, body("Sneaky edit"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("revision_not_editable"));
    publish(ids[1]).andExpect(status().isConflict());
  }

  @Test
  void publishingRequiresAnActiveTopicAndTheExamsJavaRelease() throws Exception {
    String[] unknownTopic =
        publishableWith(
            body("Unknown topic", "SINGLE_CHOICE", UUID.randomUUID().toString(), 21, true, false));
    publish(unknownTopic[1])
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("topic_not_active"));

    String[] wrongRelease =
        publishableWith(body("Wrong release", "SINGLE_CHOICE", TOPIC, 17, true, false));
    publish(wrongRelease[1])
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("java_release_mismatch"));
  }

  /**
   * What ADR 0016 was for. Before decisions 1 and 6, a question on a track with no exam could not
   * be published at all: the publish path demanded an active exam version, and the completeness
   * rules demanded a Java release the question has no business stating.
   *
   * <p>The interview track is built with SQL because no endpoint creates one yet. That is the
   * honest state of the feature, and it is better to say so here than to leave the capability
   * claimed and unproven.
   */
  @Test
  void aQuestionOnAnInterviewTopicPublishesWithNoExamAndNoJavaRelease() throws Exception {
    UUID trackId = UUID.randomUUID();
    UUID versionId = UUID.randomUUID();
    UUID topicId = UUID.randomUUID();
    jdbc.update(
        "insert into certforge.catalog_track (id, slug, name, kind, status)"
            + " values (?, 'interview-"
            + UUID.randomUUID()
            + "', 'Java Backend', 'INTERVIEW',"
            + " 'ACTIVE')",
        trackId);
    jdbc.update(
        "insert into certforge.catalog_track_version (id, track_id, label, status)"
            + " values (?, ?, 'Taxonomy 1', 'ACTIVE')",
        versionId,
        trackId);
    jdbc.update(
        "insert into certforge.catalog_topic (id, track_id, slug, name)"
            + " values (?, ?, 'messaging', 'Messaging')",
        topicId,
        trackId);
    jdbc.update(
        "insert into certforge.catalog_track_version_topic"
            + " (track_version_id, topic_id, objective_ref, position, weight)"
            + " values (?, ?, null, 0, 3)",
        versionId,
        topicId);

    String noRelease =
        body(
                "How would you make a consumer idempotent?",
                "SINGLE_CHOICE",
                topicId.toString(),
                0,
                true,
                false)
            .replace(",\"javaRelease\":0", "");
    String[] ids = publishableWith(noRelease);

    publish(ids[1]).andExpect(status().isOk());
    assertThat(
            jdbc.queryForObject(
                "select track_version_id from certforge.qb_question_revision where id = ?",
                UUID.class,
                UUID.fromString(ids[1])))
        .as("published against the interview track's version, not an exam")
        .isEqualTo(versionId);
  }

  @Test
  void anInterviewQuestionIsRefusedAJavaRelease() throws Exception {
    UUID trackId = UUID.randomUUID();
    UUID topicId = UUID.randomUUID();
    jdbc.update(
        "insert into certforge.catalog_track (id, slug, name, kind, status)"
            + " values (?, 'interview-"
            + UUID.randomUUID()
            + "', 'Java Backend', 'INTERVIEW',"
            + " 'ACTIVE')",
        trackId);
    jdbc.update(
        "insert into certforge.catalog_topic (id, track_id, slug, name)"
            + " values (?, ?, 'messaging', 'Messaging')",
        topicId,
        trackId);

    ResultActions created =
        send(
                post("/api/admin/questions"),
                editor,
                body(
                    "Stating a release it has no business stating",
                    "SINGLE_CHOICE",
                    topicId.toString(),
                    21,
                    true,
                    false))
            .andExpect(status().isCreated());

    // Saving a draft is allowed; sending it for review is where completeness is checked, and the
    // release is refused rather than ignored.
    send(
            post("/api/admin/question-revisions/" + firstRevisionId(created, 0) + "/submit"),
            editor,
            null)
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("revision_incomplete"))
        .andExpect(
            jsonPath("$.violations", org.hamcrest.Matchers.hasItem("java_release_not_applicable")));
  }

  /** Creates, submits and approves a revision with the given body and returns its ids. */
  private String[] publishableWith(String requestBody) throws Exception {
    ResultActions created =
        send(post("/api/admin/questions"), editor, requestBody).andExpect(status().isCreated());
    String[] ids = {questionId(created), firstRevisionId(created, 0)};
    submit(ids[1]);
    approve(ids[1]);
    return ids;
  }

  @Test
  void onlyOneRevisionCanBeOpenAtATime() throws Exception {
    String[] ids = createComplete("Open draft");

    send(post("/api/admin/questions/" + ids[0] + "/revisions"), editor, null)
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("open_revision_exists"));
  }

  // ---- authorization and separation ----------------------------------------------------------

  @Test
  void eachStageRequiresItsOwnPermission() throws Exception {
    User learner = user();
    String[] ids = createComplete("Permission checks");
    String newQuestion = body("By someone else");

    send(post("/api/admin/questions"), null, newQuestion).andExpect(status().isUnauthorized());
    send(post("/api/admin/questions"), learner, newQuestion).andExpect(status().isForbidden());
    mvc.perform(get("/api/admin/questions").cookie(learner.session()))
        .andExpect(status().isForbidden());
    send(post("/api/admin/questions"), reviewer, newQuestion).andExpect(status().isForbidden());

    submit(ids[1]);
    send(post("/api/admin/question-revisions/" + ids[1] + "/approve"), editor, "{}")
        .andExpect(status().isForbidden());
    send(post("/api/admin/question-revisions/" + ids[1] + "/approve"), learner, "{}")
        .andExpect(status().isForbidden());
    approve(ids[1]);
    send(post("/api/admin/question-revisions/" + ids[1] + "/publish"), reviewer, null)
        .andExpect(status().isForbidden());
    send(post("/api/admin/question-revisions/" + ids[1] + "/publish"), editor, null)
        .andExpect(status().isForbidden());
    publish(ids[1]).andExpect(status().isOk());

    mvc.perform(get("/api/admin/questions/" + ids[0]).cookie(reviewer.session()))
        .andExpect(status().isOk());
  }

  @Test
  void onlyTheAuthorCanEditOrSubmitARevision() throws Exception {
    User otherEditor = user("EDITOR");
    String[] ids = createComplete("Mine");

    send(put("/api/admin/question-revisions/" + ids[1]), otherEditor, body("Hijacked"))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value("not_revision_author"));
    send(post("/api/admin/question-revisions/" + ids[1] + "/submit"), otherEditor, null)
        .andExpect(status().isForbidden());
  }

  @Test
  void authorCannotReviewTheirOwnRevision() throws Exception {
    User both = user("EDITOR", "REVIEWER");
    ResultActions created = send(post("/api/admin/questions"), both, body("Self review"));
    String revisionId = firstRevisionId(created, 0);
    send(post("/api/admin/question-revisions/" + revisionId + "/submit"), both, null)
        .andExpect(status().isOk());

    send(post("/api/admin/question-revisions/" + revisionId + "/approve"), both, "{}")
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value("reviewer_must_differ_from_author"));
  }

  // ---- database-level immutability -----------------------------------------------------------

  @Test
  void publishedRevisionsAreImmutableForEveryWriter() throws Exception {
    String[] ids = publishNew("Frozen content");
    UUID revision = UUID.fromString(ids[1]);

    assertThatThrownBy(
            () ->
                jdbc.update(
                    "update certforge.qb_question_revision set prompt = 'changed' where id = ?",
                    revision))
        .hasMessageContaining("immutable");
    assertThatThrownBy(
            () ->
                jdbc.update(
                    "update certforge.qb_revision_option set correct = not correct"
                        + " where revision_id = ?",
                    revision))
        .hasMessageContaining("immutable");
    assertThatThrownBy(
            () ->
                jdbc.update(
                    "insert into certforge.qb_revision_option"
                        + " (revision_id, option_key, position, text, correct)"
                        + " values (?, 'Z', 99, 'late', false)",
                    revision))
        .hasMessageContaining("immutable");
    assertThatThrownBy(
            () ->
                jdbc.update(
                    "delete from certforge.qb_revision_reference where revision_id = ?", revision))
        .hasMessageContaining("immutable");
    assertThatThrownBy(
            () -> jdbc.update("delete from certforge.qb_question_revision where id = ?", revision))
        .hasMessageContaining("cannot be deleted");

    RevisionEvidence stored = bank.findRevision(new QuestionRevisionId(revision)).orElseThrow();
    assertThat(stored.prompt()).isEqualTo("Frozen content");
  }

  @Test
  void contentIsFrozenAsSoonAsARevisionLeavesDraft() throws Exception {
    String[] ids = createComplete("Frozen in review");
    submit(ids[1]);

    assertThatThrownBy(
            () ->
                jdbc.update(
                    "update certforge.qb_question_revision set explanation = 'x' where id = ?",
                    UUID.fromString(ids[1])))
        .hasMessageContaining("immutable");
  }

  // ---- study-session support -----------------------------------------------------------------

  @Test
  void eligibleQuestionsMustBeBoundToTheTopicsCurrentExamVersion() throws Exception {
    String[] ids = publishNew("Bound to an exam version");
    TopicId topic = new TopicId(UUID.fromString(TOPIC));
    assertThat(bank.eligibleForTopic(topic))
        .extracting(q -> q.revisionId().value().toString())
        .contains(ids[1]);

    // Simulate the track version having been replaced since this revision was published.
    jdbc.update(
        "update certforge.qb_question_revision set track_version_id = ? where id = ?",
        UUID.randomUUID(),
        UUID.fromString(ids[1]));

    assertThat(bank.eligibleForTopic(topic))
        .extracting(q -> q.revisionId().value().toString())
        .doesNotContain(ids[1]);
    assertThat(bank.eligibleForTopic(new TopicId(UUID.randomUUID()))).isEmpty();
  }

  @Test
  void exactHistoricalRevisionsCanBeLoadedAsOneBatch() throws Exception {
    String[] first = publishNew("Bulk historical one");
    String[] second = publishNew("Bulk historical two");
    QuestionRevisionId firstId = new QuestionRevisionId(UUID.fromString(first[1]));
    QuestionRevisionId secondId = new QuestionRevisionId(UUID.fromString(second[1]));

    Map<QuestionRevisionId, RevisionEvidence> evidence =
        bank.findRevisions(Set.of(firstId, secondId));

    assertThat(evidence).containsOnlyKeys(firstId, secondId);
    assertThat(evidence.get(firstId).prompt()).isEqualTo("Bulk historical one");
    assertThat(evidence.get(secondId).prompt()).isEqualTo("Bulk historical two");
    assertThat(evidence.values())
        .allSatisfy(
            revision -> {
              assertThat(revision.options()).hasSize(2);
              assertThat(revision.references()).hasSize(1);
            });
  }

  @Test
  void snapshotQuestionsStayReadableAfterDeprecationButNeverForUnpublishedRevisions()
      throws Exception {
    String[] published = publishNew("Was published");
    String[] draft = createComplete("Never published");
    QuestionRevisionId publishedId = new QuestionRevisionId(UUID.fromString(published[1]));

    assertThat(bank.findSnapshotQuestion(publishedId)).isPresent();
    send(post("/api/admin/question-revisions/" + published[1] + "/deprecate"), admin, null)
        .andExpect(status().isOk());

    assertThat(bank.findPublished(publishedId)).isEmpty();
    var snapshot = bank.findSnapshotQuestion(publishedId);
    assertThat(snapshot).isPresent();
    assertThat(json.writeValueAsString(snapshot.orElseThrow()))
        .contains("Was published")
        .doesNotContainIgnoringCase("explanation")
        .doesNotContainIgnoringCase("correct\"");
    assertThat(bank.findSnapshotQuestion(new QuestionRevisionId(UUID.fromString(draft[1]))))
        .isEmpty();
  }
}
