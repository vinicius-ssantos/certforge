package dev.certforge.labs.internal;

import static org.hamcrest.Matchers.endsWith;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.certforge.support.EditorialFixtures;
import dev.certforge.support.EditorialFixtures.Account;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

/**
 * The container-based engine (ADR 0030) through the real HTTP/auth stack, against a real local
 * Docker daemon -- unlike {@link LabsSessionIT}, nothing here is mocked: there is no external paid
 * API to avoid calling, only this machine's own {@code docker}. Builds the shared image on first
 * run (cached by Docker afterward) and brings up a real {@code kind} cluster, so this is
 * meaningfully slower than the rest of the suite -- it exists because this is exactly the pipeline
 * that was hand-verified before ADR 0030 was written, and that verification is worth keeping as a
 * real, automated regression test, not only a one-time manual check.
 */
@SpringBootTest(
    properties = {
      "certforge.identity.bootstrap-admin.email=labs-container-admin@example.com",
      "certforge.identity.bootstrap-admin.password=correct horse battery"
    })
@AutoConfigureMockMvc
@Testcontainers
class LabsContainerSessionIT {

  private static final String LAB_ID = "service-selector-mismatch-v1";

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired MockMvc mvc;

  private Account learner;

  @BeforeEach
  void prepare() throws Exception {
    learner = new EditorialFixtures(mvc, "labs-container-admin@example.com").user();
  }

  @Test
  void startsARealClusterAndGradesTheShippedBuggyFixtureAsNotPassed() throws Exception {
    String body =
        mvc.perform(
                post("/api/labs/" + LAB_ID + "/sessions").with(csrf()).cookie(learner.session()))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.labId").value(LAB_ID))
            .andExpect(jsonPath("$.interactiveUrl").value(endsWith("/terminal")))
            .andExpect(jsonPath("$.interactiveToken").isNotEmpty())
            .andReturn()
            .getResponse()
            .getContentAsString();
    String sessionId = JsonPath.read(body, "$.sessionId");

    mvc.perform(
            post("/api/labs/sessions/" + sessionId + "/complete")
                .with(csrf())
                .cookie(learner.session()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.passed").value(false))
        .andExpect(jsonPath("$.checks[0].passed").value(false));
  }
}
