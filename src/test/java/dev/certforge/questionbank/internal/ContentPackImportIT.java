package dev.certforge.questionbank.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.PublishedQuestion;
import dev.certforge.questionbank.QuestionBank;
import jakarta.servlet.http.Cookie;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;
import tools.jackson.databind.json.JsonMapper;

/**
 * Loads the real content pack through the real importer against a running application, to show that
 * a maintainer can reproduce the content in any environment and that every item satisfies the
 * editorial rules. Approval and publication here use test accounts and exist only to exercise the
 * pack; they say nothing about whether the content has been technically reviewed.
 */
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = {
      "certforge.identity.bootstrap-admin.email=import-admin@example.com",
      "certforge.identity.bootstrap-admin.password=correct horse battery"
    })
@AutoConfigureMockMvc
@Testcontainers
class ContentPackImportIT {

  private static final String PASSWORD = "correct horse battery";
  private static final String SESSION_COOKIE = "CERTFORGE_SESSION";
  private static final int PACK_SIZE = 60;

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired MockMvc mvc;
  @Autowired JdbcTemplate jdbc;
  @Autowired QuestionBank bank;
  @Autowired JsonMapper json;

  @Value("${local.server.port}")
  int port;

  private static RequestPostProcessor ip(String address) {
    return request -> {
      request.setRemoteAddr(address);
      return request;
    };
  }

  private static String credentials(String email) {
    return "{\"email\":\"" + email + "\",\"password\":\"" + PASSWORD + "\"}";
  }

  private Cookie login(String email, String address) throws Exception {
    MvcResult result =
        mvc.perform(
                post("/api/auth/login")
                    .with(csrf())
                    .with(ip(address))
                    .contentType("application/json")
                    .content(credentials(email)))
            .andExpect(status().isOk())
            .andReturn();
    return result.getResponse().getCookie(SESSION_COOKIE);
  }

  /** Registers an account and grants it a role through the administrator. */
  private String account(String role, Cookie admin, String address) throws Exception {
    String email = role.toLowerCase() + "-" + UUID.randomUUID() + "@example.com";
    MvcResult registered =
        mvc.perform(
                post("/api/auth/register")
                    .with(csrf())
                    .with(ip(address))
                    .contentType("application/json")
                    .content(credentials(email)))
            .andExpect(status().isCreated())
            .andReturn();
    String id = JsonPath.read(registered.getResponse().getContentAsString(), "$.id");
    mvc.perform(
            put("/api/admin/accounts/" + id + "/roles")
                .with(csrf())
                .cookie(admin)
                .contentType("application/json")
                .content("{\"roles\":[\"" + role + "\"]}"))
        .andExpect(status().isOk());
    return email;
  }

  /** Runs the standalone importer exactly as a maintainer would and returns its output. */
  private String runImporter(String email) throws Exception {
    Path java = Path.of(System.getProperty("java.home"), "bin", "java");
    Process process =
        new ProcessBuilder(
                java.toString(),
                "content/ContentImporter.java",
                "--base-url",
                "http://localhost:" + port,
                "--email",
                email,
                "--password",
                PASSWORD)
            .redirectErrorStream(true)
            .start();
    String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    assertThat(process.waitFor(120, TimeUnit.SECONDS)).as("importer finished").isTrue();
    assertThat(process.exitValue()).as("importer output: %s", output).isZero();
    return output;
  }

  private int count(String status) {
    Integer total =
        jdbc.queryForObject(
            "select count(*) from certforge.qb_question_revision where status = ?",
            Integer.class,
            status);
    return total == null ? 0 : total;
  }

  @Test
  void importsThePackForReviewIsIdempotentAndEveryItemCanBePublished() throws Exception {
    Cookie admin = login("import-admin@example.com", "10.4.0.1");
    String editor = account("EDITOR", admin, "10.4.0.2");
    String reviewer = account("REVIEWER", admin, "10.4.0.3");

    // The importer creates every question and submits it for review, nothing more.
    String first = runImporter(editor);
    assertThat(first).contains("created=" + PACK_SIZE + " skipped=0 total=" + PACK_SIZE);
    assertThat(count("TECHNICAL_REVIEW")).isEqualTo(PACK_SIZE);
    assertThat(count("PUBLISHED")).isZero();
    assertThat(count("APPROVED")).isZero();
    assertThat(bank.eligibleForTopic(new TopicId(UUID.fromString(topic(1))))).isEmpty();

    // Running it again must not create duplicates.
    String second = runImporter(editor);
    assertThat(second).contains("created=0 skipped=" + PACK_SIZE + " total=" + PACK_SIZE);
    assertThat(count("TECHNICAL_REVIEW")).isEqualTo(PACK_SIZE);
    assertThat(jdbc.queryForObject("select count(*) from certforge.qb_question", Integer.class))
        .isEqualTo(PACK_SIZE);

    // Exercise the pack through review and publication with test accounts.
    Cookie reviewerSession = login(reviewer, "10.4.0.4");
    String listing =
        mvc.perform(get("/api/admin/questions?status=TECHNICAL_REVIEW").cookie(reviewerSession))
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();
    List<String> revisionIds = JsonPath.read(listing, "$[*].latestRevisionId");
    assertThat(revisionIds).hasSize(PACK_SIZE);
    for (String revisionId : revisionIds) {
      mvc.perform(
              post("/api/admin/question-revisions/" + revisionId + "/approve")
                  .with(csrf())
                  .cookie(reviewerSession)
                  .contentType("application/json")
                  .content("{}"))
          .andExpect(status().isOk());
      mvc.perform(
              post("/api/admin/question-revisions/" + revisionId + "/publish")
                  .with(csrf())
                  .cookie(admin))
          .andExpect(status().isOk());
    }
    assertThat(count("PUBLISHED")).isEqualTo(PACK_SIZE);

    // Every topic has questions, and what a learner can receive carries no answers.
    for (int i = 1; i <= 10; i++) {
      List<PublishedQuestion> eligible =
          bank.eligibleForTopic(new TopicId(UUID.fromString(topic(i))));
      assertThat(eligible).as("questions for topic %d", i).hasSizeGreaterThanOrEqualTo(2);
      for (PublishedQuestion question : eligible) {
        String serialized = json.writeValueAsString(question);
        assertThat(serialized)
            .doesNotContainIgnoringCase("explanation")
            .doesNotContainIgnoringCase("correct\"")
            .doesNotContainIgnoringCase("references");
      }
    }
  }

  private static String topic(int number) {
    return String.format("a3000000-0000-4000-8000-%012d", number);
  }
}
