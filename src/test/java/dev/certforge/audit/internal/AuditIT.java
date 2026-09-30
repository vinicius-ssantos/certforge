package dev.certforge.audit.internal;

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
import jakarta.servlet.http.Cookie;
import java.util.List;
import java.util.UUID;
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
      "certforge.identity.bootstrap-admin.email=audit-admin@example.com",
      "certforge.identity.bootstrap-admin.password=correct horse battery"
    })
@AutoConfigureMockMvc
@Testcontainers
class AuditIT {

  private static final String TOPIC = "a3000000-0000-4000-8000-000000000004";

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired MockMvc mvc;
  @Autowired JdbcTemplate jdbc;

  private EditorialFixtures fixtures;
  private Cookie admin;
  private String adminId;

  @BeforeEach
  void prepare() throws Exception {
    fixtures = new EditorialFixtures(mvc, "audit-admin@example.com");
    admin = fixtures.adminSession();
    adminId =
        JsonPath.read(
            mvc.perform(get("/api/auth/me").cookie(admin))
                .andReturn()
                .getResponse()
                .getContentAsString(),
            "$.id");
  }

  // ---- helpers -------------------------------------------------------------------------------

  private String events(String query) throws Exception {
    return mvc.perform(get("/api/admin/audit" + query).cookie(admin))
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString();
  }

  private List<String> actions(String subject) throws Exception {
    List<String> actions =
        JsonPath.read(events("?subject=question-revision:" + subject), "$.items[*].action");
    return actions.reversed();
  }

  private List<String> actors(String subject) throws Exception {
    List<String> actors =
        JsonPath.read(events("?subject=question-revision:" + subject), "$.items[*].actorId");
    return actors.reversed();
  }

  private long count() {
    Long total = jdbc.queryForObject("select count(*) from certforge.audit_event", Long.class);
    return total == null ? 0 : total;
  }

  // ---- what is recorded ----------------------------------------------------------------------

  @Test
  void everyEditorialTransitionIsRecordedWithItsActorAndRevision() throws Exception {
    Published first = fixtures.publish(TOPIC, "Audited question");
    Account reviewer = fixtures.reviewerAccount();

    assertThat(actions(first.revisionId()))
        .containsExactly("QUESTION_REVISION_APPROVED", "QUESTION_REVISION_PUBLISHED");
    assertThat(actors(first.revisionId())).containsExactly(reviewer.id().toString(), adminId);

    // A correction replaces the published revision and deprecating ends its life.
    String second = fixtures.replace(first.questionId(), "Audited question, corrected", TOPIC);

    assertThat(actions(first.revisionId()))
        .containsExactly(
            "QUESTION_REVISION_APPROVED",
            "QUESTION_REVISION_PUBLISHED",
            "QUESTION_REVISION_REPLACED");
    assertThat(actions(second))
        .containsExactly("QUESTION_REVISION_APPROVED", "QUESTION_REVISION_PUBLISHED");
    fixtures.deprecate(second);
    assertThat(actions(second))
        .containsExactly(
            "QUESTION_REVISION_APPROVED",
            "QUESTION_REVISION_PUBLISHED",
            "QUESTION_REVISION_DEPRECATED");
    assertThat(actors(second).getLast()).isEqualTo(adminId);
  }

  @Test
  void eachRecordCarriesTheCorrelationIdOfTheRequestThatCausedIt() throws Exception {
    Published question = fixtures.publish(TOPIC, "Correlated question");
    // A second revision so the next transitions can be driven by hand with a known request id.
    String corrected = fixtures.replace(question.questionId(), "Correlated, corrected", TOPIC);

    mvc.perform(
            post("/api/admin/question-revisions/" + corrected + "/deprecate")
                .with(csrf())
                .cookie(admin)
                .header("X-Request-Id", "correlation-test-0001"))
        .andExpect(status().isOk());

    String body =
        events("?subject=question-revision:" + corrected + "&action=QUESTION_REVISION_DEPRECATED");
    assertThat(JsonPath.<List<String>>read(body, "$.items[*].requestId"))
        .containsExactly("correlation-test-0001");
  }

  @Test
  void aFailedTransitionLeavesNoAuditRecord() throws Exception {
    Published question = fixtures.publish(TOPIC, "Stays published");
    long before = count();

    // Deprecating something that is not published is rejected and must not be recorded.
    mvc.perform(
            post("/api/admin/question-revisions/" + UUID.randomUUID() + "/deprecate")
                .with(csrf())
                .cookie(admin))
        .andExpect(status().isNotFound());
    fixtures.deprecate(question.revisionId());
    long afterDeprecate = count();
    mvc.perform(
            post("/api/admin/question-revisions/" + question.revisionId() + "/deprecate")
                .with(csrf())
                .cookie(admin))
        .andExpect(status().isConflict());

    assertThat(afterDeprecate).isEqualTo(before + 1);
    assertThat(count()).isEqualTo(afterDeprecate);
  }

