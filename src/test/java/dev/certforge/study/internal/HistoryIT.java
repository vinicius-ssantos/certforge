package dev.certforge.study.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
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

@SpringBootTest(
    properties = {
      "certforge.identity.bootstrap-admin.email=history-admin@example.com",
      "certforge.identity.bootstrap-admin.password=correct horse battery"
    })
@AutoConfigureMockMvc
@Testcontainers
class HistoryIT {

  private static final String TOPIC_A = "a3000000-0000-4000-8000-000000000001";
  private static final String TOPIC_B = "a3000000-0000-4000-8000-000000000002";
  private static final String CHANGING_TOPIC = "a3000000-0000-4000-8000-000000000003";

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  /** A controllable clock, so ordering can be tested with equal and with distinct timestamps. */
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
  @Autowired MutableClock clock;

  private static EditorialFixtures fixtures;
  private static Published changing;
  private StudyFixtures study;
  private Account learner;

  @BeforeEach
  void prepare() throws Exception {
    synchronized (HistoryIT.class) {
      if (fixtures == null) {
        fixtures = new EditorialFixtures(mvc, "history-admin@example.com");
        for (int i = 1; i <= 8; i++) {
          fixtures.publish(TOPIC_A, "History question A" + i);
        }
        for (int i = 1; i <= 8; i++) {
          fixtures.publish(TOPIC_B, "History question B" + i);
        }
        changing = fixtures.publish(CHANGING_TOPIC, "Original wording");
        fixtures.publish(CHANGING_TOPIC, "Second changing question");
      }
    }
    study = new StudyFixtures(mvc);
    learner = fixtures.user();
  }

  // ---- helpers -------------------------------------------------------------------------------

  private String page(Account as, String path) throws Exception {
    return mvc.perform(get(path).cookie(as.session()))
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString();
  }

  private static List<String> ids(String pageBody) {
    return JsonPath.read(pageBody, "$.items[*].id");
  }

  /** Follows every cursor and returns the ids in the order they were delivered. */
  private List<String> collect(Account as, String path, int size) throws Exception {
    List<String> all = new ArrayList<>();
    String cursor = null;
    int guard = 0;
    do {
      String url = path + (path.contains("?") ? "&" : "?") + "size=" + size;
      if (cursor != null) {
        url += "&cursor=" + cursor;
      }
      String body = page(as, url);
      all.addAll(ids(body));
      cursor = JsonPath.read(body, "$.nextCursor");
      assertThat(++guard).as("a cursor chain must end").isLessThan(50);
    } while (cursor != null);
    return all;
  }

  /** Creates a closed session with one answered question so the next one can start. */
  private Started closedSession(Account as, String topic, String... options) throws Exception {
    Started session = study.start(as, topic, 2);
    study.answerOk(as, session, 0, options);
    study.complete(as, session);
    return session;
  }

  // ---- history content -----------------------------------------------------------------------

  @Test
  void attemptHistoryShowsTheExactRevisionAnsweredEvenAfterAReplacement() throws Exception {
    Started session = study.start(learner, CHANGING_TOPIC, 2);
    int position = session.positionOf(changing.revisionId());
    study.answer(learner, session, position, "HIGH", 4321, "B").andExpect(status().isCreated());

    // The question is corrected afterwards; the correction also deprecates the old revision.
    String replacement =
        fixtures.replaceWithCorrect(
            changing.questionId(), "Corrected wording", CHANGING_TOPIC, "B");

    String body = page(learner, "/api/study/history/attempts");

    assertThat(body).contains("Original wording").doesNotContain("Corrected wording");
    assertThat(body).doesNotContain(replacement);
    mvc.perform(get("/api/study/history/attempts").cookie(learner.session()))
        .andExpect(status().isOk())
        .andExpect(
            header().string("Cache-Control", org.hamcrest.Matchers.containsString("no-store")))
        .andExpect(jsonPath("$.items.length()").value(1))
        .andExpect(jsonPath("$.items[0].sessionId").value(session.id()))
        .andExpect(jsonPath("$.items[0].position").value(position))
        .andExpect(jsonPath("$.items[0].topicId").value(CHANGING_TOPIC))
        .andExpect(jsonPath("$.items[0].selectedOptions[0]").value("B"))
        .andExpect(jsonPath("$.items[0].correct").value(false))
        .andExpect(jsonPath("$.items[0].confidence").value("HIGH"))
        .andExpect(jsonPath("$.items[0].elapsedMillis").value(4321))
        .andExpect(jsonPath("$.items[0].question.revisionId").value(changing.revisionId()))
        .andExpect(jsonPath("$.items[0].question.revisionStatus").value("DEPRECATED"))
        .andExpect(jsonPath("$.items[0].question.prompt").value("Original wording"))
        .andExpect(jsonPath("$.items[0].question.explanation").value("Secret overall explanation"))
        .andExpect(jsonPath("$.items[0].question.options[0].correct").value(true))
        .andExpect(jsonPath("$.items[0].question.options[0].explanation").value("Secret why A"))
        .andExpect(jsonPath("$.items[0].question.references[0].title").value("JLS"));
  }

