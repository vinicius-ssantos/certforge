package dev.certforge.platform.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.certforge.support.EditorialFixtures;
import dev.certforge.support.EditorialFixtures.Account;
import dev.certforge.support.EditorialFixtures.Published;
import dev.certforge.support.StudyFixtures;
import dev.certforge.support.StudyFixtures.Started;
import io.micrometer.core.instrument.Meter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Tag;
import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationHandler;
import jakarta.servlet.http.Cookie;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.regex.Pattern;
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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@SpringBootTest(
    properties = {
      "certforge.identity.bootstrap-admin.email=ops-admin@example.com",
      "certforge.identity.bootstrap-admin.password=correct horse battery"
    })
@AutoConfigureMockMvc
@Testcontainers
@ExtendWith(OutputCaptureExtension.class)
class OperabilityIT {

  private static final String TOPIC = "a3000000-0000-4000-8000-000000000004";
  private static final Pattern UUID_TEXT =
      Pattern.compile(
          "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}");

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  /** Records what every observation (the unit that becomes a timer and, later, a span) carries. */
  static final class RecordingHandler implements ObservationHandler<Observation.Context> {
    final List<String> recorded = new CopyOnWriteArrayList<>();

    @Override
    public boolean supportsContext(Observation.Context context) {
      return true;
    }

    @Override
    public void onStop(Observation.Context context) {
      StringBuilder line = new StringBuilder(context.getName());
      context.getLowCardinalityKeyValues().forEach(kv -> line.append(' ').append(kv));
      context.getHighCardinalityKeyValues().forEach(kv -> line.append(' ').append(kv));
      recorded.add(line.toString());
    }
  }

  @TestConfiguration
  static class Config {
    @Bean
    RecordingHandler recordingHandler() {
      return new RecordingHandler();
    }
  }

  @Autowired MockMvc mvc;
  @Autowired JdbcTemplate jdbc;
  @Autowired MeterRegistry metrics;
  @Autowired RecordingHandler observations;

  private EditorialFixtures fixtures;
  private StudyFixtures study;
  private Cookie admin;

  @BeforeEach
  void prepare() throws Exception {
    fixtures = new EditorialFixtures(mvc, "ops-admin@example.com");
    study = new StudyFixtures(mvc);
    admin = fixtures.adminSession();
  }

  // ---- helpers -------------------------------------------------------------------------------

  private double count(String name, String... tags) {
    var counter = metrics.find(name).tags(tags).counter();
    return counter == null ? 0 : counter.count();
  }

  private String body(MvcResult result) throws Exception {
    return result.getResponse().getContentAsString();
  }

  private void breakAuditFor(String action) {
    jdbc.execute(
        "create function certforge.test_fail_audit() returns trigger as $$ begin"
            + " raise exception 'secret internal audit failure'; end; $$ language plpgsql");
    jdbc.execute(
        "create trigger test_fail_audit before insert on certforge.audit_event"
            + " for each row when (new.action = '"
            + action
            + "') execute function certforge.test_fail_audit()");
  }

  private void repairAudit() {
    jdbc.execute("drop trigger if exists test_fail_audit on certforge.audit_event");
    jdbc.execute("drop function if exists certforge.test_fail_audit()");
  }

  // ---- correlation ---------------------------------------------------------------------------

  @Test
  void everyResponseCarriesACorrelationIdAndASafeClientIdIsKept() throws Exception {
    MvcResult generated = mvc.perform(get("/actuator/health")).andReturn();
    assertThat(generated.getResponse().getHeader("X-Request-Id")).matches("^[0-9a-f-]{36}$");

    mvc.perform(get("/actuator/health").header("X-Request-Id", "client-supplied-id-42"))
        .andExpect(header().string("X-Request-Id", "client-supplied-id-42"));
  }

  @Test
  void unsafeClientIdsAreReplacedSoTheyCannotInjectIntoLogs() throws Exception {
    for (String unsafe :
        new String[] {
          "short", "has spaces in it!", "line\nbreak-injected", "a".repeat(65), "<script>x</script>"
        }) {
      MvcResult result =
          mvc.perform(get("/actuator/health").header("X-Request-Id", unsafe)).andReturn();

      assertThat(result.getResponse().getHeader("X-Request-Id"))
          .isNotEqualTo(unsafe)
          .matches("^[0-9a-f-]{36}$");
    }
  }

