package dev.certforge.platform.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import com.jayway.jsonpath.JsonPath;
import jakarta.servlet.http.Cookie;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

/**
 * Every failure, including the ones the web framework raises before any controller runs (an unknown
 * path, a method or content type the endpoint does not take), answers with the same problem body: a
 * stable {@code code}, the request id and nothing about the server's internals.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class FrameworkErrorContractIT {

  private static final String PASSWORD = "correct horse battery staple";

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired MockMvc mvc;

  private Cookie session;

  private static RequestPostProcessor address(String ip) {
    return request -> {
      request.setRemoteAddr(ip);
      return request;
    };
  }

  @BeforeEach
  void signIn() throws Exception {
    String email = "errors-" + UUID.randomUUID() + "@example.com";
    String credentials = "{\"email\":\"" + email + "\",\"password\":\"" + PASSWORD + "\"}";
    mvc.perform(
            post("/api/auth/register")
                .with(csrf())
                .with(
                    address(
                        "10.8." + (int) (Math.random() * 250) + "." + (int) (Math.random() * 250)))
                .contentType("application/json")
                .content(credentials))
        .andReturn();
    MvcResult login =
        mvc.perform(
                post("/api/auth/login")
                    .with(csrf())
                    .with(
                        address(
                            "10.7."
                                + (int) (Math.random() * 250)
                                + "."
                                + (int) (Math.random() * 250)))
                    .contentType("application/json")
                    .content(credentials))
            .andReturn();
    session = login.getResponse().getCookie("CERTFORGE_SESSION");
  }

  private void assertContract(MvcResult result, int status, String code) throws Exception {
    String body = result.getResponse().getContentAsString();
    assertThat(result.getResponse().getStatus()).as(body).isEqualTo(status);
    assertThat(result.getResponse().getContentType()).contains("application/problem+json");
    assertThat((String) JsonPath.read(body, "$.code")).isEqualTo(code);
    assertThat((String) JsonPath.read(body, "$.requestId")).isNotBlank();
    assertThat(body)
        .doesNotContain("Exception")
        .doesNotContain("org.springframework")
        .doesNotContain("static resource");
  }

  @Test
  void anUnknownPathIsNotFoundInTheContract() throws Exception {
    assertContract(
        mvc.perform(get("/api/nothing-here").cookie(session)).andReturn(), 404, "not_found");
  }

  @Test
  void aMethodTheEndpointDoesNotTakeIsRefusedInTheContract() throws Exception {
    assertContract(
        mvc.perform(post("/api/catalog/tracks").with(csrf()).cookie(session)).andReturn(),
        405,
        "method_not_allowed");
  }

  @Test
  void aContentTypeTheEndpointDoesNotTakeIsRefusedInTheContract() throws Exception {
    assertContract(
        mvc.perform(
                post("/api/study/sessions")
                    .with(csrf())
                    .cookie(session)
                    .contentType("text/plain")
                    .content("hello"))
            .andReturn(),
        415,
        "unsupported_media_type");
  }

  @Test
  void aRepresentationTheClientAsksForButWeDoNotOfferIsRefusedInTheContract() throws Exception {
    assertContract(
        mvc.perform(get("/api/catalog/tracks").cookie(session).accept("application/xml"))
            .andReturn(),
        406,
        "not_acceptable");
  }
}