  @Test
  void sessionHistoryReportsStatusAndCountsWithoutAnyQuestionContent() throws Exception {
    Started completed = study.start(learner, TOPIC_A, 3);
    study.answerOk(learner, completed, 0, "A");
    study.answerOk(learner, completed, 1, "B");
    study.complete(learner, completed);
    Started abandoned = study.start(learner, TOPIC_B, 2);
    study.abandon(learner, abandoned);
    Started running = study.start(learner, CHANGING_TOPIC, 2);

    String body = page(learner, "/api/study/history/sessions");

    assertThat(body)
        .doesNotContain("prompt")
        .doesNotContainIgnoringCase("explanation")
        .doesNotContainIgnoringCase("Secret");
    assertThat(JsonPath.<List<String>>read(body, "$.items[*].status"))
        .containsExactlyInAnyOrder("COMPLETED", "ABANDONED", "IN_PROGRESS");
    List<Integer> answered =
        JsonPath.read(body, "$.items[?(@.id=='" + completed.id() + "')].answeredCount");
    List<Integer> correct =
        JsonPath.read(body, "$.items[?(@.id=='" + completed.id() + "')].correctCount");
    assertThat(answered).containsExactly(2);
    assertThat(correct).containsExactly(1);
    assertThat(
            JsonPath.<List<Integer>>read(
                body, "$.items[?(@.id=='" + abandoned.id() + "')].answeredCount"))
        .containsExactly(0);
    assertThat(
            JsonPath.<List<String>>read(body, "$.items[?(@.id=='" + running.id() + "')].closedAt"))
        .containsNull();
  }

  @Test
  void unansweredQuestionsNeverAppearInAttemptHistory() throws Exception {
    Started session = study.start(learner, TOPIC_A, 5);
    study.answerOk(learner, session, 2, "A");

    String body = page(learner, "/api/study/history/attempts");

    assertThat(JsonPath.<List<Integer>>read(body, "$.items[*].position")).containsExactly(2);
    for (int position = 0; position < 5; position++) {
      if (position != 2) {
        assertThat(body).doesNotContain(session.revisions().get(position));
      }
    }
  }

  // ---- pagination ----------------------------------------------------------------------------

  @Test
  void sessionPagesFollowAStableOrderWithNoGapsOrDuplicates() throws Exception {
    // Four sessions at the same instant (ties broken by id), then three at later instants.
    for (int i = 0; i < 4; i++) {
      closedSession(learner, i % 2 == 0 ? TOPIC_A : TOPIC_B, "A");
    }
    for (int i = 0; i < 3; i++) {
      clock.advance(Duration.ofMinutes(1));
      closedSession(learner, i % 2 == 0 ? TOPIC_A : TOPIC_B, "A");
    }

    List<String> everything = collect(learner, "/api/study/history/sessions", 50);
    List<String> paged = collect(learner, "/api/study/history/sessions", 3);
    List<String> singly = collect(learner, "/api/study/history/sessions", 1);

    assertThat(everything).hasSize(7).doesNotHaveDuplicates();
    assertThat(paged).isEqualTo(everything);
    assertThat(singly).isEqualTo(everything);
    // Newest first: the three later sessions come before the four earlier ones.
    List<String> createdAt =
        JsonPath.read(page(learner, "/api/study/history/sessions?size=50"), "$.items[*].createdAt");
    List<String> sorted = new ArrayList<>(createdAt);
    sorted.sort(java.util.Comparator.reverseOrder());
    assertThat(createdAt).isEqualTo(sorted);
  }