  @Test
  void errorBodiesNameTheRequestSoSupportCanFindTheLogLines() throws Exception {
    Account learner = fixtures.user();

    MvcResult unauthenticated =
        mvc.perform(get("/api/study/sessions").header("X-Request-Id", "trace-me-0001")).andReturn();
    MvcResult notFound =
        mvc.perform(
                get("/api/study/sessions/" + UUID.randomUUID())
                    .cookie(learner.session())
                    .header("X-Request-Id", "trace-me-0002"))
            .andReturn();
    MvcResult malformed =
        mvc.perform(
                post("/api/study/sessions")
                    .with(csrf())
                    .cookie(learner.session())
                    .header("X-Request-Id", "trace-me-0003")
                    .contentType("application/json")
                    .content("{not json"))
            .andReturn();

    assertThat(unauthenticated.getResponse().getStatus()).isEqualTo(401);
    assertThat(body(unauthenticated)).contains("\"requestId\":\"trace-me-0001\"");
    assertThat(notFound.getResponse().getStatus()).isEqualTo(404);
    assertThat(body(notFound))
        .contains("\"requestId\":\"trace-me-0002\"")
        .contains("session_not_found");
    assertThat(malformed.getResponse().getStatus()).isEqualTo(400);
    assertThat(body(malformed))
        .contains("\"requestId\":\"trace-me-0003\"")
        .contains("invalid_request");
  }

  @Test
  void anUnexpectedFailureIsGenericToTheClientAndFullyLoggedUnderTheSameRequestId(
      CapturedOutput output) throws Exception {
    Published question = fixtures.publish(TOPIC, "Fails in the audit store");
    breakAuditFor("QUESTION_REVISION_DEPRECATED");
    MvcResult result;
    try {
      result =
          mvc.perform(
                  post("/api/admin/question-revisions/" + question.revisionId() + "/deprecate")
                      .with(csrf())
                      .cookie(admin)
                      .header("X-Request-Id", "boom-request-0001"))
              .andReturn();
    } finally {
      repairAudit();
    }

    String response = body(result);
    assertThat(result.getResponse().getStatus()).isEqualTo(500);
    assertThat(response)
        .contains("internal_error")
        .contains("\"requestId\":\"boom-request-0001\"")
        .doesNotContain("secret internal audit failure")
        .doesNotContain("Exception")
        .doesNotContain("at dev.certforge")
        .doesNotContain(".java");
    // The details are in the log, tied to the same id.
    assertThat(output.getAll())
        .contains("[boom-request-0001]")
        .contains("Unexpected failure")
        .contains("secret internal audit failure");
    assertThat(count("certforge.unexpected.failures")).isGreaterThanOrEqualTo(1);
  }

  // ---- health --------------------------------------------------------------------------------

