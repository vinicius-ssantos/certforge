package dev.certforge.study.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.certforge.support.EditorialFixtures;
import dev.certforge.support.EditorialFixtures.Account;
import dev.certforge.support.EditorialFixtures.Published;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.random.RandomGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@SpringBootTest(
    properties = {
      "certforge.identity.bootstrap-admin.email=study-admin@example.com",
      "certforge.identity.bootstrap-admin.password=correct horse battery"
    })
@AutoConfigureMockMvc
@Testcontainers
class StudySessionIT {

  /** "Handling exceptions": five questions that no test ever changes. */
  private static final String STABLE_TOPIC = "a3000000-0000-4000-8000-000000000004";

  /** "Arrays and collections": only two published questions. */
  private static final String SMALL_TOPIC = "a3000000-0000-4000-8000-000000000005";

  /** "Streams and lambdas": questions that the change-of-content test deprecates and replaces. */
  private static final String CHANGING_TOPIC = "a3000000-0000-4000-8000-000000000006";

  /** "Localization": never given any published question. */
  private static final String EMPTY_TOPIC = "a3000000-0000-4000-8000-000000000010";

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  /** A controllable clock, and a seeded generator so sessions are reproducible in tests. */
  @TestConfiguration
  static class Config {
    @Bean
    @Primary
    MutableClock testClock() {
      return new MutableClock();
    }

    @Bean
    @Primary
    RandomGenerator seededRandom() {
      return new Random(20260930L);
    }
  }

  static final class MutableClock extends Clock {
    private volatile Instant now = Instant.now();

    void advance(Duration duration) {
      now = now.plus(duration);
    }

    @Override
    public ZoneId getZone() {
      return ZoneOffset.UTC;
    }

    @Override
    public Clock withZone(ZoneId zone) {
      return this;
    }

    @Override
    public Instant instant() {
      return now;
    }
  }

  @Autowired MockMvc mvc;
  @Autowired JdbcTemplate jdbc;
  @Autowired MutableClock clock;

  private static EditorialFixtures fixtures;
  private static Published changing1;
  private static Published changing2;
  private static Published changing3;
  private Account learner;

  @BeforeEach
  void prepare() throws Exception {
    synchronized (StudySessionIT.class) {
      if (fixtures == null) {
        fixtures = new EditorialFixtures(mvc, "study-admin@example.com");
        for (int i = 1; i <= 5; i++) {
          fixtures.publish(STABLE_TOPIC, "Stable question " + i);
        }
        for (int i = 1; i <= 2; i++) {
          fixtures.publish(SMALL_TOPIC, "Small topic question " + i);
        }
        changing1 = fixtures.publish(CHANGING_TOPIC, "Changing one");
        changing2 = fixtures.publish(CHANGING_TOPIC, "Changing two");
        changing3 = fixtures.publish(CHANGING_TOPIC, "Changing three");
      }
    }
    learner = fixtures.user();
  }

  // ---- helpers -------------------------------------------------------------------------------

  private ResultActions start(Account as, String topic, Integer count) throws Exception {
    String body =
        "{\"topicId\":\""
            + topic
            + "\""
            + (count == null ? "" : ",\"questionCount\":" + count)
            + "}";
    return mvc.perform(
        post("/api/study/sessions")
            .with(csrf())
            .cookie(as.session())
            .contentType("application/json")
            .content(body));
  }

  private String startOk(Account as, String topic, Integer count) throws Exception {
    MvcResult result = start(as, topic, count).andExpect(status().isCreated()).andReturn();
    return JsonPath.read(result.getResponse().getContentAsString(), "$.id");
  }

  private ResultActions transition(Account as, String sessionId, String action) throws Exception {
    return mvc.perform(
        post("/api/study/sessions/" + sessionId + "/" + action).with(csrf()).cookie(as.session()));
  }

  private String body(Account as, String sessionId) throws Exception {
    return mvc.perform(get("/api/study/sessions/" + sessionId).cookie(as.session()))
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString();
  }

