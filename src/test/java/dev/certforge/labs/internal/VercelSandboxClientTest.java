package dev.certforge.labs.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import dev.certforge.labs.Egress;
import dev.certforge.labs.LabEvaluation;
import dev.certforge.labs.LabFilesystem;
import dev.certforge.labs.LabFixture;
import dev.certforge.labs.LabImage;
import dev.certforge.labs.LabNetwork;
import dev.certforge.labs.LabObjective;
import dev.certforge.labs.LabSandbox;
import dev.certforge.labs.LabSpec;
import java.util.List;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

/**
 * Exercises {@link VercelSandboxClient} against a mocked HTTP layer -- never the real Vercel API,
 * which no CI run has a credential for.
 */
class VercelSandboxClientTest {

  private static final VercelSandboxProperties PROPERTIES =
      new VercelSandboxProperties("test-token", "team_123", "prj_123");

  private RestClient.Builder builder;
  private MockRestServiceServer server;

  private VercelSandboxClient newClient() {
    builder = RestClient.builder();
    server = MockRestServiceServer.bindTo(builder).build();
    return new VercelSandboxClient(builder, PROPERTIES);
  }

  private static LabSpec specWithEgress(Egress egress) {
    return new LabSpec(
        "docker-multistage-bloat-v1",
        new LabImage(
            "docker.io/library/busybox@sha256:"
                + "73aaf090f3d85aa34ee199857f03fa3a95c8ede2ffd4cc2cdb5b94e566b11662"),
        new LabFixture("docker-multistage-bloat-v1"),
        new LabObjective("Fix a Docker multi-stage build", "..."),
        List.of("docker"),
        new LabSandbox(1, 900, false),
        new LabNetwork(egress),
        new LabFilesystem(512),
        new LabEvaluation(dev.certforge.labs.EvaluationType.DETERMINISTIC_PROBE, List.of()));
  }

  @Test
  void createsASessionAndReturnsItsId() {
    VercelSandboxClient client = newClient();
    server
        .expect(requestTo("https://api.vercel.com/v2/sandboxes?teamId=team_123"))
        .andExpect(method(HttpMethod.POST))
        .andExpect(header("Authorization", "Bearer test-token"))
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(content().string(Matchers.containsString("\"persistent\":false")))
        .andRespond(
            withSuccess("{\"session\":{\"id\":\"sbx_abc123\"}}", MediaType.APPLICATION_JSON));

    String sessionId = client.createSession(specWithEgress(Egress.NONE));

    assertThat(sessionId).isEqualTo("sbx_abc123");
    server.verify();
  }

  @Test
  void refusesEgressOtherThanNoneRatherThanGuessingItsShape() {
    VercelSandboxClient client = newClient();

    assertThatThrownBy(() -> client.createSession(specWithEgress(Egress.IMAGE_PULL_ONLY)))
        .isInstanceOf(UnsupportedOperationException.class);
  }

  @Test
  void runsACommandToCompletionAndReturnsItsExitCode() {
    VercelSandboxClient client = newClient();
    server
        .expect(
            requestTo(
                "https://api.vercel.com/v2/sandboxes/sessions/sbx_abc123/cmd?teamId=team_123"))
        .andExpect(method(HttpMethod.POST))
        .andExpect(content().string(Matchers.containsString("\"wait\":true")))
        .andRespond(
            withSuccess(
                "{\"command\":{\"id\":\"cmd_1\",\"exitCode\":0}}", MediaType.APPLICATION_JSON));

    int exitCode = client.runToCompletion("sbx_abc123", "sh", List.of("-c", "true"), false, 5000);

    assertThat(exitCode).isZero();
    server.verify();
  }

  @Test
  void startsADetachedCommandWithoutWaiting() {
    VercelSandboxClient client = newClient();
    server
        .expect(
            requestTo(
                "https://api.vercel.com/v2/sandboxes/sessions/sbx_abc123/cmd?teamId=team_123"))
        .andExpect(method(HttpMethod.POST))
        .andExpect(content().string(Matchers.containsString("\"wait\":false")))
        .andExpect(content().string(Matchers.containsString("\"sudo\":true")))
        .andRespond(
            withSuccess(
                "{\"command\":{\"id\":\"cmd_2\",\"exitCode\":null}}", MediaType.APPLICATION_JSON));

    client.startDetached("sbx_abc123", "dockerd", List.of(), true);

    server.verify();
  }

  @Test
  void opensInteractiveAccessAndReturnsTheCredential() {
    VercelSandboxClient client = newClient();
    server
        .expect(
            requestTo(
                "https://api.vercel.com/v2/sandboxes/sessions/sbx_abc123/interactive?teamId=team_123"))
        .andExpect(method(HttpMethod.POST))
        .andRespond(
            withSuccess(
                "{\"url\":\"wss://example.com/pty\",\"token\":\"tok_1\"}",
                MediaType.APPLICATION_JSON));

    var credential = client.openInteractive("sbx_abc123");

    assertThat(credential.url()).isEqualTo("wss://example.com/pty");
    assertThat(credential.token()).isEqualTo("tok_1");
    server.verify();
  }

  @Test
  void stopsASession() {
    VercelSandboxClient client = newClient();
    server
        .expect(
            requestTo(
                "https://api.vercel.com/v2/sandboxes/sessions/sbx_abc123/stop?teamId=team_123"))
        .andExpect(method(HttpMethod.POST))
        .andRespond(withSuccess());

    client.stop("sbx_abc123");

    server.verify();
  }
}
