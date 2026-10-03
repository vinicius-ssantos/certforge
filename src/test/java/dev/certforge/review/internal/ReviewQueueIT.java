package dev.certforge.review.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.certforge.support.EditorialFixtures;
import dev.certforge.support.EditorialFixtures.Account;
import dev.certforge.support.EditorialFixtures.Published;
import dev.certforge.support.StudyFixtures;
import dev.certforge.support.StudyFixtures.Started;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

/**
 * The review queue (ADR 0013). Every test asserts the rule rather than a fixed dataset, because the
 * queue is derived and has to stay reproducible from the attempts alone.
 *
 * <p>Time moves by shifting the clock forward, not by ageing the stored rows: an attempt is
 * immutable evidence and the database refuses to update one, which is a guarantee worth keeping
 * rather than working around for a test.
 */
@SpringBootTest(
    properties = {
      "certforge.identity.bootstrap-admin.email=review-admin@example.com",
      "certforge.identity.bootstrap-admin.password=correct horse battery"
    })
@AutoConfigureMockMvc
@Testcontainers
class ReviewQueueIT {

  private static final String TOPIC = "a3000000-0000-4000-8000-000000000001";
  private static final String RETIRING_TOPIC = "a3000000-0000-4000-8000-000000000003";
  private static final int IN_TOPIC = 3;

  /** How far ahead of real time the application believes it is. */
  private static final AtomicReference<Duration> SHIFT = new AtomicReference<>(Duration.ZERO);

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @TestConfiguration
  static class ShiftableTime {

