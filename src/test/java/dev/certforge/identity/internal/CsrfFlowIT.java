package dev.certforge.identity.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.http.Cookie;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

/**
 * Exercises the real CSRF cookie contract. It never uses the spring-security-test {@code csrf()}
 * post-processor, which replaces the token repository of a shared application context, so it runs
 * in its own fresh context.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
class CsrfFlowIT {

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired MockMvc mvc;

  private static String registration() {
    return "{\"email\":\"csrf-"
        + UUID.randomUUID()
        + "@example.com\",\"password\":\"correct horse battery\"}";
  }

  @Test
  void issuesReadableCookieAndAcceptsItBackAsHeader() throws Exception {
    MvcResult csrf =
        mvc.perform(get("/api/auth/csrf"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.headerName").value("X-XSRF-TOKEN"))
            .andReturn();
    Cookie cookie = csrf.getResponse().getCookie("XSRF-TOKEN");
    assertThat(cookie).isNotNull();
    // Readable by the SPA so it can echo the value in the header.
    assertThat(cookie.isHttpOnly()).isFalse();

    mvc.perform(
            post("/api/auth/register")
                .cookie(cookie)
                .header("X-XSRF-TOKEN", cookie.getValue())
                .contentType("application/json")
                .content(registration()))
        .andExpect(status().isCreated());
  }

  @Test
  void rejectsMismatchedOrMissingHeader() throws Exception {
    Cookie cookie =
        mvc.perform(get("/api/auth/csrf")).andReturn().getResponse().getCookie("XSRF-TOKEN");
    assertThat(cookie).isNotNull();

    mvc.perform(
            post("/api/auth/register")
                .cookie(cookie)
                .header("X-XSRF-TOKEN", "not-the-token")
                .contentType("application/json")
                .content(registration()))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value("csrf_invalid"));

    mvc.perform(
            post("/api/auth/register")
                .cookie(cookie)
                .contentType("application/json")
                .content(registration()))
        .andExpect(status().isForbidden());
  }
}