  @Test
  void newActivityBetweenPagesNeverMakesAnOlderPageSkipOrRepeat() throws Exception {
    for (int i = 0; i < 5; i++) {
      clock.advance(Duration.ofSeconds(10));
      closedSession(learner, i % 2 == 0 ? TOPIC_A : TOPIC_B, "A");
    }
    List<String> before = collect(learner, "/api/study/history/sessions", 50);

    String first = page(learner, "/api/study/history/sessions?size=2");
    String cursor = JsonPath.read(first, "$.nextCursor");
    // Something new arrives at the front while the learner is paging.
    clock.advance(Duration.ofSeconds(10));
    closedSession(learner, CHANGING_TOPIC, "A");
    List<String> seen = new ArrayList<>(ids(first));
    while (cursor != null) {
      String next = page(learner, "/api/study/history/sessions?size=2&cursor=" + cursor);
      seen.addAll(ids(next));
      cursor = JsonPath.read(next, "$.nextCursor");
    }

    assertThat(seen).doesNotHaveDuplicates().isEqualTo(before);
  }

  @Test
  void attemptPagesAreStableAndCanBeNarrowedByTopicAndSession() throws Exception {
    Started a = study.start(learner, TOPIC_A, 6);
    for (int position = 0; position < 6; position++) {
      clock.advance(Duration.ofSeconds(1));
      study.answerOk(learner, a, position, "A");
    }
    clock.advance(Duration.ofSeconds(1));
    Started b = study.start(learner, TOPIC_B, 4);
    for (int position = 0; position < 4; position++) {
      study.answerOk(learner, b, position, "B");
    }

    List<String> all = collect(learner, "/api/study/history/attempts", 50);
    assertThat(all).hasSize(10).doesNotHaveDuplicates();
    assertThat(collect(learner, "/api/study/history/attempts", 3)).isEqualTo(all);
    assertThat(collect(learner, "/api/study/history/attempts", 1)).isEqualTo(all);

    assertThat(collect(learner, "/api/study/history/attempts?topicId=" + TOPIC_A, 4)).hasSize(6);
    assertThat(collect(learner, "/api/study/history/attempts?topicId=" + TOPIC_B, 4)).hasSize(4);
    assertThat(collect(learner, "/api/study/history/attempts?sessionId=" + b.id(), 4)).hasSize(4);
    // Newest first: the session answered last leads.
    assertThat(page(learner, "/api/study/history/attempts?size=1"))
        .contains("\"sessionId\":\"" + b.id() + "\"");
  }

  @Test
  void pageSizeAndCursorAreValidated() throws Exception {
    for (String bad : new String[] {"0", "-1", "51", "1000"}) {
      for (String path :
          new String[] {"/api/study/history/sessions", "/api/study/history/mock-exams"}) {
        mvc.perform(get(path + "?size=" + bad).cookie(learner.session()))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("invalid_page_size"));
      }
    }
    for (String bad : new String[] {"garbage", "MTIzNDU", "!!!"}) {
      mvc.perform(get("/api/study/history/attempts?cursor=" + bad).cookie(learner.session()))
          .andExpect(status().isBadRequest())
          .andExpect(jsonPath("$.code").value("invalid_cursor"));
    }
  }

  // ---- isolation -----------------------------------------------------------------------------

  @Test
  void learnersOnlyEverSeeTheirOwnHistory() throws Exception {
    Started mine = closedSession(learner, TOPIC_A, "A");
    Account other = fixtures.user();
    Started theirs = closedSession(other, TOPIC_A, "B");

    List<String> myAttemptSessions =
        JsonPath.read(page(learner, "/api/study/history/attempts"), "$.items[*].sessionId");
    List<String> theirAttemptSessions =
        JsonPath.read(page(other, "/api/study/history/attempts"), "$.items[*].sessionId");
    assertThat(myAttemptSessions).containsExactly(mine.id());
    assertThat(theirAttemptSessions).containsExactly(theirs.id());

    // Asking for someone else's session or topic data by id yields nothing, not an error leak.
    assertThat(
            JsonPath.<List<Object>>read(
                page(other, "/api/study/history/attempts?sessionId=" + mine.id()), "$.items"))
        .isEmpty();
    assertThat(ids(page(other, "/api/study/history/sessions"))).doesNotContain(mine.id());
  }

  @Test
  void historyRequiresAuthentication() throws Exception {
    mvc.perform(get("/api/study/history/sessions")).andExpect(status().isUnauthorized());
    mvc.perform(get("/api/study/history/mock-exams")).andExpect(status().isUnauthorized());
    mvc.perform(get("/api/study/history/attempts")).andExpect(status().isUnauthorized());
  }
}