  @Test
  void theActionAndItsAuditRecordCommitOrRollBackTogether() throws Exception {
    Published question = fixtures.publish(TOPIC, "Audit failure rolls the action back");
    jdbc.execute(
        "create function certforge.test_fail_audit() returns trigger as $$ begin"
            + " raise exception 'audit store unavailable'; end; $$ language plpgsql");
    jdbc.execute(
        "create trigger test_fail_audit before insert on certforge.audit_event"
            + " for each row when (new.action = 'QUESTION_REVISION_DEPRECATED')"
            + " execute function certforge.test_fail_audit()");
    try {
      mvc.perform(
              post("/api/admin/question-revisions/" + question.revisionId() + "/deprecate")
                  .with(csrf())
                  .cookie(admin))
          .andExpect(status().isInternalServerError())
          .andExpect(jsonPath("$.code").value("internal_error"))
          .andExpect(
              result ->
                  assertThat(result.getResponse().getContentAsString())
                      .doesNotContain("audit store unavailable"));
    } finally {
      jdbc.execute("drop trigger test_fail_audit on certforge.audit_event");
      jdbc.execute("drop function certforge.test_fail_audit()");
    }

    // The deprecation did not happen, so there is nothing to audit, and it can still be done.
    assertThat(
            jdbc.queryForObject(
                "select status from certforge.qb_question_revision where id = ?::uuid",
                String.class,
                question.revisionId()))
        .isEqualTo("PUBLISHED");
    fixtures.deprecate(question.revisionId());
    assertThat(actions(question.revisionId())).contains("QUESTION_REVISION_DEPRECATED");
  }

  // ---- reading -------------------------------------------------------------------------------

  @Test
  void theAuditTrailCanBeFilteredAndPaged() throws Exception {
    Published question = fixtures.publish(TOPIC, "Filterable audit question");
    fixtures.replace(question.questionId(), "Filterable, corrected", TOPIC);
    Account reviewer = fixtures.reviewerAccount();

    String byActor = events("?actorId=" + reviewer.id());
    assertThat(JsonPath.<List<String>>read(byActor, "$.items[*].action"))
        .allMatch("QUESTION_REVISION_APPROVED"::equals);
    String byAction = events("?action=QUESTION_REVISION_REPLACED");
    assertThat(JsonPath.<List<String>>read(byAction, "$.items[*].subject"))
        .contains("question-revision:" + question.revisionId());

    String pageOne = events("?size=2");
    assertThat(JsonPath.<List<Object>>read(pageOne, "$.items")).hasSize(2);
    String cursor = JsonPath.read(pageOne, "$.nextCursor");
    String pageTwo = events("?size=2&cursor=" + cursor);
    List<String> one = JsonPath.read(pageOne, "$.items[*].id");
    List<String> two = JsonPath.read(pageTwo, "$.items[*].id");
    assertThat(two).doesNotContainAnyElementsOf(one);

    mvc.perform(get("/api/admin/audit?cursor=garbage").cookie(admin))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("invalid_cursor"));
    mvc.perform(get("/api/admin/audit?size=0").cookie(admin))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("invalid_page_size"));
  }

  @Test
  void onlyAdministratorsCanReadTheAuditTrail() throws Exception {
    Account learner = fixtures.user();
    Account editor = fixtures.user("EDITOR");
    Account reviewer = fixtures.user("REVIEWER");

    mvc.perform(get("/api/admin/audit")).andExpect(status().isUnauthorized());
    for (Account account : List.of(learner, editor, reviewer)) {
      mvc.perform(get("/api/admin/audit").cookie(account.session()))
          .andExpect(status().isForbidden());
    }
    mvc.perform(get("/api/admin/audit").cookie(admin))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.items").isArray());
  }

  // ---- integrity -----------------------------------------------------------------------------

  @Test
  void auditEventsAreAppendOnlyForEveryWriter() throws Exception {
    Published question = fixtures.publish(TOPIC, "Tamper-proof audit");
    assertThat(actions(question.revisionId())).isNotEmpty();

    assertThatThrownBy(
            () ->
                jdbc.update(
                    "update certforge.audit_event set actor_id = ? where subject = ?",
                    UUID.randomUUID(),
                    "question-revision:" + question.revisionId()))
        .hasMessageContaining("append-only");
    assertThatThrownBy(() -> jdbc.update("delete from certforge.audit_event"))
        .hasMessageContaining("append-only");
  }
}
