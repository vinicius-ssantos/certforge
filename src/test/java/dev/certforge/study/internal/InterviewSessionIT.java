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
  private static String springTopicId;
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

    // A few more topics so a blueprint has something to weigh. "messaging" and "spring" carry
    // published questions, so a blueprint that weighs one above the other changes which questions a
    // session asks; the rest exist only to be weighted, which is what a blueprint does to a
    // taxonomy.
    for (String extra :
        List.of("concurrency", "spring", "testing", "system-design", "cloud-operations")) {
      UUID id = UUID.randomUUID();
      jdbc.update(
          "insert into certforge.catalog_topic (id, track_id, slug, name) values (?, ?, ?, ?)",
          id,
          track,
          extra,
          extra);
      jdbc.update(
          "insert into certforge.catalog_track_version_topic"
              + " (track_version_id, topic_id, objective_ref, position, weight)"
              + " values (?, ?, null, ?, 3)",
          version,
          id,
          1
              + List.of("concurrency", "spring", "testing", "system-design", "cloud-operations")
                  .indexOf(extra));
      if (extra.equals("spring")) {
        springTopicId = id.toString();
      }
    }

    objectiveRevision = publishObjective(topicId, "idempotent consumer");
    guidedRevision = publishGuided();
    publishObjective(springTopicId, "bean scope");
    publishObjective(springTopicId, "constructor injection");
  }

  private String publishObjective(String topic, String subject) throws Exception {
    String body =
        """
        {
          "type":"SINGLE_CHOICE",
          "topicId":"%s",
          "seniority":"SENIOR",
          "difficulty":"MEDIUM",
          "difficultyRationale":"One concept, asked directly",
          "prompt":"Which statement about %s is true?",
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
            .formatted(topic, subject);
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
    // Pinned to the topic that carries both kinds of item, rather than trusting the pool to hold
    // nothing else: another topic's questions exist so a blueprint has something to weigh.
    ResultActions started =
        startSession(
                "{\"trackSlug\":\""
                    + trackSlug
                    + "\",\"topicIds\":[\""
                    + topicId
                    + "\"],\"questionCount\":2}")
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

  /**
   * The learner saying what their own answer covered, which is a separate call because the concepts
   * are hidden until the answer is committed.
   */
  private ResultActions mark(String sessionId, int position, String body) throws Exception {
    return send(
        post("/api/study/interviews/" + sessionId + "/items/" + position + "/concepts"), body);
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

  // ---- what practice has shown (#23) ---------------------------------------------------------

  private ResultActions evidence() throws Exception {
    return send(get("/api/study/interviews/evidence?trackSlug=" + trackSlug), null);
  }

  /**
   * #23 asks for weakness evidence "rather than an opaque readiness score", and the strongest form
   * of that requirement is the absence: there is no score anywhere in this payload, and these
   * assertions are what keeps one from being added later without someone noticing.
   */
  @Test
  void evidenceCarriesNoScoreOfAnyKind() throws Exception {
    String sessionId = startBoth();
    int position = positionOf(sessionId, objectiveRevision);
    answer(
            sessionId,
            position,
            "evidence-none-01",
            "{\"selectedOptions\":[\"A\"],\"confidence\":\"HIGH\",\"elapsedMillis\":1000}")
        .andExpect(status().isCreated());

    String body =
        evidence().andExpect(status().isOk()).andReturn().getResponse().getContentAsString();

    assertThat(body)
        .doesNotContain("readiness")
        .doesNotContain("score")
        .doesNotContain("probability")
        .doesNotContain("percent")
        .doesNotContain("employab")
        .doesNotContain("hiring");
  }

  @Test
  void aConfidentMistakeAndAnUnsureSuccessAreToldApartAndCarryTheirResponses() throws Exception {
    String sessionId = startBoth();
    int position = positionOf(sessionId, objectiveRevision);
    // Sure and wrong: option B is the wrong one, and the learner said HIGH.
    answer(
            sessionId,
            position,
            "evidence-wrong-1",
            "{\"selectedOptions\":[\"B\"],\"confidence\":\"HIGH\",\"elapsedMillis\":1000}")
        .andExpect(status().isCreated());
    send(post("/api/study/interviews/" + sessionId + "/complete"), null).andExpect(status().isOk());

    // A second sitting, right but unsure.
    String second = startBoth();
    int secondPosition = positionOf(second, objectiveRevision);
    answer(
            second,
            secondPosition,
            "evidence-right-1",
            "{\"selectedOptions\":[\"A\"],\"confidence\":\"LOW\",\"elapsedMillis\":1000}")
        .andExpect(status().isCreated());

    evidence()
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.topics[0].objective.answered").value(2))
        .andExpect(jsonPath("$.topics[0].objective.correct").value(1))
        // The two cases a single accuracy figure would have hidden, each with the response behind
        // it so the learner can read what they answered rather than trust a count.
        .andExpect(jsonPath("$.topics[0].objective.sureAndWrong.length()").value(1))
        .andExpect(jsonPath("$.topics[0].objective.unsureAndRight.length()").value(1))
        // Named, not narrated: the interface is translated (ADR 0012), so the claim travels as a
        // kind and a count and the wording belongs to whoever is reading it.
        .andExpect(
            jsonPath("$.topics[0].signals[*].kind")
                .value(org.hamcrest.Matchers.hasItems("SURE_AND_WRONG", "UNSURE_AND_RIGHT")))
        .andExpect(
            jsonPath("$.topics[0].signals[?(@.kind=='SURE_AND_WRONG')].count")
                .value(org.hamcrest.Matchers.hasItem(1)));
  }

  @Test
  void aConceptTheLearnerSaysTheyMissedIsCountedWithTheReviewersOwnWords() throws Exception {
    String sessionId = startBoth();
    int position = positionOf(sessionId, guidedRevision);
    answer(
            sessionId,
            position,
            "evidence-guided1",
            "{\"selectedOptions\":[],\"confidence\":\"LOW\",\"elapsedMillis\":60000}")
        .andExpect(status().isCreated());
    // Said after reading what a reviewer expected, which is the only moment a learner can say it
    // honestly -- and the reason this is not a field on the answer above.
    mark(sessionId, position, "{\"coveredConcepts\":{\"0\":true,\"1\":false}}")
        .andExpect(status().isCreated());

    evidence()
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.topics[0].guided.practised").value(1))
        .andExpect(jsonPath("$.topics[0].guided.conceptsMarkedMissed.length()").value(1))
        // The reviewer's own wording for the concept, not a label this product invented.
        .andExpect(
            jsonPath("$.topics[0].guided.conceptsMarkedMissed[0].text")
                .value("durable duplicate detection"))
        .andExpect(jsonPath("$.topics[0].guided.conceptsMarkedMissed[0].times").value(1))
        .andExpect(
            jsonPath("$.topics[0].guided.conceptsMarkedMissed[0].responses.length()").value(1))
        // Said by the learner, about their own answer, and the signal carries the reviewer's own
        // wording for the concept rather than a label this product invented.
        .andExpect(
            jsonPath("$.topics[0].signals[?(@.kind=='CONCEPT_MARKED_MISSED')].concept")
                .value(org.hamcrest.Matchers.hasItem("durable duplicate detection")));
  }

  @Test
  void rebuildingTheEvidenceGivesTheSameAnswer() throws Exception {
    String sessionId = startBoth();
    answer(
            sessionId,
            positionOf(sessionId, guidedRevision),
            "evidence-stable1",
            "{\"selectedOptions\":[],\"confidence\":\"MEDIUM\",\"elapsedMillis\":1000}")
        .andExpect(status().isCreated());
    mark(sessionId, positionOf(sessionId, guidedRevision), "{\"coveredConcepts\":{\"1\":false}}")
        .andExpect(status().isCreated());
    answer(
            sessionId,
            positionOf(sessionId, objectiveRevision),
            "evidence-stable2",
            "{\"selectedOptions\":[\"B\"],\"confidence\":\"HIGH\",\"elapsedMillis\":1000}")
        .andExpect(status().isCreated());

    // Nothing is stored: #23 asks that rebuilding a projection yield the same result, and it is
    // derived from the responses every time it is asked, so two calls cannot disagree.
    String first = evidence().andReturn().getResponse().getContentAsString();
    String again = evidence().andReturn().getResponse().getContentAsString();
    assertThat(again).isEqualTo(first);
  }

  @Test
  void marksAreRefusedWhenTheyAreAboutSomethingTheQuestionDoesNotList() throws Exception {
    String sessionId = startBoth();
    int guided = positionOf(sessionId, guidedRevision);
    int objective = positionOf(sessionId, objectiveRevision);

    answer(
            sessionId,
            guided,
            "evidence-bad-con1",
            "{\"selectedOptions\":[],\"confidence\":\"LOW\",\"elapsedMillis\":1000}")
        .andExpect(status().isCreated());
    mark(sessionId, guided, "{\"coveredConcepts\":{\"7\":false}}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("unknown_expected_concept"));

    // And an objective question has options, not concepts: marking one is a category error, and
    // accepting it would record a statement about a question that has nothing to state it about.
    answer(
            sessionId,
            objective,
            "evidence-bad-con2",
            "{\"selectedOptions\":[\"A\"],\"confidence\":\"LOW\",\"elapsedMillis\":1000}")
        .andExpect(status().isCreated());
    mark(sessionId, objective, "{\"coveredConcepts\":{\"0\":true}}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("objective_item_has_no_concepts"));
  }

  /**
   * The marks are about an answer, so there has to be one; and once said, they stand. Both are what
   * makes the evidence rebuildable: a count of what a learner said is only honest if nothing can be
   * said about an answer that does not exist, or said twice about one that does.
   */
  @Test
  void marksNeedAnAnswerFirstAndAreSaidOnlyOnce() throws Exception {
    String sessionId = startBoth();
    int guided = positionOf(sessionId, guidedRevision);

    mark(sessionId, guided, "{\"coveredConcepts\":{\"0\":true}}")
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("item_not_answered_yet"));

    answer(
            sessionId,
            guided,
            "evidence-once-1",
            "{\"selectedOptions\":[],\"confidence\":\"LOW\",\"elapsedMillis\":1000}")
        .andExpect(status().isCreated());
    mark(sessionId, guided, "{\"coveredConcepts\":{\"0\":true}}").andExpect(status().isCreated());
    mark(sessionId, guided, "{\"coveredConcepts\":{\"0\":false}}")
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("concepts_already_marked"));

    // The first word stands, and the evidence still says what was said the first time.
    evidence()
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.topics[0].guided.conceptsMarkedMissed.length()").value(0));
  }

  @Test
  void aTopicNeverPractisedIsAbsentRatherThanReportedAsZero() throws Exception {
    // A learner who has practised nothing: no topics at all, rather than a row of zeroes that
    // would read as evidence of weakness where there is no evidence.
    evidence().andExpect(status().isOk()).andExpect(jsonPath("$.topics.length()").value(0));
  }

  @Test
  void selfAssessmentIsImmutableOnceRecorded() throws Exception {
    String sessionId = startBoth();
    answer(
            sessionId,
            positionOf(sessionId, guidedRevision),
            "evidence-frozen1",
            "{\"selectedOptions\":[],\"confidence\":\"LOW\",\"elapsedMillis\":1000}")
        .andExpect(status().isCreated());
    mark(sessionId, positionOf(sessionId, guidedRevision), "{\"coveredConcepts\":{\"0\":false}}")
        .andExpect(status().isCreated());

    // A weakness signal is only rebuildable if what it was built from cannot be rewritten.
    assertThat(
            org.assertj.core.api.Assertions.catchThrowable(
                () ->
                    jdbc.update(
                        "update certforge.interview_response_concept set covered = true"
                            + " where covered = false")))
        .isNotNull();
  }

  // ---- the job-description blueprint (#22) ---------------------------------------------------

  private static final String ADVERT =
      "Senior Java engineer. You will work with Spring Boot and Kafka, design for scalability,"
          + " and care about testing. Experience with Kubernetes is a plus.";

  private ResultActions createBlueprint(String body) throws Exception {
    return send(post("/api/study/interviews/blueprints"), body);
  }

  private String blueprintFrom(String body) throws Exception {
    return JsonPath.read(
        createBlueprint(body)
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString(),
        "$.id");
  }

  @Test
  void everyWeightCanBeExplainedByAWordFromTheAdvert() throws Exception {
    String body =
        "{\"trackSlug\":\""
            + trackSlug
            + "\",\"jobTitle\":\"Senior Java engineer\","
            + "\"sourceText\":\""
            + ADVERT
            + "\"}";

    createBlueprint(body)
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.jobTitle").value("Senior Java engineer"))
        // Spring was named twice in the advert — "Spring Boot" is also the term "spring" — so it
        // weighs more than a topic mentioned once, and both words are in the payload.
        .andExpect(
            jsonPath("$.topics[?(@.topicSlug=='spring')].matchedTerms[*].term")
                .value(org.hamcrest.Matchers.hasItems("spring", "spring boot")))
        .andExpect(
            jsonPath("$.topics[?(@.topicSlug=='messaging')].matchedTerms[*].term")
                .value(org.hamcrest.Matchers.hasItem("kafka")))
        .andExpect(
            jsonPath("$.topics[?(@.topicSlug=='messaging')].source")
                .value(org.hamcrest.Matchers.hasItem("MATCHED")))
        // Every topic in the blueprint has at least one term behind it: a weight with no source
        // would be exactly the opaque weighting #22 defers.
        .andExpect(
            jsonPath("$.topics[?(@.matchedTerms.length() == 0 && @.source == 'MATCHED')]")
                .value(org.hamcrest.Matchers.empty()));
  }

  @Test
  void aTopicTheAdvertNeverMentionsIsNotInTheBlueprintAtAll() throws Exception {
    String body = "{\"trackSlug\":\"" + trackSlug + "\",\"sourceText\":\"We use Kafka.\"}";

    createBlueprint(body)
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.topics.length()").value(1))
        .andExpect(jsonPath("$.topics[0].topicSlug").value("messaging"));
  }

  @Test
  void aRequirementNobodyRecognisesIsSurfacedRatherThanGuessedAt() throws Exception {
    String body =
        "{\"trackSlug\":\""
            + trackSlug
            + "\",\"sourceText\":\"Backend role.\","
            + "\"requirements\":[\"Kafka\",\"Fluency in Klingon\",\"Our in-house FooBar framework\"]}";

    createBlueprint(body)
        .andExpect(status().isCreated())
        // What was understood is weighted; what was not is named back to the learner, so they can
        // weigh it themselves instead of the product pretending to know what it means.
        .andExpect(
            jsonPath("$.topics[?(@.topicSlug=='messaging')].matchedTerms[*].foundIn")
                .value(org.hamcrest.Matchers.hasItem("REQUIREMENT")))
        .andExpect(
            jsonPath("$.unrecognisedRequirements")
                .value(
                    org.hamcrest.Matchers.containsInAnyOrder(
                        "Fluency in Klingon", "Our in-house FooBar framework")));
  }

  @Test
  void aLearnerWeightIsRecordedAsTheirsAndNotAsSomethingTheAdvertSaid() throws Exception {
    String concurrency = topicIdOf("concurrency");
    String body =
        "{\"trackSlug\":\""
            + trackSlug
            + "\",\"sourceText\":\"We use Kafka.\","
            + "\"weights\":{\""
            + concurrency
            + "\":5}}";

    createBlueprint(body)
        .andExpect(status().isCreated())
        .andExpect(
            jsonPath("$.topics[?(@.topicSlug=='concurrency')].weight")
                .value(org.hamcrest.Matchers.hasItem(5)))
        // The advert never mentioned concurrency, and the blueprint says who did.
        .andExpect(
            jsonPath("$.topics[?(@.topicSlug=='concurrency')].source")
                .value(org.hamcrest.Matchers.hasItem("LEARNER")))
        .andExpect(
            jsonPath("$.topics[?(@.topicSlug=='concurrency')].matchedTerms")
                .value(org.hamcrest.Matchers.contains(org.hamcrest.Matchers.empty())));
  }

  @Test
  void aBlueprintSaysNothingAboutTheLearner() throws Exception {
    String id =
        blueprintFrom("{\"trackSlug\":\"" + trackSlug + "\",\"sourceText\":\"" + ADVERT + "\"}");
    String body =
        send(get("/api/study/interviews/blueprints/" + id), null)
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

    // #22 defers hiring probability and forbids fabricated experience. The absence is the feature.
    assertThat(body)
        .doesNotContain("fit")
        .doesNotContain("probability")
        .doesNotContain("readiness")
        .doesNotContain("score")
        .doesNotContain("experience");
  }

  @Test
  void aBlueprintIsReproducibleFromItsSavedInputs() throws Exception {
    String body =
        "{\"trackSlug\":\""
            + trackSlug
            + "\",\"sourceText\":\""
            + ADVERT
            + "\","
            + "\"requirements\":[\"Kubernetes\"]}";
    String first = blueprintFrom(body);
    String second = blueprintFrom(body);

    String one = topicsAndTermsOf(first);
    String two = topicsAndTermsOf(second);
    // The same inputs through the same reviewed dictionary give the same mapping, which is what
    // makes a blueprint something a learner can be shown rather than asked to trust.
    assertThat(two).isEqualTo(one);
  }

  @Test
  void theCanonicalTaxonomyIsUntouchedByABlueprint() throws Exception {
    Integer before =
        jdbc.queryForObject(
            "select count(*) from certforge.catalog_track_version_topic", Integer.class);
    Integer canonical = canonicalWeightOf("concurrency");
    blueprintFrom(
        "{\"trackSlug\":\""
            + trackSlug
            + "\",\"sourceText\":\""
            + ADVERT
            + "\","
            + "\"weights\":{\""
            + topicIdOf("concurrency")
            + "\":5}}");

    // A blueprint weighs the taxonomy for one learner; it never edits it for everyone. The first
    // version of this assertion looked for any row of weight 5 and found four — the seeded
    // taxonomy uses that scale itself, which is the point of keeping the two apart.
    assertThat(
            jdbc.queryForObject(
                "select count(*) from certforge.catalog_track_version_topic", Integer.class))
        .isEqualTo(before);
    assertThat(canonicalWeightOf("concurrency")).isEqualTo(canonical);
  }

  @Test
  void aBlueprintChoosesTheTopicsOfASessionAndCannotBeCombinedWithAList() throws Exception {
    String id =
        blueprintFrom("{\"trackSlug\":\"" + trackSlug + "\",\"sourceText\":\"We use Kafka.\"}");

    // Two answers to the same question: the learner would not know which was used.
    startSession(
            "{\"trackSlug\":\""
                + trackSlug
                + "\",\"blueprintId\":\""
                + id
                + "\","
                + "\"topicIds\":[\""
                + topicId
                + "\"]}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("blueprint_and_topics"));

    startSession(
            "{\"trackSlug\":\""
                + trackSlug
                + "\",\"blueprintId\":\""
                + id
                + "\",\"questionCount\":2}")
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.items.length()").value(2));
  }

  @Test
  void aWordyAdvertIsStillWeighedOnTheScaleTheTaxonomyUses() throws Exception {
    // Seven Spring terms in one advert, and the scale only goes to five. Capping is not cosmetic:
    // the table refuses a weight outside 1..5, so without it this advert would be a server error.
    String body =
        "{\"trackSlug\":\""
            + trackSlug
            + "\",\"sourceText\":\"Spring, Spring Boot, Spring MVC, Spring Security, Spring Data,"
            + " Spring Framework and WebFlux.\"}";

    createBlueprint(body)
        .andExpect(status().isCreated())
        .andExpect(
            jsonPath("$.topics[?(@.topicSlug=='spring')].weight")
                .value(org.hamcrest.Matchers.hasItem(5)))
        // The cap hides nothing: all seven terms are still named, so the learner sees that the
        // advert said more than the scale can express.
        .andExpect(
            jsonPath("$.topics[?(@.topicSlug=='spring')].matchedTerms.length()")
                .value(org.hamcrest.Matchers.hasItem(7)));
  }

  @Test
  void theHeavierTopicIsWhatASessionActuallyAsksAbout() throws Exception {
    // Spring is named twice in this advert and Kafka once, so Spring weighs more. The pool holds
    // four questions across the two topics and each session asks for two.
    String id =
        blueprintFrom(
            "{\"trackSlug\":\""
                + trackSlug
                + "\",\"sourceText\":\"We use Spring Boot, the Spring ecosystem, and Kafka.\"}");

    // Drawn repeatedly on purpose. One draw proves nothing: a shuffle that ignored the weight
    // entirely would still hand back two Spring questions about one time in six, and a test that
    // passes one time in six is a test that passes by luck. Five draws in a row is the weight.
    for (int draw = 0; draw < 5; draw++) {
      String body =
          startSession(
                  "{\"trackSlug\":\""
                      + trackSlug
                      + "\",\"blueprintId\":\""
                      + id
                      + "\",\"questionCount\":2}")
              .andExpect(status().isCreated())
              .andExpect(jsonPath("$.items.length()").value(2))
              .andReturn()
              .getResponse()
              .getContentAsString();

      assertThat(JsonPath.<List<String>>read(body, "$.items[*].topicId"))
          .as("draw %d asked about the topic the advert barely mentioned", draw)
          .containsExactly(springTopicId, springTopicId);

      send(post("/api/study/interviews/" + JsonPath.read(body, "$.id") + "/abandon"), null)
          .andExpect(status().isOk());
    }
  }

  @Test
  void aBlueprintBuiltForAnotherTaxonomyIsRefusedRatherThanAppliedToThisOne() throws Exception {
    // Two interview tracks, each with its own taxonomy. A blueprint names topic ids, and those ids
    // mean nothing in another track: applied there it would weigh topics that do not exist, so the
    // session would be drawn from nothing. Refusing says which of the two inputs is wrong.
    String otherTrack = seedSecondInterviewTrack();
    String id =
        blueprintFrom("{\"trackSlug\":\"" + otherTrack + "\",\"sourceText\":\"We use Kafka.\"}");

    startSession("{\"trackSlug\":\"" + trackSlug + "\",\"blueprintId\":\"" + id + "\"}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("blueprint_of_another_track"));
  }

  @Test
  void aBlueprintThatMatchedNothingCannotStartASession() throws Exception {
    // An advert the dictionary recognises nothing in still produces a blueprint — it records what
    // was read — but there is nothing to practise from it, and saying so beats an empty session.
    String id =
        blueprintFrom(
            "{\"trackSlug\":\"" + trackSlug + "\",\"sourceText\":\"We are hiring someone nice.\"}");

    startSession("{\"trackSlug\":\"" + trackSlug + "\",\"blueprintId\":\"" + id + "\"}")
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("blueprint_weighs_nothing"));
  }

  /** A second active interview track, so a blueprint can be built for the wrong taxonomy. */
  private String seedSecondInterviewTrack() {
    UUID track = UUID.randomUUID();
    UUID version = UUID.randomUUID();
    UUID topic = UUID.randomUUID();
    String slug = "interview-other-" + UUID.randomUUID();
    jdbc.update(
        "insert into certforge.catalog_track (id, slug, name, kind, status)"
            + " values (?, ?, 'Another interview', 'INTERVIEW', 'ACTIVE')",
        track,
        slug);
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
    return slug;
  }

  @Test
  void aBlueprintOfAnotherLearnerIsNotFound() throws Exception {
    String id =
        blueprintFrom("{\"trackSlug\":\"" + trackSlug + "\",\"sourceText\":\"We use Kafka.\"}");
    learner = fixtures.user();

    send(get("/api/study/interviews/blueprints/" + id), null)
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("blueprint_not_found"));
  }

  /** The canonical weight the taxonomy gives a topic, which a blueprint must never change. */
  private Integer canonicalWeightOf(String slug) {
    return jdbc.queryForObject(
        "select tvt.weight from certforge.catalog_track_version_topic tvt"
            + " join certforge.catalog_topic t on t.id = tvt.topic_id"
            + " join certforge.catalog_track tr on tr.id = t.track_id"
            + " where tr.slug = ? and t.slug = ?",
        Integer.class,
        trackSlug,
        slug);
  }

  private String topicIdOf(String slug) {
    return jdbc.queryForObject(
        "select t.id::text from certforge.catalog_topic t"
            + " join certforge.catalog_track_version_topic tvt on tvt.topic_id = t.id"
            + " join certforge.catalog_track_version tv on tv.id = tvt.track_version_id"
            + " join certforge.catalog_track tr on tr.id = tv.track_id"
            + " where tr.slug = ? and t.slug = ?",
        String.class,
        trackSlug,
        slug);
  }

  private String topicsAndTermsOf(String blueprintId) throws Exception {
    String body =
        send(get("/api/study/interviews/blueprints/" + blueprintId), null)
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    return JsonPath.read(body, "$.topics[*].topicSlug").toString()
        + JsonPath.read(body, "$.topics[*].weight").toString()
        + JsonPath.read(body, "$.topics[*].matchedTerms[*].term").toString();
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
