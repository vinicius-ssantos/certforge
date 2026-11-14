package dev.certforge.labs.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.certforge.support.EditorialFixtures;
import dev.certforge.support.EditorialFixtures.Account;
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

/**
 * The learner-facing surface of {@link LabsController}, through the real HTTP and auth stack, with
 * {@link VercelSandboxClient} replaced by a mock -- the real Vercel API is {@link
 * VercelSandboxClientTest}'s job, and no CI run has a credential for it.
 */
@SpringBootTest(
    properties = {
      "certforge.identity.bootstrap-admin.email=labs-admin@example.com",
      "certforge.identity.bootstrap-admin.password=correct horse battery"
    })
@AutoConfigureMockMvc
@Testcontainers
class LabsSessionIT {

  private static final String DOCKER_LAB = "docker-multistage-bloat-v1";

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @TestConfiguration
  static class Config {
    @Bean
    @Primary
    VercelSandboxClient mockVercelSandboxClient() {
      return mock(VercelSandboxClient.class);
    }
  }

  @Autowired MockMvc mvc;
  @Autowired VercelSandboxClient client;

  private Account learner;

  @BeforeEach
  void prepare() throws Exception {
    learner = new EditorialFixtures(mvc, "labs-admin@example.com").user();
  }

  @Test
  void startsProvisionsDockerAndGradesTheShippedDockerLab() throws Exception {
    when(client.createSession(any())).thenReturn("sbx_1");
    when(client.openInteractive("sbx_1"))
        .thenReturn(new VercelSandboxClient.InteractiveCredential("wss://example.com/pty", "tok"));

    mvc.perform(
            post("/api/labs/" + DOCKER_LAB + "/sessions").with(csrf()).cookie(learner.session()))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.sessionId").value("sbx_1"))
        .andExpect(jsonPath("$.labId").value(DOCKER_LAB))
        .andExpect(jsonPath("$.interactiveUrl").value("wss://example.com/pty"))
        .andExpect(jsonPath("$.interactiveToken").value("tok"));

    verify(client).startDetached("sbx_1", "dockerd", List.of(), true);

    when(client.runToCompletion(eq("sbx_1"), eq("sh"), any(), eq(false), anyLong())).thenReturn(0);

    mvc.perform(post("/api/labs/sessions/sbx_1/complete").with(csrf()).cookie(learner.session()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.passed").value(true))
        .andExpect(jsonPath("$.checks").isArray());

    verify(client).stop("sbx_1");
  }

  @Test
  void refusesToStartALabThatIsNotShipped() throws Exception {
    mvc.perform(post("/api/labs/does-not-exist/sessions").with(csrf()).cookie(learner.session()))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("lab_not_found"));
  }

  @Test
  void refusesToCompleteASessionThatWasNeverStarted() throws Exception {
    mvc.perform(
            post("/api/labs/sessions/never-started/complete")
                .with(csrf())
                .cookie(learner.session()))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value("lab_session_not_found"));
  }

  @Test
  void refusesAnonymousCallers() throws Exception {
    assertThat(
            mvc.perform(post("/api/labs/" + DOCKER_LAB + "/sessions").with(csrf()))
                .andReturn()
                .getResponse()
                .getStatus())
        .isEqualTo(401);
  }
}
