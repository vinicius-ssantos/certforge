package dev.certforge.study.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
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
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@SpringBootTest(
    properties = {
      "certforge.identity.bootstrap-admin.email=attempt-admin@example.com",
      "certforge.identity.bootstrap-admin.password=correct horse battery"
    })
@AutoConfigureMockMvc
@Testcontainers
@ExtendWith(OutputCaptureExtension.class)
class AttemptSubmissionIT {

  /** "Concurrency": five single-choice questions and a multiple-choice one. */
  private static final String TOPIC = "a3000000-0000-4000-8000-000000000008";

  /** "Java I/O": two questions, used to check that an attempt keeps the exact revision. */
  private static final String REVISION_TOPIC = "a3000000-0000-4000-8000-000000000009";

  private static final String SECRET = "Secret";

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @TestConfiguration
  static class Config {
    @Bean
    @Primary
    MutableClock testClock() {
      return new MutableClock();
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
  private static Published multiple;
  private static Published flipped1;
  private static Published flipped2;
  private Account learner;

  @BeforeEach
  void prepare() throws Exception {
    synchronized (AttemptSubmissionIT.class) {
      if (fixtures == null) {
        fixtures = new EditorialFixtures(mvc, "attempt-admin@example.com");
        for (int i = 1; i <= 5; i++) {
          fixtures.publish(TOPIC, "Single question " + i);
        }
        multiple = fixtures.publishMultiple(TOPIC, "Multiple question");
        flipped1 = fixtures.publish(REVISION_TOPIC, "Revision question one");
        flipped2 = fixtures.publish(REVISION_TOPIC, "Revision question two");
      }
    }
    learner = fixtures.user();
  }

  // ---- helpers -------------------------------------------------------------------------------

  /** A started session and the position of each of its questions by revision id. */
  private record Started(String id, List<String> revisions) {
    int positionOf(String revisionId) {
      return revisions.indexOf(revisionId);
    }
  }

  private Started startSession(Account as, String topic, int count) throws Exception {
    String body =
        mvc.perform(
                post("/api/study/sessions")
                    .with(csrf())
                    .cookie(as.session())
                    .contentType("application/json")
                    .content("{\"topicId\":\"" + topic + "\",\"questionCount\":" + count + "}"))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();
    return new Started(
        JsonPath.read(body, "$.id"), JsonPath.read(body, "$.questions[*].question.revisionId"));
  }

  /** The position of the multiple-choice question in a session that contains it. */
  private int multiplePosition(Started session) {
    return session.positionOf(multiple.revisionId());
  }

  /** A position whose question is single-choice. */
  private int singlePosition(Started session) {
    int multiplePosition = multiplePosition(session);
    return multiplePosition == 0 ? 1 : 0;
  }

  private static String answer(String confidence, long elapsed, String... options) {
    return "{\"selectedOptions\":[\""
        + String.join("\",\"", options)
        + "\"],\"confidence\":\""
        + confidence
        + "\",\"elapsedMillis\":"
        + elapsed
        + "}";
  }

  private ResultActions submit(Account as, Started session, int position, String key, String body)
      throws Exception {
    var request =
        post("/api/study/sessions/" + session.id() + "/questions/" + position + "/attempt")
            .with(csrf())
            .cookie(as.session())
            .contentType("application/json")
            .content(body);
    if (key != null) {
      request.header("Idempotency-Key", key);
    }
    return mvc.perform(request);
  }

  private static String key() {
    return "key-" + UUID.randomUUID();
  }

  private int attemptCount(String sessionId) {
    Integer count =
        jdbc.queryForObject(
            "select count(*) from certforge.study_attempt where session_id = ?::uuid",
            Integer.class,
            sessionId);
    return count == null ? 0 : count;
  }

  private void close(Account as, Started session, String action) throws Exception {
    mvc.perform(
            post("/api/study/sessions/" + session.id() + "/" + action)
                .with(csrf())
                .cookie(as.session()))
        .andExpect(status().isOk());
  }

  // ---- accepting an answer -------------------------------------------------------------------

  @Test
  void aCorrectAnswerIsAcceptedAndOnlyThenTheAnswerIsDisclosed() throws Exception {
    Started session = startSession(learner, TOPIC, 2);
    int position = singlePosition(session);

    submit(learner, session, position, key(), answer("HIGH", 4200, "A"))
        .andExpect(status().isCreated())
        .andExpect(
            header().string("Cache-Control", org.hamcrest.Matchers.containsString("no-store")))
        .andExpect(jsonPath("$.correct").value(true))
        .andExpect(jsonPath("$.selectedOptions[0]").value("A"))
        .andExpect(jsonPath("$.confidence").value("HIGH"))
        .andExpect(jsonPath("$.elapsedMillis").value(4200))
        .andExpect(jsonPath("$.revisionId").value(session.revisions().get(position)))
        .andExpect(jsonPath("$.answer.correctOptions[0]").value("A"))
        .andExpect(jsonPath("$.answer.explanation").value("Secret overall explanation"))
        .andExpect(jsonPath("$.answer.options[1].explanation").value("Secret why B"))
        .andExpect(jsonPath("$.answer.references[0].title").value("JLS"));
  }

  @Test
  void aWrongAnswerIsRecordedAsIncorrectWithTheKeyDisclosed() throws Exception {
    Started session = startSession(learner, TOPIC, 2);

    submit(learner, session, singlePosition(session), key(), answer("LOW", 100, "B"))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.correct").value(false))
        .andExpect(jsonPath("$.answer.correctOptions[0]").value("A"));
  }

  @Test
  void nothingAboutTheAnswerIsAvailableBeforeASubmissionIsAccepted() throws Exception {
    Started session = startSession(learner, TOPIC, 2);
    int position = singlePosition(session);

    String before =
        mvc.perform(get("/api/study/sessions/" + session.id()).cookie(learner.session()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.questions[" + position + "].answered").value(false))
            .andReturn()
            .getResponse()
            .getContentAsString();
    assertThat(before).doesNotContain(SECRET);
    mvc.perform(
            get("/api/study/sessions/" + session.id() + "/questions/" + position + "/attempt")
                .cookie(learner.session()))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("attempt_not_found"))
        .andExpect(
            result -> assertThat(result.getResponse().getContentAsString()).doesNotContain(SECRET));

    submit(learner, session, position, key(), answer("MEDIUM", 1, "A"))
        .andExpect(status().isCreated());

    mvc.perform(get("/api/study/sessions/" + session.id()).cookie(learner.session()))
        .andExpect(jsonPath("$.questions[" + position + "].answered").value(true))
        .andExpect(
            result -> assertThat(result.getResponse().getContentAsString()).doesNotContain(SECRET));
    mvc.perform(get("/api/study/sessions?status=IN_PROGRESS").cookie(learner.session()))
        .andExpect(jsonPath("$[0].answeredCount").value(1));
    mvc.perform(
            get("/api/study/sessions/" + session.id() + "/questions/" + position + "/attempt")
                .cookie(learner.session()))
        .andExpect(status().isOk())
        .andExpect(
            header().string("Cache-Control", org.hamcrest.Matchers.containsString("no-store")))
        .andExpect(jsonPath("$.answer.explanation").value("Secret overall explanation"));
  }

  @Test
  void correctnessIsComputedByTheServerAndNeverTakenFromTheClient() throws Exception {
    Started session = startSession(learner, TOPIC, 2);
    String lying =
        "{\"selectedOptions\":[\"B\"],\"confidence\":\"HIGH\",\"elapsedMillis\":10,"
            + "\"correct\":true,\"isCorrect\":true,\"score\":1}";

    submit(learner, session, singlePosition(session), key(), lying)
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.correct").value(false));
  }

  @Test
  void multipleChoiceNeedsTheExactSetWithNoPartialCredit() throws Exception {
    Started exact = startSession(learner, TOPIC, 6);
    int position = multiplePosition(exact);
    submit(learner, exact, position, key(), answer("HIGH", 1, "C", "A"))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.correct").value(true))
        .andExpect(jsonPath("$.selectedOptions[0]").value("A"))
        .andExpect(jsonPath("$.selectedOptions[1]").value("C"))
        .andExpect(jsonPath("$.answer.correctOptions.length()").value(2));

    Account other = fixtures.user();
    Started partial = startSession(other, TOPIC, 6);
    submit(other, partial, multiplePosition(partial), key(), answer("LOW", 1, "A"))
        .andExpect(jsonPath("$.correct").value(false));

    Account third = fixtures.user();
    Started extra = startSession(third, TOPIC, 6);
    submit(third, extra, multiplePosition(extra), key(), answer("LOW", 1, "A", "B", "C"))
        .andExpect(jsonPath("$.correct").value(false));
  }

  // ---- idempotency ---------------------------------------------------------------------------

  @Test
  void replayingTheSameRequestReturnsTheOriginalResultWithoutAnotherAttempt() throws Exception {
    Started session = startSession(learner, TOPIC, 2);
    int position = singlePosition(session);
    String key = key();
    String body = answer("HIGH", 777, "A");

    String first =
        submit(learner, session, position, key, body)
            .andExpect(status().isCreated())
            .andExpect(header().doesNotExist("Idempotency-Replayed"))
            .andReturn()
            .getResponse()
            .getContentAsString();
    String replay =
        submit(learner, session, position, key, body)
            .andExpect(status().isOk())
            .andExpect(header().string("Idempotency-Replayed", "true"))
            .andReturn()
            .getResponse()
            .getContentAsString();

    assertThat(replay).isEqualTo(first);
    assertThat(attemptCount(session.id())).isEqualTo(1);
  }

  @Test
  void reusingAKeyForADifferentRequestIsRejected() throws Exception {
    Started session = startSession(learner, TOPIC, 3);
    int position = singlePosition(session);
    String key = key();
    submit(learner, session, position, key, answer("HIGH", 5, "A")).andExpect(status().isCreated());

    // Different answer, different confidence, different time, and a different question.
    submit(learner, session, position, key, answer("HIGH", 5, "B"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("idempotency_key_reused"));
    submit(learner, session, position, key, answer("LOW", 5, "A"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("idempotency_key_reused"));
    submit(learner, session, position, key, answer("HIGH", 6, "A"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("idempotency_key_reused"));
    int other = (position + 1) % 3;
    submit(learner, session, other, key, answer("HIGH", 5, "A"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("idempotency_key_reused"));

    assertThat(attemptCount(session.id())).isEqualTo(1);
  }

  @Test
  void aSecondAnswerWithANewKeyIsRejectedAndTheFirstIsKept() throws Exception {
    Started session = startSession(learner, TOPIC, 2);
    int position = singlePosition(session);
    submit(learner, session, position, key(), answer("HIGH", 1, "B"))
        .andExpect(status().isCreated());

    submit(learner, session, position, key(), answer("HIGH", 1, "A"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("already_answered"));

    mvc.perform(
            get("/api/study/sessions/" + session.id() + "/questions/" + position + "/attempt")
                .cookie(learner.session()))
        .andExpect(jsonPath("$.selectedOptions[0]").value("B"))
        .andExpect(jsonPath("$.correct").value(false));
    assertThat(attemptCount(session.id())).isEqualTo(1);
  }

  @Test
  void keysAreScopedToTheLearner() throws Exception {
    Started mine = startSession(learner, TOPIC, 2);
    Account other = fixtures.user();
    Started theirs = startSession(other, TOPIC, 2);
    String shared = key();

    submit(learner, mine, singlePosition(mine), shared, answer("LOW", 1, "A"))
        .andExpect(status().isCreated());
    submit(other, theirs, singlePosition(theirs), shared, answer("LOW", 1, "A"))
        .andExpect(status().isCreated())
        .andExpect(header().doesNotExist("Idempotency-Replayed"));
  }

  @Test
  void aReplayStillAnswersAfterTheSessionHasBeenClosed() throws Exception {
    Started session = startSession(learner, TOPIC, 2);
    int position = singlePosition(session);
    String key = key();
    String body = answer("MEDIUM", 50, "A");
    submit(learner, session, position, key, body).andExpect(status().isCreated());

    close(learner, session, "complete");

    submit(learner, session, position, key, body)
        .andExpect(status().isOk())
        .andExpect(header().string("Idempotency-Replayed", "true"))
        .andExpect(jsonPath("$.correct").value(true));
  }

  @Test
  void theIdempotencyKeyIsRequiredAndMustBeWellFormed() throws Exception {
    Started session = startSession(learner, TOPIC, 2);
    int position = singlePosition(session);

    submit(learner, session, position, null, answer("LOW", 1, "A"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("idempotency_key_required"));
    submit(learner, session, position, "short", answer("LOW", 1, "A"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("idempotency_key_invalid"));
    submit(learner, session, position, "has spaces and !! symbols", answer("LOW", 1, "A"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("idempotency_key_invalid"));
    assertThat(attemptCount(session.id())).isZero();
  }

  // ---- validation ----------------------------------------------------------------------------

  @Test
  void invalidSubmissionsAreRejectedWithStableCodesAndNoAnswerData() throws Exception {
    Started session = startSession(learner, TOPIC, 2);
    int position = singlePosition(session);

    submit(learner, session, position, key(), answer("LOW", 1, "Z"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("invalid_option"))
        .andExpect(
            result -> assertThat(result.getResponse().getContentAsString()).doesNotContain(SECRET));
    submit(learner, session, position, key(), answer("LOW", 1, "A", "A"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("duplicate_option"));
    submit(learner, session, position, key(), answer("LOW", 1, "A", "B"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("single_choice_requires_one_option"));
    submit(
            learner,
            session,
            position,
            key(),
            "{\"selectedOptions\":[],\"confidence\":\"LOW\",\"elapsedMillis\":1}")
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("validation_failed"));
    submit(learner, session, position, key(), answer("CERTAIN", 1, "A"))
        .andExpect(status().isBadRequest());
    submit(learner, session, position, key(), answer("LOW", -1, "A"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("validation_failed"));
    submit(learner, session, position, key(), answer("LOW", 86_400_001L, "A"))
        .andExpect(status().isBadRequest());
    submit(learner, session, 99, key(), answer("LOW", 1, "A"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("question_not_found"));
    assertThat(attemptCount(session.id())).isZero();
  }

  // ---- revision fidelity ---------------------------------------------------------------------

  @Test
  void anAttemptKeepsTheExactRevisionTheLearnerSaw() throws Exception {
    Started session = startSession(learner, REVISION_TOPIC, 2);
    int position = session.positionOf(flipped1.revisionId());

    // The question is corrected after the session started, and now B is the right answer.
    // Publishing the correction also deprecates the revision the session contains.
    String corrected =
        fixtures.replaceWithCorrect(flipped1.questionId(), "Corrected", REVISION_TOPIC, "B");

    submit(learner, session, position, key(), answer("HIGH", 9, "A"))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.correct").value(true))
        .andExpect(jsonPath("$.revisionId").value(flipped1.revisionId()));
    String stored =
        jdbc.queryForObject(
            "select revision_id::text from certforge.study_attempt"
                + " where session_id = ?::uuid and position = ?",
            String.class,
            session.id(),
            position);
    assertThat(stored).isEqualTo(flipped1.revisionId()).isNotEqualTo(corrected);

    // The other question of the session was untouched and is still answerable.
    int otherPosition = session.positionOf(flipped2.revisionId());
    submit(learner, session, otherPosition, key(), answer("LOW", 1, "A"))
        .andExpect(status().isCreated());
  }

  // ---- authorization and session state -------------------------------------------------------

  @Test
  void learnersCannotSubmitOrReadAttemptsOfSomeoneElsesSession() throws Exception {
    Started session = startSession(learner, TOPIC, 2);
    int position = singlePosition(session);
    submit(learner, session, position, key(), answer("LOW", 1, "A"))
        .andExpect(status().isCreated());
    Account intruder = fixtures.user();

    submit(intruder, session, position, key(), answer("LOW", 1, "A"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("session_not_found"));
    mvc.perform(
            get("/api/study/sessions/" + session.id() + "/questions/" + position + "/attempt")
                .cookie(intruder.session()))
        .andExpect(status().isNotFound())
        .andExpect(
            result -> assertThat(result.getResponse().getContentAsString()).doesNotContain(SECRET));
    assertThat(attemptCount(session.id())).isEqualTo(1);

    mvc.perform(
            post("/api/study/sessions/" + session.id() + "/questions/" + position + "/attempt")
                .with(csrf())
                .header("Idempotency-Key", key())
                .contentType("application/json")
                .content(answer("LOW", 1, "A")))
        .andExpect(status().isUnauthorized());
    mvc.perform(get("/api/study/sessions/" + session.id() + "/questions/" + position + "/attempt"))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void closedAndExpiredSessionsRejectNewAnswers() throws Exception {
    Started completed = startSession(learner, TOPIC, 2);
    close(learner, completed, "complete");
    submit(learner, completed, 0, key(), answer("LOW", 1, "A"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("session_not_in_progress"));

    Account other = fixtures.user();
    Started expiring = startSession(other, TOPIC, 2);
    clock.advance(Duration.ofHours(25));
    submit(other, expiring, 0, key(), answer("LOW", 1, "A"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("session_expired"));

    assertThat(attemptCount(completed.id())).isZero();
    assertThat(attemptCount(expiring.id())).isZero();
  }

  // ---- privacy -------------------------------------------------------------------------------

  @Test
  void logsNeverContainAnswerMaterial(CapturedOutput output) throws Exception {
    Started session = startSession(learner, TOPIC, 2);
    int position = singlePosition(session);
    String key = key();
    submit(learner, session, position, key, answer("HIGH", 1, "B")).andExpect(status().isCreated());
    submit(learner, session, position, key, answer("HIGH", 1, "B")).andExpect(status().isOk());
    submit(learner, session, position, key(), answer("HIGH", 1, "A"))
        .andExpect(status().isConflict());
    submit(learner, session, position, key, answer("HIGH", 1, "A"))
        .andExpect(status().isConflict());
    submit(learner, session, 1 - position, key(), answer("LOW", 1, "Z"))
        .andExpect(status().isBadRequest());
    mvc.perform(
        get("/api/study/sessions/" + session.id() + "/questions/" + position + "/attempt")
            .cookie(learner.session()));

    assertThat(output.getAll())
        .doesNotContain(SECRET)
        .doesNotContain("Overall explanation")
        .doesNotContain(key);
  }

  // ---- database guarantees -------------------------------------------------------------------

  @Test
  void attemptsAreImmutableEvidenceAndCannotBeWrittenToAClosedSession() throws Exception {
    Started session = startSession(learner, TOPIC, 2);
    int position = singlePosition(session);
    submit(learner, session, position, key(), answer("HIGH", 1, "A"))
        .andExpect(status().isCreated());

    assertThatThrownBy(
            () ->
                jdbc.update(
                    "update certforge.study_attempt set correct = false where session_id = ?::uuid",
                    session.id()))
        .hasMessageContaining("immutable");
    assertThatThrownBy(
            () ->
                jdbc.update(
                    "delete from certforge.study_attempt where session_id = ?::uuid", session.id()))
        .hasMessageContaining("immutable");

    close(learner, session, "complete");
    int free = position == 0 ? 1 : 0;
    assertThatThrownBy(
            () ->
                jdbc.update(
                    "insert into certforge.study_attempt (id, session_id, position, learner_id,"
                        + " revision_id, selected_options, correct, confidence, elapsed_ms,"
                        + " submitted_at, idempotency_key, request_fingerprint)"
                        + " select ?, ?::uuid, ?, learner_id, ?, 'A', true, 'LOW', 1, now(), ?, ?"
                        + " from certforge.study_session where id = ?::uuid",
                    UUID.randomUUID(),
                    session.id(),
                    free,
                    UUID.fromString(session.revisions().get(free)),
                    key(),
                    "0".repeat(64),
                    session.id()))
        .hasMessageContaining("not in progress");
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
  void simultaneousRetriesWithTheSameKeyCreateExactlyOneAttempt() throws Exception {
    Started session = startSession(learner, TOPIC, 2);
    int position = singlePosition(session);
    String key = key();
    Callable<Integer> attempt =
        () ->
            submit(learner, session, position, key, answer("HIGH", 3, "A"))
                .andReturn()
                .getResponse()
                .getStatus();

    List<Integer> statuses = inParallel(List.of(attempt, attempt, attempt, attempt, attempt));

    assertThat(statuses).containsExactly(200, 200, 200, 200, 201);
    assertThat(attemptCount(session.id())).isEqualTo(1);
  }

  @Test
  void simultaneousAnswersWithDifferentKeysLeaveExactlyOneAccepted() throws Exception {
    Started session = startSession(learner, TOPIC, 2);
    int position = singlePosition(session);
    List<Callable<Integer>> tasks = new ArrayList<>();
    for (int i = 0; i < 5; i++) {
      String key = key();
      tasks.add(
          () ->
              submit(learner, session, position, key, answer("LOW", 1, "A"))
                  .andReturn()
                  .getResponse()
                  .getStatus());
    }

    List<Integer> statuses = inParallel(tasks);

    assertThat(statuses).containsExactly(201, 409, 409, 409, 409);
    assertThat(attemptCount(session.id())).isEqualTo(1);
  }

  @Test
  void racingASubmissionAgainstClosingTheSessionNeverLeavesAnAttemptInAClosedSession()
      throws Exception {
    for (int round = 0; round < 6; round++) {
      Account racer = fixtures.user();
      Started session = startSession(racer, TOPIC, 2);
      int position = singlePosition(session);
      Callable<Integer> submission =
          () ->
              submit(racer, session, position, key(), answer("LOW", 1, "A"))
                  .andReturn()
                  .getResponse()
                  .getStatus();
      Callable<Integer> closing =
          () ->
              mvc.perform(
                      post("/api/study/sessions/" + session.id() + "/abandon")
                          .with(csrf())
                          .cookie(racer.session()))
                  .andReturn()
                  .getResponse()
                  .getStatus();

      List<Integer> statuses = inParallel(List.of(submission, closing));

      // Either the answer was accepted and then the session closed, or the session closed first
      // and the answer was rejected. An accepted answer and a missing row must never disagree.
      boolean accepted = statuses.contains(201);
      assertThat(attemptCount(session.id())).isEqualTo(accepted ? 1 : 0);
      assertThat(statuses).contains(200);
    }
  }
}
