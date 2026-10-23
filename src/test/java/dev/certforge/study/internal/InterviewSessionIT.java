package dev.certforge.study.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.certforge.support.EditorialFixtures;
import dev.certforge.support.EditorialFixtures.Account;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

/**
 * Interview sessions: the third study aggregate (ADR 0020).
 *
 * <p>What these tests are really about is that two kinds of item live in one session without their
 * evaluation being conflated. An objective item is graded; a guided item is not graded by anything,
 * and the proof is that there is nowhere for a score to be — not in the response row, not in the
 * payload, not in the database, which refuses to store one.
 */
@SpringBootTest(
    properties = {
      "certforge.identity.bootstrap-admin.email=interview-admin@example.com",
      "certforge.identity.bootstrap-admin.password=correct horse battery"
    })
@AutoConfigureMockMvc
@Testcontainers
class InterviewSessionIT {

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired MockMvc mvc;
  @Autowired JdbcTemplate jdbc;

  private static EditorialFixtures fixtures;
  private static String trackSlug;
  private static String topicId;
  private static String objectiveRevision;
  private static String guidedRevision;
  private Account learner;

  @BeforeEach
  void prepare() throws Exception {
    synchronized (InterviewSessionIT.class) {
      if (fixtures == null) {
        fixtures = new EditorialFixtures(mvc, "interview-admin@example.com");
        seedInterviewTrack();
      }
    }
    learner = fixtures.user();
  }

  /**
   * An active interview track with one topic, one objective question and one guided question.
   *
   * <p>Built with SQL rather than through the catalog API because the admin API creates
   * certification tracks; an interview taxonomy is seeded, exactly as the other interview tests in
   * this repository do it.
   */
  private void seedInterviewTrack() throws Exception {
    UUID track = UUID.randomUUID();
    UUID version = UUID.randomUUID();
    UUID topic = UUID.randomUUID();
    trackSlug = "interview-sessions-" + UUID.randomUUID();
    jdbc.update(
        "insert into certforge.catalog_track (id, slug, name, kind, status)"
            + " values (?, ?, 'Java Backend interview', 'INTERVIEW', 'ACTIVE')",
        track,
        trackSlug);
    jdbc.update(
        "insert into certforge.catalog_track_version (id, track_id, label, status)"
            + " values (?, ?, 'Taxonomy 1', 'ACTIVE')",
        version,
        track);
    jdbc.update(
        "insert into certforge.catalog_topic (id, track_id, slug, name)"
            + " values (?, ?, 'messaging', 'Messaging')",
        topic,
        track);
    jdbc.update(
        "insert into certforge.catalog_track_version_topic"
            + " (track_version_id, topic_id, objective_ref, position, weight)"
            + " values (?, ?, null, 0, 3)",
        version,
        topic);
    topicId = topic.toString();

    objectiveRevision = publishObjective();
    guidedRevision = publishGuided();
  }

  private String publishObjective() throws Exception {
    String body =
        """
        {
          "type":"SINGLE_CHOICE",
          "topicId":"%s",
          "seniority":"SENIOR",
          "difficulty":"MEDIUM",
          "difficultyRationale":"One concept, asked directly",
          "prompt":"Which statement about an idempotent consumer is true?",
          "explanation":"Secret overall explanation",
          "options":[
            {"key":"A","text":"It can process the same message twice safely","correct":true,
             "explanation":"Secret why A"},
            {"key":"B","text":"It needs exactly-once delivery from the broker","correct":false,
             "explanation":"Secret why B"}
          ],
          "references":[{"title":"Enterprise Integration Patterns",
                         "url":"https://www.enterpriseintegrationpatterns.com/"}]
        }
        """
            .formatted(topicId);
    return fixtures.publishBody(body).revisionId();
  }

  private String publishGuided() throws Exception {
    String body =
        """
        {
          "type":"GUIDED_RESPONSE",
          "topicId":"%s",
          "seniority":"SENIOR",
          "difficulty":"HARD",
          "difficultyRationale":"Requires reasoning about retries and durable state",
          "prompt":"How would you make a message consumer idempotent?",
          "guidedResponse":{
            "referenceAnswer":"Use a stable key and atomically persist duplicate detection with the business effect.",
            "expectedConcepts":[
              {"text":"stable idempotency key","required":true,"explanation":"Duplicates need the same identity."},
              {"text":"durable duplicate detection","required":false,"explanation":"Memory alone is insufficient."}
            ],
            "commonMistakes":["Treating broker delivery guarantees as business idempotency."],
            "followUps":["What changes when the side effect is in another service?"]
          },
          "references":[{"title":"Enterprise Integration Patterns",
                         "url":"https://www.enterpriseintegrationpatterns.com/"}]
        }
        """
            .formatted(topicId);
    return fixtures.publishBody(body).revisionId();
  }

  // ---- helpers -------------------------------------------------------------------------------

