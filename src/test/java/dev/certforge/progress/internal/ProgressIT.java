package dev.certforge.progress.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.certforge.support.EditorialFixtures;
import dev.certforge.support.EditorialFixtures.Account;
import dev.certforge.support.StudyFixtures;
import dev.certforge.support.StudyFixtures.Started;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@SpringBootTest(
    properties = {
      "certforge.identity.bootstrap-admin.email=progress-admin@example.com",
      "certforge.identity.bootstrap-admin.password=correct horse battery"
    })
@AutoConfigureMockMvc
@Testcontainers
class ProgressIT {

  private static final String TOPIC_1 = "a3000000-0000-4000-8000-000000000001";
  private static final String TOPIC_2 = "a3000000-0000-4000-8000-000000000002";
  private static final String TOPIC_3 = "a3000000-0000-4000-8000-000000000003";

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired MockMvc mvc;
  @Autowired JdbcTemplate jdbc;
  @Autowired ProgressService progress;

  private static EditorialFixtures fixtures;
  private StudyFixtures study;
  private Account learner;

  @BeforeEach
  void prepare() throws Exception {
    synchronized (ProgressIT.class) {
      if (fixtures == null) {
        fixtures = new EditorialFixtures(mvc, "progress-admin@example.com");
        for (int i = 1; i <= 6; i++) {
          fixtures.publish(TOPIC_1, "Progress question one " + i);
        }
        for (int i = 1; i <= 4; i++) {
          fixtures.publish(TOPIC_2, "Progress question two " + i);
        }
        for (int i = 1; i <= 10; i++) {
          fixtures.publish(TOPIC_3, "Progress question three " + i);
        }
      }
    }
    study = new StudyFixtures(mvc);
    learner = fixtures.user();
  }

  // ---- helpers -------------------------------------------------------------------------------

  private String progressBody(Account as) throws Exception {
    return mvc.perform(get("/api/progress/topics").cookie(as.session()))
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString();
  }

  /** The progress entry of a topic as a map of its fields. */
  private Map<String, Object> entry(Account as, String topic) throws Exception {
    List<Map<String, Object>> entries =
        JsonPath.read(progressBody(as), "$[?(@.topicId=='" + topic + "')]");
    assertThat(entries).hasSize(1);
    return entries.get(0);
  }

  private boolean consistent(Account as) throws Exception {
    String body =
        mvc.perform(get("/api/progress/reconciliation").cookie(as.session()))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    return JsonPath.read(body, "$.consistent");
  }

  private String rebuild(Account as) throws Exception {
    return mvc.perform(post("/api/progress/rebuild").with(csrf()).cookie(as.session()))
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString();
  }

  // ---- what counts ---------------------------------------------------------------------------

  @Test
  void onlyAcceptedAnswersCountAndUnansweredQuestionsAreLeftOut() throws Exception {
    Started session = study.start(learner, TOPIC_1, 4);
    study.answerOk(learner, session, 0, "A");
    study.answerOk(learner, session, 1, "B");
    study.answerOk(learner, session, 2, "A");
    // Position 3 is never answered.

    Map<String, Object> progress = entry(learner, TOPIC_1);

    assertThat(progress)
        .containsEntry("attempted", 3)
        .containsEntry("correct", 2)
        .containsEntry("incorrect", 1);
    assertThat(((Number) progress.get("accuracy")).doubleValue()).isEqualTo(0.6667);
    assertThat(progress.get("lastActivityAt")).isNotNull();
  }

  @Test
  void answersInAnAbandonedSessionStillCountButAnEmptySessionAddsNothing() throws Exception {
    Started withAnswers = study.start(learner, TOPIC_1, 3);
    study.answerOk(learner, withAnswers, 0, "A");
    study.answerOk(learner, withAnswers, 1, "A");
    study.abandon(learner, withAnswers);
    Started empty = study.start(learner, TOPIC_2, 2);
    study.abandon(learner, empty);

    assertThat(entry(learner, TOPIC_1)).containsEntry("attempted", 2).containsEntry("correct", 2);
    Map<String, Object> untouched = entry(learner, TOPIC_2);
    assertThat(untouched).containsEntry("attempted", 0).containsEntry("incorrect", 0);
    assertThat(untouched.get("accuracy")).isNull();
    assertThat(untouched.get("lastActivityAt")).isNull();
  }

