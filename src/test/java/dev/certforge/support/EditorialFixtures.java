package dev.certforge.support;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

/**
 * Test-only helper that drives the real editorial API to put published questions and signed-in
 * accounts in place. It uses throwaway accounts and says nothing about real content review.
 */
public final class EditorialFixtures {

  public static final String PASSWORD = "correct horse battery";
  private static final String SESSION_COOKIE = "CERTFORGE_SESSION";
  private static final AtomicInteger IP_SEQUENCE = new AtomicInteger();

  /** A signed-in test account. */
  public record Account(UUID id, String email, Cookie session) {}

  /** A question revision created by {@link #publish}. */
  public record Published(String questionId, String revisionId) {}

  private final MockMvc mvc;
  private final Cookie admin;
  private Account editor;
  private Account reviewer;

  /** Signs in the bootstrap administrator the test context was configured with. */
  public EditorialFixtures(MockMvc mvc, String adminEmail) throws Exception {
    this.mvc = mvc;
    this.admin = login(adminEmail);
  }

  public Cookie adminSession() {
    return admin;
  }

  /** Registers a new account, grants it the roles through the administrator, and signs it in. */
  public Account user(String... roles) throws Exception {
    String email = "fx-" + UUID.randomUUID() + "@example.com";
    MvcResult registered =
        mvc.perform(
                post("/api/auth/register")
                    .with(csrf())
                    .with(freshIp())
                    .contentType("application/json")
                    .content(credentials(email)))
            .andExpect(status().isCreated())
            .andReturn();
    UUID id =
        UUID.fromString(
            JsonPath.read(registered.getResponse().getContentAsString(), "$.id").toString());
    if (roles.length > 0) {
      mvc.perform(
              put("/api/admin/accounts/" + id + "/roles")
                  .with(csrf())
                  .cookie(admin)
                  .contentType("application/json")
                  .content("{\"roles\":[\"" + String.join("\",\"", roles) + "\"]}"))
          .andExpect(status().isOk());
    }
    return new Account(id, email, login(email));
  }

  /** Creates a complete single-choice question (option A is correct) and publishes it. */
  public Published publish(String topicId, String prompt) throws Exception {
    return publishBody(questionBody(topicId, prompt, "A"));
  }

  /** A single-choice question whose correct option is the given key, A or B. */
  public Published publishWithCorrect(String topicId, String prompt, String correctKey)
      throws Exception {
    return publishBody(questionBody(topicId, prompt, correctKey));
  }

  /** A multiple-choice question whose correct options are A and C, out of A, B and C. */
  public Published publishMultiple(String topicId, String prompt) throws Exception {
    return publishBody(multipleBody(topicId, prompt));
  }

  private Published publishBody(String body) throws Exception {
    Account author = editor();
    MvcResult created =
        send(post("/api/admin/questions"), author.session(), body)
            .andExpect(status().isCreated())
            .andReturn();
    String content = created.getResponse().getContentAsString();
    String questionId = JsonPath.read(content, "$.id");
    String revisionId = JsonPath.read(content, "$.revisions[0].id");
    advance(revisionId);
    return new Published(questionId, revisionId);
  }

  /** Publishes a corrected revision of an already published question and returns its id. */
  public String replace(String questionId, String newPrompt, String topicId) throws Exception {
    return replaceWithCorrect(questionId, newPrompt, topicId, "A");
  }

  /** Like {@link #replace} but the corrected revision has a different correct option. */
  public String replaceWithCorrect(
      String questionId, String newPrompt, String topicId, String correctKey) throws Exception {
    Account author = editor();
    MvcResult created =
        send(post("/api/admin/questions/" + questionId + "/revisions"), author.session(), null)
            .andExpect(status().isCreated())
            .andReturn();
    java.util.List<String> ids =
        JsonPath.read(created.getResponse().getContentAsString(), "$.revisions[-1:].id");
    String revisionId = ids.get(0);
    send(
            put("/api/admin/question-revisions/" + revisionId),
            author.session(),
            questionBody(topicId, newPrompt, correctKey))
        .andExpect(status().isOk());
    advance(revisionId);
    return revisionId;
  }