  private ResultActions send(MockHttpServletRequestBuilder request, String body) throws Exception {
    request.with(csrf()).cookie(learner.session());
    if (body != null) {
      request.contentType(MediaType.APPLICATION_JSON).content(body);
    }
    return mvc.perform(request);
  }

  private ResultActions startSession(String body) throws Exception {
    return send(post("/api/study/interviews"), body);
  }

  private String startBoth() throws Exception {
    ResultActions started =
        startSession("{\"trackSlug\":\"" + trackSlug + "\",\"questionCount\":2}")
            .andExpect(status().isCreated());
    return JsonPath.read(started.andReturn().getResponse().getContentAsString(), "$.id");
  }

  private int positionOf(String sessionId, String revisionId) throws Exception {
    String body =
        send(get("/api/study/interviews/" + sessionId), null)
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    List<Integer> positions =
        JsonPath.read(body, "$.items[?(@.question.revisionId=='" + revisionId + "')].position");
    assertThat(positions).hasSize(1);
    return positions.get(0);
  }

  private ResultActions answer(String sessionId, int position, String key, String body)
      throws Exception {
    MockHttpServletRequestBuilder request =
        post("/api/study/interviews/" + sessionId + "/items/" + position + "/answer");
    request.header("Idempotency-Key", key);
    return send(request, body);
  }

  // ---- the session ---------------------------------------------------------------------------

  @Test
  void aSessionMixesObjectiveAndGuidedItemsAndRevealsNothingBeforeAnAnswer() throws Exception {
    String sessionId = startBoth();

    String body =
        send(get("/api/study/interviews/" + sessionId), null)
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
            .andExpect(jsonPath("$.items.length()").value(2))
            .andReturn()
            .getResponse()
            .getContentAsString();

    // Both kinds are in one session, and the guided one carries no options rather than an empty
    // set that some other flow might grade.
    List<String> types = JsonPath.read(body, "$.items[*].question.type");
    assertThat(types).containsExactlyInAnyOrder("SINGLE_CHOICE", "GUIDED_RESPONSE");

    // Objective privacy is unchanged: nothing about any answer is in the payload yet.
    assertThat(body).doesNotContain("Secret").doesNotContain("correct");
    assertThat(body).doesNotContain("Use a stable key");
  }

  @Test
  void anObjectiveItemIsGradedAndHandsBackTheAnswerMaterial() throws Exception {
    String sessionId = startBoth();
    int position = positionOf(sessionId, objectiveRevision);

    answer(
            sessionId,
            position,
            "objective-key-0001",
            "{\"selectedOptions\":[\"A\"],\"confidence\":\"HIGH\",\"elapsedMillis\":4200}")
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.itemKind").value("OBJECTIVE"))
        .andExpect(jsonPath("$.objective.correct").value(true))
        .andExpect(jsonPath("$.objective.correctOptions[0]").value("A"))
        .andExpect(jsonPath("$.objective.explanation").value("Secret overall explanation"))
        .andExpect(jsonPath("$.objective.options[0].explanation").value("Secret why A"))
        // The guided half of the payload is absent, not empty: a client reading it finds null
        // rather than something that could be mistaken for a verdict.
        .andExpect(jsonPath("$.guided").value(org.hamcrest.Matchers.nullValue()));
  }

  @Test
  void aGuidedItemIsRecordedAndScoredByNothing() throws Exception {
    String sessionId = startBoth();
    int position = positionOf(sessionId, guidedRevision);

    answer(
            sessionId,
            position,
            "guided-key-000001",
            "{\"selectedOptions\":[],\"confidence\":\"LOW\",\"elapsedMillis\":90000}")
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.itemKind").value("GUIDED"))
        // What a reviewer wrote down, which is the help that exists.
        .andExpect(
            jsonPath("$.guided.referenceAnswer")
                .value(
                    "Use a stable key and atomically persist duplicate detection with the business"
                        + " effect."))
        .andExpect(jsonPath("$.guided.expectedConcepts[0].text").value("stable idempotency key"))
        .andExpect(jsonPath("$.guided.expectedConcepts[0].required").value(true))
        .andExpect(
            jsonPath("$.guided.commonMistakes[0]")
                .value("Treating broker delivery guarantees as business idempotency."))
        // The follow-up a reviewer would ask next, tied to this revision and shown only now.
        .andExpect(
            jsonPath("$.guided.followUps[0]")
                .value("What changes when the side effect is in another service?"))
        // And no verdict of any kind.
        .andExpect(jsonPath("$.objective").value(org.hamcrest.Matchers.nullValue()));

    // Not in the payload, and not in the database either: the row has no correctness to carry.
    assertThat(
            jdbc.queryForObject(
                "select correct is null and selected_options is null"
                    + " from certforge.interview_response where session_id = ?::uuid",
                Boolean.class,
                sessionId))
        .isTrue();
  }