    @Bean
    @Primary
    Clock shiftableClock() {
      return new Clock() {
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
          return Instant.now().plus(SHIFT.get());
        }
      };
    }
  }

  @Autowired MockMvc mvc;

  private static EditorialFixtures fixtures;
  private static List<Published> published;
  private static List<Published> retiring;
  private StudyFixtures study;
  private Account learner;

  @BeforeEach
  void prepare() throws Exception {
    SHIFT.set(Duration.ZERO);
    synchronized (ReviewQueueIT.class) {
      if (fixtures == null) {
        fixtures = new EditorialFixtures(mvc, "review-admin@example.com");
        published = new ArrayList<>();
        for (int i = 1; i <= IN_TOPIC; i++) {
          published.add(fixtures.publish(TOPIC, "Review question " + i));
        }
        retiring =
            List.of(
                fixtures.publish(RETIRING_TOPIC, "Retiring question 1"),
                fixtures.publish(RETIRING_TOPIC, "Retiring question 2"));
      }
    }
    study = new StudyFixtures(mvc);
    learner = fixtures.user();
  }

  // ---- helpers -------------------------------------------------------------------------------

  private String queueBody(Account as) throws Exception {
    return mvc.perform(get("/api/review/queue").cookie(as.session()))
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString();
  }

  private List<String> reasons(Account as) throws Exception {
    return JsonPath.read(queueBody(as), "$.items[*].reason");
  }

  private List<String> prompts(Account as) throws Exception {
    return JsonPath.read(queueBody(as), "$.items[*].prompt");
  }

  private int count(Account as, String field) throws Exception {
    return JsonPath.read(queueBody(as), "$." + field);
  }

  /** Moves the application forward in time, which is how a recall interval elapses. */
  private void travel(int days) {
    SHIFT.updateAndGet(shift -> shift.plusDays(days));
  }

  /**
   * Answers one question of a fresh session, by revision rather than position, and abandons the
   * session so the next one can start. An abandoned session keeps its attempts, which are the
   * evidence the queue is derived from.
   */
  private void answer(String revisionId, String confidence, String option) throws Exception {
    answerIn(TOPIC, IN_TOPIC, revisionId, confidence, option);
  }

  private void answerIn(
      String topic, int count, String revisionId, String confidence, String option)
      throws Exception {
    Started session = study.start(learner, topic, count);
    study
        .answer(learner, session, session.positionOf(revisionId), confidence, 1000, option)
        .andExpect(status().isCreated());
    study.abandon(learner, session);
  }

  // ---- what the queue is for -----------------------------------------------------------------

  @Test
  void theOrderIsWhatTheReasonsMeanRatherThanWhenTheyHappened() throws Exception {
    // Answered in the opposite order to the one the queue should use.
    answer(published.get(0).revisionId(), "LOW", "A");
    answer(published.get(1).revisionId(), "LOW", "B");
    answer(published.get(2).revisionId(), "HIGH", "B");

    assertThat(reasons(learner))
        .containsExactly("WRONG_WHILE_CONFIDENT", "WRONG", "RIGHT_BUT_UNSURE");
    assertThat(prompts(learner).getFirst()).isEqualTo("Review question 3");
  }

  @Test
  void beingWrongWhileConfidentOutranksBeingWrongWhileUnsure() throws Exception {
    answer(published.get(0).revisionId(), "LOW", "B");
    answer(published.get(1).revisionId(), "HIGH", "B");

    assertThat(reasons(learner)).containsExactly("WRONG_WHILE_CONFIDENT", "WRONG");
  }

  // ---- the recall rule -----------------------------------------------------------------------

  @Test
  void aConfidentCorrectAnswerRestsAndThenComesBack() throws Exception {
    answer(published.get(0).revisionId(), "HIGH", "A");

    assertThat(reasons(learner)).isEmpty();
    assertThat(count(learner, "waiting")).isEqualTo(1);

    // One day is the first interval, so the day after it is due again.
    travel(2);

    assertThat(reasons(learner)).containsExactly("DUE_FOR_RECALL");
    assertThat(count(learner, "waiting")).isZero();
  }

  @Test
  void theIntervalDoublesWithEachConsecutiveConfidentCorrectAnswer() throws Exception {
    String revision = published.get(0).revisionId();
    answer(revision, "HIGH", "A");
    travel(2);
    answer(revision, "HIGH", "A");

    // Two confident-correct answers in a row means two days, so one day is not yet enough.
    travel(1);
    assertThat(reasons(learner)).isEmpty();

    travel(2);
    assertThat(reasons(learner)).containsExactly("DUE_FOR_RECALL");
  }

  @Test
  void oneWrongAnswerResetsTheInterval() throws Exception {
    String revision = published.get(0).revisionId();
    answer(revision, "HIGH", "A");
    travel(2);
    answer(revision, "HIGH", "A");
    travel(3);

    // The streak had earned a rest; being wrong ends it immediately.
    answer(revision, "HIGH", "B");

    assertThat(reasons(learner)).containsExactly("WRONG_WHILE_CONFIDENT");
    assertThat(count(learner, "waiting")).isZero();
  }

  @Test
  void aCorrectButUnsureAnswerDoesNotRestAtAll() throws Exception {
    answer(published.get(0).revisionId(), "LOW", "A");

    // It was right, so accuracy counts it as success; the queue does not let it rest.
    assertThat(reasons(learner)).containsExactly("RIGHT_BUT_UNSURE");
    assertThat(count(learner, "waiting")).isZero();
  }

  // ---- what stays out ------------------------------------------------------------------------

  @Test
  void theQueueHoldsOnlyYourOwnAttempts() throws Exception {
    answer(published.get(0).revisionId(), "HIGH", "B");
    Account somebodyElse = fixtures.user();

    assertThat(reasons(learner)).containsExactly("WRONG_WHILE_CONFIDENT");
    assertThat(reasons(somebodyElse)).isEmpty();
  }

  @Test
  void aQuestionThatIsNoLongerPublishedLeavesTheQueue() throws Exception {
    // Its own topic: deprecating is permanent, and the other tests need their topic intact.
    answerIn(RETIRING_TOPIC, 2, retiring.get(0).revisionId(), "HIGH", "B");
    answerIn(RETIRING_TOPIC, 2, retiring.get(1).revisionId(), "HIGH", "B");
    assertThat(reasons(learner)).hasSize(2);

    fixtures.deprecate(retiring.get(0).revisionId());

    // The attempt is still evidence and still in history; it is just not worth revisiting.
    assertThat(prompts(learner)).containsExactly("Retiring question 2");
  }

  @Test
  void aQuestionNeverAttemptedIsNotInTheQueue() throws Exception {
    answer(published.get(0).revisionId(), "HIGH", "B");

    assertThat(prompts(learner)).containsExactly("Review question 1");
    assertThat(count(learner, "neverAttempted")).isEqualTo(IN_TOPIC - 1);
  }

  // ---- recurring misconceptions --------------------------------------------------------------

  private String misconceptions(Account as) throws Exception {
    return mvc.perform(get("/api/review/misconceptions").cookie(as.session()))
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString();
  }

  @Test
  void countsAttemptsAndDistinctQuestionsSeparately() throws Exception {
    // The same question wrong twice while confident: one misconception, repeated.
    answer(published.get(0).revisionId(), "HIGH", "B");
    answer(published.get(0).revisionId(), "HIGH", "B");

    String one = misconceptions(learner);
    assertThat((int) JsonPath.read(one, "$[0].attempts")).isEqualTo(2);
    assertThat((int) JsonPath.read(one, "$[0].questions")).isEqualTo(1);

    // A second question makes it a weak area rather than one stuck idea.
    answer(published.get(1).revisionId(), "HIGH", "B");

    String two = misconceptions(learner);
    assertThat((int) JsonPath.read(two, "$[0].attempts")).isEqualTo(3);
    assertThat((int) JsonPath.read(two, "$[0].questions")).isEqualTo(2);
  }

  @Test
  void countsOnlyWrongAnswersGivenConfidently() throws Exception {
    answer(published.get(0).revisionId(), "LOW", "B"); // wrong, but unsure
    answer(published.get(1).revisionId(), "HIGH", "A"); // confident and right

    assertThat(JsonPath.<List<Object>>read(misconceptions(learner), "$")).isEmpty();
  }

  @Test
  void misconceptionsAreOnlyYourOwn() throws Exception {
    answer(published.get(0).revisionId(), "HIGH", "B");
    Account somebodyElse = fixtures.user();

    assertThat(JsonPath.<List<Object>>read(misconceptions(learner), "$")).hasSize(1);
    assertThat(JsonPath.<List<Object>>read(misconceptions(somebodyElse), "$")).isEmpty();
  }

  @Test
  void aLearnerWithNoAttemptsHasAnEmptyQueueRatherThanAnError() throws Exception {
    assertThat(reasons(learner)).isEmpty();
    assertThat(count(learner, "dueNow")).isZero();
    assertThat(count(learner, "waiting")).isZero();
    assertThat(count(learner, "neverAttempted")).isZero();
  }
}
