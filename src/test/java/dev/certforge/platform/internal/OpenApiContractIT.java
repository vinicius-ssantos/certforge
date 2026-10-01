package dev.certforge.platform.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.SerializationFeature;
import tools.jackson.databind.json.JsonMapper;
import tools.jackson.databind.node.ObjectNode;

/**
 * The OpenAPI contract is the single source of truth the web frontend is typed from. The generated
 * contract is committed as {@code web/openapi.json}; this test fails when the API and the committed
 * file disagree, so the frontend can never be built against a stale or hand-edited contract.
 *
 * <p>After changing the API, regenerate the file with {@code mvn -Dopenapi.update=true
 * -Dit.test=OpenApiContractIT verify} and commit it together with the regenerated TypeScript types
 * ({@code npm run api:generate} in {@code web/}).
 */
@SpringBootTest(properties = "springdoc.api-docs.enabled=true")
@AutoConfigureMockMvc
@Testcontainers
class OpenApiContractIT {

  private static final Path CONTRACT = Path.of("web", "openapi.json");

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired MockMvc mvc;

  private final JsonMapper canonical =
      JsonMapper.builder()
          .enable(SerializationFeature.INDENT_OUTPUT)
          .enable(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS)
          .build();

  /** The generated contract in a canonical form: sorted keys and no run-specific server URL. */
  private String generated() throws Exception {
    String raw =
        mvc.perform(get("/v3/api-docs"))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    JsonNode tree = canonical.readTree(raw);
    ((ObjectNode) tree).remove("servers");
    Object sorted = canonical.treeToValue(tree, Object.class);
    // Jackson indents with the platform line separator; the contract always uses LF.
    return canonical.writeValueAsString(sorted).replace("\r\n", "\n") + "\n";
  }

  @Test
  void theCommittedContractMatchesTheRunningApi() throws Exception {
    String current = generated();

    if (Boolean.getBoolean("openapi.update")) {
      Files.createDirectories(CONTRACT.getParent());
      Files.writeString(CONTRACT, current, StandardCharsets.UTF_8);
      return;
    }

    assertThat(CONTRACT).as("web/openapi.json is committed").exists();
    String committed = Files.readString(CONTRACT, StandardCharsets.UTF_8).replace("\r\n", "\n");
    assertThat(committed)
        .as(
            "web/openapi.json is out of date. Regenerate it with:"
                + " mvn -Dopenapi.update=true -Dit.test=OpenApiContractIT verify")
        .isEqualTo(current);
  }

  @Test
  void theContractCoversTheLearnerJourneyAndExposesNoEditorialAnswerKeysToLearners()
      throws Exception {
    String contract = generated();

    for (String path :
        new String[] {
          "/api/auth/login",
          "/api/auth/logout",
          "/api/auth/register",
          "/api/auth/csrf",
          "/api/auth/me",
          "/api/catalog/tracks",
          "/api/study/sessions",
          "/api/study/sessions/{sessionId}/questions/{position}/attempt",
          "/api/study/history/attempts",
          "/api/progress/topics"
        }) {
      assertThat(contract).as("contract path %s", path).contains("\"" + path + "\"");
    }
    // The learner-facing question schema must not carry the answer key.
    JsonNode schemas = canonical.readTree(contract).path("components").path("schemas");
    JsonNode published = schemas.path("PublishedQuestion");
    assertThat(published.isMissingNode()).isFalse();
    assertThat(published.path("properties").propertyNames())
        .doesNotContain("correct", "explanation", "references");
    JsonNode option = schemas.path("PublishedOption");
    assertThat(option.path("properties").propertyNames()).doesNotContain("correct", "explanation");
  }
}