  @Test
  void sendingOptionsToAGuidedItemIsRefusedRatherThanIgnored() throws Exception {
    String sessionId = startBoth();
    int position = positionOf(sessionId, guidedRevision);

    // Ignoring the selection would leave a learner believing it meant something.
    answer(
            sessionId,
            position,
            "guided-with-opts1",
            "{\"selectedOptions\":[\"A\"],\"confidence\":\"HIGH\",\"elapsedMillis\":1000}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("guided_item_takes_no_options"));
  }

  @Test
  void answeringTwiceWithTheSameKeyReplaysAndWithAnotherKeyIsRefused() throws Exception {
    String sessionId = startBoth();
    int position = positionOf(sessionId, guidedRevision);
    String body = "{\"selectedOptions\":[],\"confidence\":\"MEDIUM\",\"elapsedMillis\":30000}";

    answer(sessionId, position, "replay-key-00001", body).andExpect(status().isCreated());
    answer(sessionId, position, "replay-key-00001", body).andExpect(status().isCreated());
    answer(sessionId, position, "another-key-0001", body)
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("question_already_answered"));

    assertThat(
            jdbc.queryForObject(
                "select count(*) from certforge.interview_response where session_id = ?::uuid",
                Integer.class,
                sessionId))
        .isEqualTo(1);
  }

  @Test
  void aSessionIsReproducibleFromItsOwnEvidenceAndNotRewrittenByLaterEdits() throws Exception {
    String sessionId = startBoth();
    List<String> before =
        JsonPath.read(
            send(get("/api/study/interviews/" + sessionId), null)
                .andReturn()
                .getResponse()
                .getContentAsString(),
            "$.items[*].question.revisionId");

    // The snapshot is frozen by the database, not merely by convention.
    assertThat(
            org.assertj.core.api.Assertions.catchThrowable(
                () ->
                    jdbc.update(
                        "update certforge.interview_session_question set position = position + 10"
                            + " where session_id = ?::uuid",
                        sessionId)))
        .isNotNull();

    List<String> after =
        JsonPath.read(
            send(get("/api/study/interviews/" + sessionId), null)
                .andReturn()
                .getResponse()
                .getContentAsString(),
            "$.items[*].question.revisionId");
    assertThat(after).isEqualTo(before);
  }

  @Test
  void interviewPracticeDoesNotTouchCertificationEvidence() throws Exception {
    String sessionId = startBoth();
    int position = positionOf(sessionId, objectiveRevision);
    answer(
            sessionId,
            position,
            "no-progress-0001",
            "{\"selectedOptions\":[\"A\"],\"confidence\":\"HIGH\",\"elapsedMillis\":1000}")
        .andExpect(status().isCreated());

    // Not one study attempt, which is what every progress and readiness projection reads.
    assertThat(
            jdbc.queryForObject(
                "select count(*) from certforge.study_attempt where learner_id = ?::uuid",
                Integer.class,
                learner.id()))
        .isZero();
  }

  @Test
  void oneSessionPerTrackAtATimeAndClosingItFreesTheSlot() throws Exception {
    String sessionId = startBoth();

    startSession("{\"trackSlug\":\"" + trackSlug + "\",\"questionCount\":2}")
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("active_interview_session_exists"));

    send(post("/api/study/interviews/" + sessionId + "/abandon"), null)
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("ABANDONED"));
    // Closing twice answers the same thing rather than failing.
    send(post("/api/study/interviews/" + sessionId + "/abandon"), null)
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("ABANDONED"));

    startSession("{\"trackSlug\":\"" + trackSlug + "\",\"questionCount\":2}")
        .andExpect(status().isCreated());
  }

  @Test
  void aClosedSessionTakesNoMoreAnswers() throws Exception {
    String sessionId = startBoth();
    int position = positionOf(sessionId, guidedRevision);
    send(post("/api/study/interviews/" + sessionId + "/complete"), null)
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("COMPLETED"));

    answer(
            sessionId,
            position,
            "after-close-0001",
            "{\"selectedOptions\":[],\"confidence\":\"LOW\",\"elapsedMillis\":1000}")
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("session_not_in_progress"));
  }

  @Test
  void aTopicOutsideTheTrackIsRefusedAndAnUnknownTrackIsNotFound() throws Exception {
    startSession(
            "{\"trackSlug\":\""
                + trackSlug
                + "\",\"topicIds\":[\"a3000000-0000-4000-8000-000000000004\"]}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("topic_not_in_track"));

    startSession("{\"trackSlug\":\"does-not-exist\"}")
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("interview_track_not_found"));
  }

  @Test
  void anotherLearnersSessionIsNotFoundRatherThanForbidden() throws Exception {
    String sessionId = startBoth();
    learner = fixtures.user();

    send(get("/api/study/interviews/" + sessionId), null)
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("interview_session_not_found"));
  }
}