  @Test
  void livenessAndReadinessAreSeparateAndRevealNoDetails() throws Exception {
    mvc.perform(get("/actuator/health/liveness"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("UP"))
        .andExpect(jsonPath("$.components.livenessState.status").value("UP"))
        .andExpect(jsonPath("$.components.db").doesNotExist())
        .andExpect(jsonPath("$.components.flywayMigrations").doesNotExist());
    mvc.perform(get("/actuator/health/readiness"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("UP"))
        .andExpect(jsonPath("$.components.db.status").value("UP"))
        .andExpect(jsonPath("$.components.flywayMigrations.status").value("UP"))
        .andExpect(jsonPath("$.components.readinessState.status").value("UP"))
        .andExpect(jsonPath("$.components.db.details").doesNotExist())
        .andExpect(jsonPath("$.components.flywayMigrations.details").doesNotExist());
    mvc.perform(get("/actuator/health")).andExpect(status().isOk());
  }

  @Test
  void aFailedMigrationMakesTheInstanceUnreadyButNotDead() throws Exception {
    jdbc.update(
        "update flyway_schema_history set success = false"
            + " where installed_rank = (select max(installed_rank) from flyway_schema_history)");
    try {
      mvc.perform(get("/actuator/health/readiness"))
          .andExpect(status().isServiceUnavailable())
          .andExpect(jsonPath("$.status").value("DOWN"))
          .andExpect(jsonPath("$.components.flywayMigrations.status").value("DOWN"))
          .andExpect(jsonPath("$.components.db.status").value("UP"));
      mvc.perform(get("/actuator/health/liveness")).andExpect(status().isOk());
    } finally {
      jdbc.update("update flyway_schema_history set success = true");
    }

    mvc.perform(get("/actuator/health/readiness")).andExpect(status().isOk());
  }

  // ---- actuator access -----------------------------------------------------------------------

  @Test
  void managementEndpointsBeyondHealthAndInfoNeedTheOperationsPermission() throws Exception {
    Account learner = fixtures.user();
    Account editor = fixtures.user("EDITOR");

    mvc.perform(get("/actuator/info")).andExpect(status().isOk());
    mvc.perform(get("/actuator/metrics")).andExpect(status().isUnauthorized());
    mvc.perform(get("/actuator/metrics").cookie(learner.session()))
        .andExpect(status().isForbidden());
    mvc.perform(get("/actuator/metrics").cookie(editor.session()))
        .andExpect(status().isForbidden());
    mvc.perform(get("/actuator/metrics").cookie(admin))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.names").isArray());
    // Endpoints that are not exposed do not exist, even for an administrator.
    mvc.perform(get("/actuator/env").cookie(admin)).andExpect(status().isNotFound());
    mvc.perform(get("/actuator/beans").cookie(admin)).andExpect(status().isNotFound());
  }

  // ---- metrics -------------------------------------------------------------------------------

  @Test
  void criticalBehaviourIsCountedWithBoundedLabels() throws Exception {
    double invalid = count("certforge.auth.failures", "reason", "invalid_credentials");
    double sessions = count("certforge.sessions.created");
    double correct = count("certforge.attempts.submitted", "outcome", "correct");
    double incorrect = count("certforge.attempts.submitted", "outcome", "incorrect");
    double replayed = count("certforge.attempts.replayed");
    double published = count("certforge.editorial.transitions", "action", "published");
    double approved = count("certforge.editorial.transitions", "action", "approved");
    double replaced = count("certforge.editorial.transitions", "action", "replaced");
    double alreadyAnswered = count("certforge.domain.failures", "code", "already_answered");

    Account learner = fixtures.user();
    mvc.perform(
            post("/api/auth/login")
                .with(csrf())
                .contentType("application/json")
                .content(
                    "{\"email\":\"" + learner.email() + "\",\"password\":\"wrong password here\"}"))
        .andExpect(status().isUnauthorized());
    Published q1 = fixtures.publish(TOPIC, "Metrics question one");
    fixtures.publish(TOPIC, "Metrics question two");
    fixtures.replace(q1.questionId(), "Metrics question one, corrected", TOPIC);
    Started session = study.start(learner, TOPIC, 2);
    study.answerOk(learner, session, 0, "A");
    study.answerOk(learner, session, 1, "B");
    // A retry with the same key is a replay; a new key for an answered question is a domain
    // failure.
    String key = "metrics-retry-" + UUID.randomUUID();
    String answer = "{\"selectedOptions\":[\"A\"],\"confidence\":\"LOW\",\"elapsedMillis\":1}";
    Started other = study.start(fixtures.user(), TOPIC, 2);
    assertThat(other.id()).isNotEqualTo(session.id());
    var retry =
        post("/api/study/sessions/" + session.id() + "/questions/0/attempt")
            .with(csrf())
            .cookie(learner.session())
            .contentType("application/json")
            .content(answer);
    mvc.perform(retry.header("Idempotency-Key", "a-brand-new-key-1"))
        .andExpect(status().isConflict());
    assertThat(key).isNotBlank();

    assertThat(count("certforge.auth.failures", "reason", "invalid_credentials"))
        .isEqualTo(invalid + 1);
    assertThat(count("certforge.sessions.created")).isEqualTo(sessions + 2);
    assertThat(count("certforge.attempts.submitted", "outcome", "correct")).isGreaterThan(correct);
    assertThat(count("certforge.attempts.submitted", "outcome", "incorrect"))
        .isGreaterThan(incorrect);
    assertThat(count("certforge.attempts.replayed")).isEqualTo(replayed);
    assertThat(count("certforge.editorial.transitions", "action", "published"))
        .isEqualTo(published + 3);
    assertThat(count("certforge.editorial.transitions", "action", "approved"))
        .isEqualTo(approved + 3);
    assertThat(count("certforge.editorial.transitions", "action", "replaced"))
        .isEqualTo(replaced + 1);
    assertThat(count("certforge.domain.failures", "code", "already_answered"))
        .isEqualTo(alreadyAnswered + 1);
  }

  @Test
  void theNumberOfDistinctMetricSeriesIsCappedEvenIfACodePathMisbehaved() {
    for (int i = 0; i < 300; i++) {
      metrics.counter("certforge.domain.failures", "code", "runaway_" + i).increment();
    }

    long series =
        metrics.getMeters().stream()
            .filter(meter -> meter.getId().getName().equals("certforge.domain.failures"))
            .count();
    assertThat(series).isLessThanOrEqualTo(100);
  }

  // ---- no sensitive data in telemetry --------------------------------------------------------

  @Test
  void logsMetricsObservationsAndErrorsNeverCarrySecretsOrPersonalData(CapturedOutput output)
      throws Exception {
    String email = "telemetry-" + UUID.randomUUID() + "@example.com";
    String password = "hunter2-telemetry-secret-" + UUID.randomUUID();
    List<String> responses = new ArrayList<>();

    responses.add(
        body(
            mvc.perform(
                    post("/api/auth/register")
                        .with(csrf())
                        .contentType("application/json")
                        .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
                .andReturn()));
    responses.add(
        body(
            mvc.perform(
                    post("/api/auth/login")
                        .with(csrf())
                        .contentType("application/json")
                        .content(
                            "{\"email\":\""
                                + email
                                + "\",\"password\":\"wrong-"
                                + password
                                + "\"}"))
                .andReturn()));
    responses.add(
        body(
            mvc.perform(
                    post("/api/auth/register")
                        .with(csrf())
                        .contentType("application/json")
                        .content("{\"email\":\"" + email + "\",\"password\":\"short\"}"))
                .andReturn()));
    fixtures.publish(TOPIC, "Telemetry question one");
    fixtures.publish(TOPIC, "Telemetry question two");
    Account learner = fixtures.user();
    Started session = study.start(learner, TOPIC, 2);
    String idempotencyKey = "telemetry-key-" + UUID.randomUUID();
    var submit =
        post("/api/study/sessions/" + session.id() + "/questions/0/attempt")
            .with(csrf())
            .cookie(learner.session())
            .header("Idempotency-Key", idempotencyKey)
            .contentType("application/json")
            .content("{\"selectedOptions\":[\"B\"],\"confidence\":\"HIGH\",\"elapsedMillis\":777}");
    responses.add(body(mvc.perform(submit).andReturn()));
    responses.add(
        body(
            mvc.perform(
                    post("/api/study/sessions/" + session.id() + "/questions/0/attempt")
                        .with(csrf())
                        .cookie(learner.session())
                        .header("Idempotency-Key", "telemetry-other-key-1")
                        .contentType("application/json")
                        .content(
                            "{\"selectedOptions\":[\"Z\"],\"confidence\":\"HIGH\",\"elapsedMillis\":1}"))
                .andReturn()));
    responses.add(
        body(
            mvc.perform(get("/api/study/history/attempts").cookie(learner.session())).andReturn()));

    // Logs: no password, no email address, no idempotency key, no answer material.
    assertThat(output.getAll())
        .doesNotContain(password)
        .doesNotContain(email)
        .doesNotContain(idempotencyKey)
        .doesNotContain("Secret overall explanation")
        .doesNotContain("Secret why");

    // Metrics: every tag of every application meter is a short lower-case token.
    List<Meter> own =
        metrics.getMeters().stream()
            .filter(m -> m.getId().getName().startsWith("certforge."))
            .toList();
    assertThat(own).isNotEmpty();
    for (Meter meter : own) {
      for (Tag tag : meter.getId().getTags()) {
        assertThat(tag.getValue())
            .as("tag %s of %s", tag.getKey(), meter.getId().getName())
            .matches("^[A-Za-z0-9_.-]{1,64}$")
            .doesNotContain(email)
            .doesNotContain("@");
        assertThat(UUID_TEXT.matcher(tag.getValue()).find()).isFalse();
      }
    }
    String metricNames = metrics.getMeters().toString();
    assertThat(metricNames)
        .doesNotContain(password)
        .doesNotContain(email)
        .doesNotContain(idempotencyKey);

    // Observations (the source of timers and of future trace spans).
    assertThat(observations.recorded).isNotEmpty();
    for (String line : observations.recorded) {
      assertThat(line)
          .doesNotContain(password)
          .doesNotContain(email)
          .doesNotContain(idempotencyKey)
          .doesNotContain("Secret");
      assertThat(UUID_TEXT.matcher(line).find()).as("no ids in %s", line).isFalse();
    }

    // Error and other bodies: no password, stack trace, or answer material before acceptance.
    for (String response : responses) {
      assertThat(response)
          .doesNotContain(password)
          .doesNotContain("at dev.certforge")
          .doesNotContain(".java:");
    }
    // The rejected submissions disclosed nothing about the answer key.
    assertThat(responses.get(2)).doesNotContain("Secret");
    assertThat(responses.get(4)).doesNotContain("Secret");

    // The metrics endpoint itself exposes only names and tag values of the same meters.
    String listed =
        body(
            mvc.perform(get("/actuator/metrics/certforge.attempts.submitted").cookie(admin))
                .andReturn());
    assertThat(listed).doesNotContain(password).doesNotContain(email);
  }
}
