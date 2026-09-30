package dev.certforge.support;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import dev.certforge.support.EditorialFixtures.Account;
import java.util.List;
import java.util.UUID;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

/** Test-only helper that drives the real study API: sessions and answers. */
public final class StudyFixtures {

  /** A started session and the revision id at each position. */
  public record Started(String id, List<String> revisions) {
    public int positionOf(String revisionId) {
      return revisions.indexOf(revisionId);
    }
  }

  private final MockMvc mvc;

  public StudyFixtures(MockMvc mvc) {
    this.mvc = mvc;
  }

  public Started start(Account as, String topic, int count) throws Exception {
    String body =
        mvc.perform(
                post("/api/study/sessions")
                    .with(csrf())
                    .cookie(as.session())
                    .contentType("application/json")
                    .content("{\"topicId\":\"" + topic + "\",\"questionCount\":" + count + "}"))
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();
    return new Started(
        JsonPath.read(body, "$.id"), JsonPath.read(body, "$.questions[*].question.revisionId"));
  }

  /** Submits an answer with a fresh idempotency key and returns the raw result. */
  public ResultActions answer(
      Account as, Started session, int position, String confidence, long elapsed, String... options)
      throws Exception {
    return mvc.perform(
        post("/api/study/sessions/" + session.id() + "/questions/" + position + "/attempt")
            .with(csrf())
            .cookie(as.session())
            .header("Idempotency-Key", "fx-" + UUID.randomUUID())
            .contentType("application/json")
            .content(
                "{\"selectedOptions\":[\""
                    + String.join("\",\"", options)
                    + "\"],\"confidence\":\""
                    + confidence
                    + "\",\"elapsedMillis\":"
                    + elapsed
                    + "}"));
  }

  /** Answers and requires the answer to be accepted. */
  public void answerOk(Account as, Started session, int position, String... options)
      throws Exception {
    answer(as, session, position, "MEDIUM", 1000, options).andExpect(status().isCreated());
  }

  public void complete(Account as, Started session) throws Exception {
    close(as, session, "complete");
  }

  public void abandon(Account as, Started session) throws Exception {
    close(as, session, "abandon");
  }

  private void close(Account as, Started session, String action) throws Exception {
    mvc.perform(
            post("/api/study/sessions/" + session.id() + "/" + action)
                .with(csrf())
                .cookie(as.session()))
        .andExpect(status().isOk());
  }
}