  private static List<String> revisions(String sessionBody) {
    return JsonPath.read(sessionBody, "$.questions[*].question.revisionId");
  }

  // ---- starting and selection ----------------------------------------------------------------

  @Test
  void learnerStartsASessionWithTheRequestedNumberOfPublishedQuestions() throws Exception {
    start(learner, STABLE_TOPIC, 3)
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.status").value("IN_PROGRESS"))
        .andExpect(jsonPath("$.requestedCount").value(3))
        .andExpect(jsonPath("$.topicId").value(STABLE_TOPIC))
        .andExpect(jsonPath("$.questions.length()").value(3))
        .andExpect(jsonPath("$.questions[0].position").value(0))
        .andExpect(jsonPath("$.questions[2].position").value(2))
        .andExpect(jsonPath("$.questions[0].question.options.length()").value(2))
        .andExpect(jsonPath("$.closedAt").doesNotExist());
  }

  @Test
  void usesTheServerDefaultCountWhenNoneIsRequested() throws Exception {
    // Five questions exist and the default is 10, so the default cannot be satisfied.
    start(learner, STABLE_TOPIC, null)
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("insufficient_content"))
        .andExpect(jsonPath("$.requested").value(10))
        .andExpect(jsonPath("$.available").value(5));
  }

  @Test
  void aSessionContainsOnlyDistinctPublishedQuestionsOfTheTopic() throws Exception {
    String id = startOk(learner, STABLE_TOPIC, 5);

    List<String> revisionIds = revisions(body(learner, id));

    assertThat(revisionIds).hasSize(5).doesNotHaveDuplicates();
    List<String> published =
        jdbc.queryForList(
            "select id::text from certforge.qb_question_revision"
                + " where topic_id = ?::uuid and status = 'PUBLISHED'",
            String.class,
            STABLE_TOPIC);
    assertThat(published).containsAll(revisionIds);
  }

  @Test
  void insufficientContentReturnsAStableAndUsefulError() throws Exception {
    start(learner, SMALL_TOPIC, 3)
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("insufficient_content"))
        .andExpect(jsonPath("$.requested").value(3))
        .andExpect(jsonPath("$.available").value(2));
    start(learner, EMPTY_TOPIC, 1)
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("insufficient_content"))
        .andExpect(jsonPath("$.available").value(0));
  }

  @Test
  void unknownTopicsAndOutOfRangeCountsAreRejected() throws Exception {
    start(learner, UUID.randomUUID().toString(), 1)
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("topic_not_found"));
    start(learner, STABLE_TOPIC, 0)
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("question_count_out_of_range"));
    start(learner, STABLE_TOPIC, 21)
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("question_count_out_of_range"));
    mvc.perform(
            post("/api/study/sessions")
                .with(csrf())
                .cookie(learner.session())
                .contentType("application/json")
                .content("{}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("validation_failed"));
  }

  @Test
  void onlyAuthenticatedLearnersCanUseSessions() throws Exception {
    mvc.perform(
            post("/api/study/sessions")
                .with(csrf())
                .contentType("application/json")
                .content("{\"topicId\":\"" + STABLE_TOPIC + "\"}"))
        .andExpect(status().isUnauthorized());
    mvc.perform(get("/api/study/sessions")).andExpect(status().isUnauthorized());
  }

  // ---- stability -----------------------------------------------------------------------------

  @Test
  void questionOrderStaysStableForTheSession() throws Exception {
    String id = startOk(learner, STABLE_TOPIC, 5);

    String first = body(learner, id);
    String second = body(learner, id);

    assertThat(revisions(second)).isEqualTo(revisions(first));
    assertThat(second).isEqualTo(first);
  }

  @Test
  void laterDeprecationAndReplacementDoNotRewriteAnExistingSession() throws Exception {
    String id = startOk(learner, CHANGING_TOPIC, 3);
    String before = body(learner, id);
    List<String> original = revisions(before);
    assertThat(original)
        .containsExactlyInAnyOrder(
            changing1.revisionId(), changing2.revisionId(), changing3.revisionId());

    String replacement =
        fixtures.replace(changing1.questionId(), "Changing one, corrected", CHANGING_TOPIC);
    fixtures.deprecate(changing2.revisionId());

    String after = body(learner, id);
    assertThat(revisions(after)).isEqualTo(original);
    assertThat(after).contains("Changing one").contains("Changing two");
    assertThat(after).doesNotContain("corrected");

    // A new session only sees what is published now.
    Account other = fixtures.user();
    String fresh = body(other, startOk(other, CHANGING_TOPIC, 2));
    assertThat(revisions(fresh))
        .containsExactlyInAnyOrder(replacement, changing3.revisionId())
        .doesNotContain(changing1.revisionId(), changing2.revisionId());
  }

  // ---- lifecycle -----------------------------------------------------------------------------

  @Test
  void aLearnerHasAtMostOneSessionInProgressPerTopic() throws Exception {
    String first = startOk(learner, STABLE_TOPIC, 2);

    start(learner, STABLE_TOPIC, 2)
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("active_session_exists"))
        .andExpect(jsonPath("$.sessionId").value(first));

    // Another topic, or another learner, is unaffected.
    startOk(learner, SMALL_TOPIC, 2);
    startOk(fixtures.user(), STABLE_TOPIC, 2);

    transition(learner, first, "abandon").andExpect(status().isOk());
    startOk(learner, STABLE_TOPIC, 2);
  }

  @Test
  void completeAndAbandonMoveTheSessionToATerminalState() throws Exception {
    String completed = startOk(learner, STABLE_TOPIC, 2);
    transition(learner, completed, "complete")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("COMPLETED"))
        .andExpect(jsonPath("$.closedAt").isNotEmpty());

    String abandoned = startOk(learner, STABLE_TOPIC, 2);
    transition(learner, abandoned, "abandon")
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("ABANDONED"));

    // The questions stay readable after the session is closed.
    assertThat(revisions(body(learner, completed))).hasSize(2);
  }

  @Test
  void closedSessionsRejectFurtherTransitions() throws Exception {
    String id = startOk(learner, STABLE_TOPIC, 2);
    transition(learner, id, "complete").andExpect(status().isOk());

    transition(learner, id, "complete")
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("session_not_in_progress"));
    transition(learner, id, "abandon")
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("session_not_in_progress"));
  }

  @Test
  void aSessionThatRunsOutOfTimeExpiresAndFreesTheTopic() throws Exception {
    String id = startOk(learner, STABLE_TOPIC, 2);

    clock.advance(Duration.ofHours(25));

    mvc.perform(get("/api/study/sessions/" + id).cookie(learner.session()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("EXPIRED"))
        .andExpect(jsonPath("$.closedAt").isNotEmpty());
    transition(learner, id, "complete")
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("session_expired"));
    transition(learner, id, "abandon")
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("session_expired"));
    startOk(learner, STABLE_TOPIC, 2);
  }

  @Test
  void anExpiredSessionNeverBlocksTheNextStartEvenIfNobodyReadIt() throws Exception {
    startOk(learner, STABLE_TOPIC, 2);

    clock.advance(Duration.ofHours(25));

    startOk(learner, STABLE_TOPIC, 2);
    mvc.perform(get("/api/study/sessions?status=EXPIRED").cookie(learner.session()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1));
  }

  @Test
  void learnersCanOnlySeeTheirOwnSessions() throws Exception {
    String id = startOk(learner, STABLE_TOPIC, 2);
    Account other = fixtures.user();

    mvc.perform(get("/api/study/sessions/" + id).cookie(other.session()))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("session_not_found"));
    transition(other, id, "complete").andExpect(status().isNotFound());
    mvc.perform(get("/api/study/sessions").cookie(other.session()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(0));
    mvc.perform(get("/api/study/sessions").cookie(learner.session()))
        .andExpect(jsonPath("$[0].id").value(id))
        .andExpect(jsonPath("$[0].questionCount").value(2));
  }

  // ---- privacy -------------------------------------------------------------------------------

  @Test
  void sessionPayloadsCarryNoAnswerKeysOrEditorialMetadata() throws Exception {
    String id = startOk(learner, STABLE_TOPIC, 5);
    String started =
        start(fixtures.user(), STABLE_TOPIC, 5).andReturn().getResponse().getContentAsString();

    for (String payload : List.of(body(learner, id), started)) {
      assertThat(payload)
          .contains("Stable question")
          .doesNotContainIgnoringCase("correct\"")
          .doesNotContainIgnoringCase("explanation")
          .doesNotContainIgnoringCase("Secret")
          .doesNotContainIgnoringCase("references")
          .doesNotContainIgnoringCase("author")
          .doesNotContainIgnoringCase("reviewer")
          .doesNotContainIgnoringCase("rationale");
    }
  }

  // ---- database guarantees -------------------------------------------------------------------

  @Test
  void theSnapshotIsImmutableForEveryWriter() throws Exception {
    String id = startOk(learner, STABLE_TOPIC, 2);
    UUID session = UUID.fromString(id);

    assertThatThrownBy(
            () ->
                jdbc.update(
                    "update certforge.study_session_question set revision_id = ?"
                        + " where session_id = ? and position = 0",
                    UUID.randomUUID(),
                    session))
        .hasMessageContaining("immutable");
    assertThatThrownBy(
            () ->
                jdbc.update(
                    "delete from certforge.study_session_question where session_id = ?", session))
        .hasMessageContaining("immutable");
    assertThatThrownBy(
            () ->
                jdbc.update(
                    "insert into certforge.study_session_question (session_id, position, revision_id)"
                        + " values (?, 9, ?)",
                    session,
                    UUID.randomUUID()))
        .hasMessageContaining("immutable");
  }

  // ---- concurrency ---------------------------------------------------------------------------

  private List<Integer> inParallel(List<Callable<Integer>> tasks) throws Exception {
    ExecutorService pool = Executors.newFixedThreadPool(tasks.size());
    try {
      CountDownLatch ready = new CountDownLatch(tasks.size());
      CountDownLatch go = new CountDownLatch(1);
      List<Future<Integer>> futures = new ArrayList<>();
      for (Callable<Integer> task : tasks) {
        futures.add(
            pool.submit(
                () -> {
                  ready.countDown();
                  go.await();
                  return task.call();
                }));
      }
      ready.await();
      go.countDown();
      List<Integer> results = new ArrayList<>();
      for (Future<Integer> future : futures) {
        results.add(future.get());
      }
      Collections.sort(results);
      return results;
    } finally {
      pool.shutdownNow();
    }
  }

  @Test
  void concurrentStartsCreateExactlyOneSession() throws Exception {
    Callable<Integer> attempt =
        () -> start(learner, STABLE_TOPIC, 2).andReturn().getResponse().getStatus();

    List<Integer> statuses = inParallel(List.of(attempt, attempt, attempt, attempt));

    assertThat(statuses).containsExactly(201, 409, 409, 409);
    mvc.perform(get("/api/study/sessions?status=IN_PROGRESS").cookie(learner.session()))
        .andExpect(jsonPath("$.length()").value(1));
  }

  @Test
  void concurrentCompleteAndAbandonHaveExactlyOneWinner() throws Exception {
    String id = startOk(learner, STABLE_TOPIC, 2);
    Callable<Integer> complete =
        () -> transition(learner, id, "complete").andReturn().getResponse().getStatus();
    Callable<Integer> abandon =
        () -> transition(learner, id, "abandon").andReturn().getResponse().getStatus();

    List<Integer> statuses = inParallel(List.of(complete, abandon, complete, abandon));

    assertThat(statuses).containsExactly(200, 409, 409, 409);
    String finalStatus = JsonPath.read(body(learner, id), "$.status");
    assertThat(finalStatus).isIn("COMPLETED", "ABANDONED");
  }
}