  @Test
  void everyCatalogTopicIsListedInCatalogOrderEvenWithoutActivity() throws Exception {
    mvc.perform(get("/api/progress/topics").cookie(learner.session()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(10))
        .andExpect(jsonPath("$[0].topicId").value(TOPIC_1))
        .andExpect(jsonPath("$[0].trackSlug").value("java-certification"))
        .andExpect(jsonPath("$[0].topicName").isNotEmpty())
        .andExpect(jsonPath("$[9].topicId").value("a3000000-0000-4000-8000-000000000010"))
        .andExpect(jsonPath("$[0].attempted").value(0));
  }

  @Test
  void theSameQuestionAnsweredInTwoSessionsCountsTwice() throws Exception {
    for (int round = 0; round < 2; round++) {
      Started session = study.start(learner, TOPIC_2, 4);
      study.answerOk(learner, session, 0, "A");
      study.complete(learner, session);
    }

    assertThat(entry(learner, TOPIC_2)).containsEntry("attempted", 2);
  }

  @Test
  void theProgressPayloadHasNoReadinessOrMasteryScore() throws Exception {
    Started session = study.start(learner, TOPIC_1, 2);
    study.answerOk(learner, session, 0, "A");

    assertThat(entry(learner, TOPIC_1).keySet())
        .containsExactlyInAnyOrder(
            "topicId",
            "topicName",
            "trackSlug",
            "attempted",
            "correct",
            "incorrect",
            "accuracy",
            "lastActivityAt");
  }

  // ---- reproducibility -----------------------------------------------------------------------

  @Test
  void summariesMatchAnIndependentRecomputationFromTheStoredAttempts() throws Exception {
    Started one = study.start(learner, TOPIC_1, 5);
    study.answerOk(learner, one, 0, "A");
    study.answerOk(learner, one, 1, "B");
    study.answerOk(learner, one, 2, "A");
    study.answerOk(learner, one, 3, "B");
    Started two = study.start(learner, TOPIC_2, 3);
    study.answerOk(learner, two, 0, "A");

    List<Map<String, Object>> expected =
        jdbc.queryForList(
            "select s.topic_id::text as topic, count(*) as attempted,"
                + " count(*) filter (where a.correct) as correct"
                + " from certforge.study_attempt a join certforge.study_session s"
                + " on s.id = a.session_id where a.learner_id = ?::uuid group by s.topic_id",
            learner.id().toString());

    assertThat(expected).hasSize(2);
    for (Map<String, Object> row : expected) {
      Map<String, Object> shown = entry(learner, (String) row.get("topic"));
      assertThat(((Number) shown.get("attempted")).longValue())
          .isEqualTo(((Number) row.get("attempted")).longValue());
      assertThat(((Number) shown.get("correct")).longValue())
          .isEqualTo(((Number) row.get("correct")).longValue());
    }
  }

  @Test
  void rebuildingProducesExactlyTheSameProjectionAndRepairsDrift() throws Exception {
    Started one = study.start(learner, TOPIC_1, 4);
    study.answerOk(learner, one, 0, "A");
    study.answerOk(learner, one, 1, "B");
    study.answerOk(learner, one, 2, "A");
    Started two = study.start(learner, TOPIC_2, 2);
    study.answerOk(learner, two, 0, "B");
    String before = progressBody(learner);
    assertThat(consistent(learner)).isTrue();

    // Rebuilding a healthy projection changes nothing.
    assertThat(JsonPath.<Integer>read(rebuild(learner), "$.corrected")).isZero();
    assertThat(progressBody(learner)).isEqualTo(before);

    // Corrupt it in three ways: a wrong count, a missing row, and a row with no attempts behind it.
    jdbc.update(
        "update certforge.progress_topic set correct = 0 where learner_id = ?::uuid and topic_id = ?::uuid",
        learner.id().toString(),
        TOPIC_1);
    jdbc.update(
        "delete from certforge.progress_topic where learner_id = ?::uuid and topic_id = ?::uuid",
        learner.id().toString(),
        TOPIC_2);
    jdbc.update(
        "insert into certforge.progress_topic (learner_id, topic_id, attempted, correct,"
            + " last_activity_at) values (?::uuid, ?::uuid, 9, 9, now())",
        learner.id().toString(),
        TOPIC_3);
    assertThat(progressBody(learner)).isNotEqualTo(before);

    String report =
        mvc.perform(get("/api/progress/reconciliation").cookie(learner.session()))
            .andReturn()
            .getResponse()
            .getContentAsString();
    assertThat(JsonPath.<Boolean>read(report, "$.consistent")).isFalse();
    assertThat(JsonPath.<List<String>>read(report, "$.differences[*].topicId"))
        .containsExactlyInAnyOrder(TOPIC_1, TOPIC_2, TOPIC_3);

    assertThat(JsonPath.<Integer>read(rebuild(learner), "$.corrected")).isEqualTo(3);
    assertThat(consistent(learner)).isTrue();
    assertThat(progressBody(learner)).isEqualTo(before);

    // Rebuilding is idempotent.
    assertThat(JsonPath.<Integer>read(rebuild(learner), "$.corrected")).isZero();
    assertThat(progressBody(learner)).isEqualTo(before);
  }

  @Test
  void aFullRebuildRepairsEveryLearnerAndDropsOrphans() throws Exception {
    Account other = fixtures.user();
    Started mine = study.start(learner, TOPIC_1, 2);
    study.answerOk(learner, mine, 0, "A");
    Started theirs = study.start(other, TOPIC_2, 2);
    study.answerOk(other, theirs, 0, "B");
    String myBefore = progressBody(learner);
    String theirBefore = progressBody(other);
    UUID ghost = UUID.randomUUID();
    jdbc.update("update certforge.progress_topic set attempted = 50, correct = 50");
    jdbc.update(
        "insert into certforge.progress_topic (learner_id, topic_id, attempted, correct,"
            + " last_activity_at) values (?, ?::uuid, 1, 1, now())",
        ghost,
        TOPIC_1);

    progress.rebuildAll();

    assertThat(progressBody(learner)).isEqualTo(myBefore);
    assertThat(progressBody(other)).isEqualTo(theirBefore);
    assertThat(
            jdbc.queryForObject(
                "select count(*) from certforge.progress_topic where learner_id = ?",
                Integer.class,
                ghost))
        .isZero();
  }

  // ---- isolation -----------------------------------------------------------------------------

  @Test
  void learnersOnlySeeAndRebuildTheirOwnProgress() throws Exception {
    Started session = study.start(learner, TOPIC_1, 2);
    study.answerOk(learner, session, 0, "A");
    Account other = fixtures.user();

    assertThat(entry(other, TOPIC_1)).containsEntry("attempted", 0);
    assertThat(consistent(other)).isTrue();
    rebuild(other);
    assertThat(entry(learner, TOPIC_1)).containsEntry("attempted", 1);
  }

  @Test
  void progressRequiresAuthentication() throws Exception {
    mvc.perform(get("/api/progress/topics")).andExpect(status().isUnauthorized());
    mvc.perform(get("/api/progress/reconciliation")).andExpect(status().isUnauthorized());
    mvc.perform(post("/api/progress/rebuild").with(csrf())).andExpect(status().isUnauthorized());
  }

  // ---- concurrency ---------------------------------------------------------------------------

  @Test
  void rebuildingWhileAnswersArriveNeverLosesOrDoubleCountsAnAttempt() throws Exception {
    Started session = study.start(learner, TOPIC_3, 10);
    List<Callable<Integer>> tasks = new ArrayList<>();
    for (int position = 0; position < 10; position++) {
      int at = position;
      tasks.add(
          () ->
              study
                  .answer(learner, session, at, "LOW", 5, "A")
                  .andReturn()
                  .getResponse()
                  .getStatus());
    }
    for (int i = 0; i < 6; i++) {
      tasks.add(
          () ->
              mvc.perform(post("/api/progress/rebuild").with(csrf()).cookie(learner.session()))
                  .andReturn()
                  .getResponse()
                  .getStatus());
    }

    List<Integer> statuses = inParallel(tasks);

    assertThat(statuses.stream().filter(s -> s == 201).count()).isEqualTo(10);
    assertThat(statuses.stream().filter(s -> s == 200).count()).isEqualTo(6);
    assertThat(entry(learner, TOPIC_3)).containsEntry("attempted", 10).containsEntry("correct", 10);
    assertThat(consistent(learner)).isTrue();
  }

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
}