  public void deprecate(String revisionId) throws Exception {
    send(post("/api/admin/question-revisions/" + revisionId + "/deprecate"), admin, null)
        .andExpect(status().isOk());
  }

  // ---- internals -----------------------------------------------------------------------------

  /** Submit, approve and publish, each by the role that owns the stage. */
  private void advance(String revisionId) throws Exception {
    send(post("/api/admin/question-revisions/" + revisionId + "/submit"), editor().session(), null)
        .andExpect(status().isOk());
    send(
            post("/api/admin/question-revisions/" + revisionId + "/approve"),
            reviewer().session(),
            "{}")
        .andExpect(status().isOk());
    send(post("/api/admin/question-revisions/" + revisionId + "/publish"), admin, null)
        .andExpect(status().isOk());
  }

  private Account editor() throws Exception {
    if (editor == null) {
      editor = user("EDITOR");
    }
    return editor;
  }

  private Account reviewer() throws Exception {
    if (reviewer == null) {
      reviewer = user("REVIEWER");
    }
    return reviewer;
  }

  private org.springframework.test.web.servlet.ResultActions send(
      MockHttpServletRequestBuilder request, Cookie session, String body) throws Exception {
    request.with(csrf()).cookie(session);
    if (body != null) {
      request.contentType("application/json").content(body);
    }
    return mvc.perform(request);
  }

  private Cookie login(String email) throws Exception {
    MvcResult result =
        mvc.perform(
                post("/api/auth/login")
                    .with(csrf())
                    .with(freshIp())
                    .contentType("application/json")
                    .content(credentials(email)))
            .andExpect(status().isOk())
            .andReturn();
    Cookie cookie = result.getResponse().getCookie(SESSION_COOKIE);
    assertThat(cookie).isNotNull();
    return cookie;
  }

  private static String credentials(String email) {
    return "{\"email\":\"" + email + "\",\"password\":\"" + PASSWORD + "\"}";
  }

  private static org.springframework.test.web.servlet.request.RequestPostProcessor freshIp() {
    String ip = "10.9." + (IP_SEQUENCE.incrementAndGet() / 250) + "." + (IP_SEQUENCE.get() % 250);
    return request -> {
      request.setRemoteAddr(ip);
      return request;
    };
  }

  private static String multipleBody(String topicId, String prompt) {
    return "{\"type\":\"MULTIPLE_CHOICE\",\"topicId\":\""
        + topicId
        + "\",\"javaRelease\":21,\"difficulty\":\"HARD\","
        + "\"difficultyRationale\":\"Fixture rationale\",\"prompt\":\""
        + prompt
        + "\",\"explanation\":\"Secret overall explanation\","
        + "\"options\":[{\"key\":\"A\",\"text\":\"First\",\"correct\":true,"
        + "\"explanation\":\"Secret why A\"},{\"key\":\"B\",\"text\":\"Second\","
        + "\"correct\":false,\"explanation\":\"Secret why B\"},{\"key\":\"C\","
        + "\"text\":\"Third\",\"correct\":true,\"explanation\":\"Secret why C\"}],"
        + "\"references\":[{\"title\":\"JLS\","
        + "\"url\":\"https://docs.oracle.com/javase/specs/jls/se21/html/index.html\"}]}";
  }

  private static String questionBody(String topicId, String prompt, String correctKey) {
    boolean aCorrect = "A".equals(correctKey);
    return "{\"type\":\"SINGLE_CHOICE\",\"topicId\":\""
        + topicId
        + "\",\"javaRelease\":21,\"difficulty\":\"MEDIUM\","
        + "\"difficultyRationale\":\"Fixture rationale\",\"prompt\":\""
        + prompt
        + "\",\"explanation\":\"Secret overall explanation\","
        + "\"options\":[{\"key\":\"A\",\"text\":\"First\",\"correct\":"
        + aCorrect
        + ","
        + "\"explanation\":\"Secret why A\"},{\"key\":\"B\",\"text\":\"Second\","
        + "\"correct\":"
        + !aCorrect
        + ",\"explanation\":\"Secret why B\"}],"
        + "\"references\":[{\"title\":\"JLS\","
        + "\"url\":\"https://docs.oracle.com/javase/specs/jls/se21/html/index.html\"}]}";
  }
}
