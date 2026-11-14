package dev.certforge.labs.internal;

import dev.certforge.labs.Egress;
import dev.certforge.labs.LabSpec;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

/**
 * A thin wrapper over the Vercel Sandbox REST API (ADR 0028). {@code create}/{@code cmd}/ {@code
 * stop} are documented (https://vercel.com/docs/rest-api/sandboxes/...); the interactive endpoint
 * has no such page and was confirmed instead by reading {@code @vercel/sandbox}'s own shipped
 * source ({@code dist/api-client/api-client.js}), which calls exactly the request this class sends
 * -- not a guessed contract.
 */
final class VercelSandboxClient {

  private static final String BASE_URL = "https://api.vercel.com";

  private final RestClient restClient;
  private final VercelSandboxProperties properties;

  VercelSandboxClient(RestClient.Builder restClientBuilder, VercelSandboxProperties properties) {
    this.restClient =
        restClientBuilder
            .baseUrl(BASE_URL)
            .defaultHeader("Authorization", "Bearer " + properties.token())
            .defaultHeader("Content-Type", "application/json")
            .build();
    this.properties = properties;
  }

  /**
   * Creates a session for the {@code LabSpec}'s pinned image (ADR 0028 decision 2: {@code
   * persistent} is always exactly what the spec says, which {@code LabSpecValidator} already
   * requires to be {@code false}). Returns the new session's id.
   *
   * <p>Only {@code egress: NONE} is implemented: it is all any shipped {@code LabSpec} needs today,
   * and {@code image-pull-only}'s registry-scoped allow-list shape has not been exercised against
   * the real API yet -- this refuses to guess it.
   */
  String createSession(LabSpec spec) {
    if (spec.network().egress() != Egress.NONE) {
      throw new UnsupportedOperationException(
          "egress other than NONE is not implemented yet: " + spec.network().egress());
    }
    int vcpus = spec.sandbox().vcpus();
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("projectId", properties.projectId());
    body.put("image", spec.image().ref());
    body.put("resources", Map.of("vcpus", vcpus, "memory", vcpus * 2048));
    body.put("timeout", spec.sandbox().timeoutSeconds() * 1000L);
    body.put("persistent", spec.sandbox().persistent());
    body.put("networkPolicy", Map.of("mode", "deny-all"));

    JsonNode json =
        restClient
            .post()
            .uri("/v2/sandboxes?teamId={teamId}", properties.teamId())
            .body(body)
            .retrieve()
            .body(JsonNode.class);
    return requireText(json, "session", "id");
  }

  /**
   * Runs one command to completion inside the given session and returns its exit code. {@code sudo}
   * and {@code timeoutMs} map directly onto the {@code cmd} endpoint's own fields; there is no
   * shell, so {@code args} are passed exactly as given, never joined and re-interpreted.
   */
  int runToCompletion(
      String sessionId, String command, List<String> args, boolean sudo, long timeoutMs) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("command", command);
    body.put("args", args);
    body.put("sudo", sudo);
    body.put("wait", true);
    body.put("timeout", timeoutMs);

    JsonNode json =
        restClient
            .post()
            .uri(
                "/v2/sandboxes/sessions/{sessionId}/cmd?teamId={teamId}",
                sessionId,
                properties.teamId())
            .body(body)
            .retrieve()
            .body(JsonNode.class);
    JsonNode exitCode = json.path("command").path("exitCode");
    if (exitCode.isMissingNode() || exitCode.isNull()) {
      throw new IllegalStateException("command did not report an exit code: " + json);
    }
    return exitCode.asInt();
  }

  /**
   * Starts one command without waiting for it to finish (e.g. starting {@code dockerd} for the rest
   * of a session's lifetime). The command's own id is returned but not otherwise tracked here --
   * there is nothing for the orchestrator to do with a provisioning daemon's exit code.
   */
  void startDetached(String sessionId, String command, List<String> args, boolean sudo) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("command", command);
    body.put("args", args);
    body.put("sudo", sudo);
    body.put("wait", false);

    restClient
        .post()
        .uri(
            "/v2/sandboxes/sessions/{sessionId}/cmd?teamId={teamId}",
            sessionId,
            properties.teamId())
        .body(body)
        .retrieve()
        .body(JsonNode.class);
  }

  /**
   * Opens the learner's interactive terminal: a WebSocket URL and a one-time token for the browser
   * to connect directly to Vercel's controller-hosted PTY (ADR 0029). This project's backend relays
   * neither the connection nor the credential's use -- it hands the pair back to its own caller
   * once, here.
   */
  InteractiveCredential openInteractive(String sessionId) {
    JsonNode json =
        restClient
            .post()
            .uri(
                "/v2/sandboxes/sessions/{sessionId}/interactive?teamId={teamId}",
                sessionId,
                properties.teamId())
            .body(Map.of())
            .retrieve()
            .body(JsonNode.class);
    return new InteractiveCredential(requireText(json, "url"), requireText(json, "token"));
  }

  /**
   * Stops the session unconditionally (ADR 0027 decision 5 / ADR 0028 decision 2) -- with {@code
   * persistent: false} already set at creation, nothing is left to resume from.
   */
  void stop(String sessionId) {
    restClient
        .post()
        .uri(
            "/v2/sandboxes/sessions/{sessionId}/stop?teamId={teamId}",
            sessionId,
            properties.teamId())
        .retrieve()
        .toBodilessEntity();
  }

  record InteractiveCredential(String url, String token) {}

  private static String requireText(JsonNode root, String... path) {
    JsonNode node = root;
    for (String segment : path) {
      node = node.path(segment);
    }
    if (node.isMissingNode() || node.isNull() || node.asString().isBlank()) {
      throw new IllegalStateException(
          "expected a non-blank string at " + String.join(".", path) + " in " + root);
    }
    return node.asString();
  }
}
