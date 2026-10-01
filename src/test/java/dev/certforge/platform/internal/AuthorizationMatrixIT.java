package dev.certforge.platform.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import com.jayway.jsonpath.JsonPath;
import dev.certforge.identity.Role;
import jakarta.servlet.http.Cookie;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

/**
 * The authorization matrix, built from the application's own request mappings so that it cannot
 * fall out of date: an endpoint added without an access rule fails this test.
 *
 * <p>For every endpoint and for an account of each role it checks both directions. An account that
 * lacks every authority an endpoint asks for gets 403 (and an anonymous caller gets 401), and an
 * account that has one gets past authorization to the handler, whatever the handler then decides
 * about the data. It also checks that every state-changing endpoint refuses a request without the
 * CSRF token, even from a signed-in administrator. Requests carry valid bodies where the endpoint
 * validates them first, because method security runs after the body is read.
 */
@SpringBootTest(
    properties = {
      "certforge.identity.bootstrap-admin.email=matrix-admin@example.com",
      "certforge.identity.bootstrap-admin.password=correct horse battery staple"
    })
@AutoConfigureMockMvc
@Testcontainers
class AuthorizationMatrixIT {

  private static final String PASSWORD = "correct horse battery staple";
  private static final String SESSION_COOKIE = "CERTFORGE_SESSION";
  private static final AtomicInteger IP = new AtomicInteger();
  private static final Pattern AUTHORITY = Pattern.compile("'([A-Z_]+)'");
  private static final Pattern PATH_VARIABLE = Pattern.compile("\\{([A-Za-z]+)}");
  private static final String ANY_ID = "7c9e6679-7425-40de-944b-e07fc1f90ae7";

  /** Reachable without signing in, or by anyone signed in; they have no permission of their own. */
  private static final Set<String> OPEN =
      Set.of(
          "GET /api/auth/csrf",
          "POST /api/auth/register",
          "POST /api/auth/login",
          "GET /api/auth/me");

  /** Endpoints that validate their body before method security runs, with a valid one. */
  private static final Map<String, String> BODIES =
      Map.ofEntries(
          Map.entry(
              "POST /api/admin/catalog/tracks",
              "{\"slug\":\"matrix\",\"name\":\"M\",\"provider\":\"P\",\"certificationName\":\"C\"}"),
          Map.entry(
              "POST /api/admin/catalog/tracks/{trackId}/exam-versions",
              "{\"label\":\"L\",\"examCode\":\"E\",\"examName\":\"N\",\"javaRelease\":21,"
                  + "\"objectivesUrl\":\"https://example.com/objectives\"}"),
          Map.entry(
              "PUT /api/admin/catalog/exam-versions/{examVersionId}/topics", "{\"topics\":[]}"),
          Map.entry(
              "POST /api/admin/catalog/tracks/{trackId}/topics",
              "{\"slug\":\"matrix\",\"name\":\"M\"}"),
          Map.entry("PUT /api/admin/catalog/topics/{topicId}", "{\"name\":\"M\"}"),
          Map.entry("PUT /api/admin/accounts/{id}/roles", "{\"roles\":[\"LEARNER\"]}"),
          Map.entry("POST /api/admin/questions", "{\"type\":\"SINGLE_CHOICE\"}"),
          Map.entry(
              "PUT /api/admin/question-revisions/{revisionId}", "{\"type\":\"SINGLE_CHOICE\"}"),
          Map.entry(
              "POST /api/admin/question-revisions/{revisionId}/request-changes",
              "{\"comment\":\"matrix\"}"),
          Map.entry("POST /api/study/sessions", "{\"topicId\":\"" + ANY_ID + "\"}"),
          Map.entry(
              "POST /api/study/sessions/{sessionId}/questions/{position}/attempt",
              "{\"selectedOptions\":[\"A\"],\"confidence\":\"LOW\",\"elapsedMillis\":1}"));

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired MockMvc mvc;

  @Autowired
  @org.springframework.beans.factory.annotation.Qualifier("requestMappingHandlerMapping")
  RequestMappingHandlerMapping mappings;

  private static final Map<String, Cookie> SESSIONS = new TreeMap<>();

  record Endpoint(String key, HttpMethod method, String path, Set<String> authorities) {}

  // ---- the accounts: one per role -------------------------------------------------------------

  private static RequestPostProcessor freshIp() {
    String ip = "10.9." + (IP.incrementAndGet() / 250) + "." + (IP.get() % 250);
    return request -> {
      request.setRemoteAddr(ip);
      return request;
    };
  }

  private Cookie login(String email) throws Exception {
    MvcResult result =
        mvc.perform(
                post("/api/auth/login")
                    .with(csrf())
                    .with(freshIp())
                    .contentType("application/json")
                    .content("{\"email\":\"" + email + "\",\"password\":\"" + PASSWORD + "\"}"))
            .andReturn();
    assertThat(result.getResponse().getStatus()).as("login " + email).isEqualTo(200);
    return result.getResponse().getCookie(SESSION_COOKIE);
  }

  private void account(Role role, Cookie admin) throws Exception {
    String email = "matrix-" + role.name().toLowerCase() + "-" + UUID.randomUUID() + "@example.com";
    MvcResult registered =
        mvc.perform(
                post("/api/auth/register")
                    .with(csrf())
                    .with(freshIp())
                    .contentType("application/json")
                    .content("{\"email\":\"" + email + "\",\"password\":\"" + PASSWORD + "\"}"))
            .andReturn();
    String id = JsonPath.read(registered.getResponse().getContentAsString(), "$.id");
    mvc.perform(
            put("/api/admin/accounts/" + id + "/roles")
                .with(csrf())
                .cookie(admin)
                .contentType("application/json")
                .content("{\"roles\":[\"" + role.name() + "\"]}"))
        .andReturn();
    SESSIONS.put(role.name(), login(email));
  }

  @org.junit.jupiter.api.BeforeEach
  void accounts() throws Exception {
    if (!SESSIONS.isEmpty()) {
      return;
    }
    Cookie admin = login("matrix-admin@example.com");
    SESSIONS.put(Role.ADMINISTRATOR.name(), admin);
    for (Role role : EnumSet.of(Role.LEARNER, Role.EDITOR, Role.REVIEWER)) {
      account(role, admin);
    }
  }

  // ---- the endpoints, read from the application -----------------------------------------------

  private List<Endpoint> endpoints() {
    List<Endpoint> found = new ArrayList<>();
    for (Map.Entry<RequestMappingInfo, HandlerMethod> entry :
        mappings.getHandlerMethods().entrySet()) {
      HandlerMethod handler = entry.getValue();
      if (!handler.getBeanType().getPackageName().startsWith("dev.certforge")) {
        continue;
      }
      Set<String> authorities = authoritiesOf(handler.getMethod(), handler.getBeanType());
      for (String pattern : entry.getKey().getPathPatternsCondition().getPatternValues()) {
        for (var method : entry.getKey().getMethodsCondition().getMethods()) {
          HttpMethod http = HttpMethod.valueOf(method.name());
          found.add(new Endpoint(http + " " + pattern, http, pattern, authorities));
        }
      }
    }
    return found;
  }

  private static Set<String> authoritiesOf(Method method, Class<?> type) {
    PreAuthorize rule = AnnotatedElementUtils.findMergedAnnotation(method, PreAuthorize.class);
    if (rule == null) {
      rule = AnnotatedElementUtils.findMergedAnnotation(type, PreAuthorize.class);
    }
    Set<String> authorities = new HashSet<>();
    if (rule != null) {
      Matcher matcher = AUTHORITY.matcher(rule.value());
      while (matcher.find()) {
        authorities.add(matcher.group(1));
      }
    }
    return authorities;
  }

  /** What an account holding this role can do. Every account is also a learner (ADR 0008). */
  private static Set<String> authoritiesOf(Role role) {
    Set<String> granted = new HashSet<>();
    Role.LEARNER.permissions().forEach(permission -> granted.add(permission.name()));
    role.permissions().forEach(permission -> granted.add(permission.name()));
    return granted;
  }

  private static String concrete(String pattern) {
    Matcher matcher = PATH_VARIABLE.matcher(pattern);
    StringBuilder out = new StringBuilder();
    while (matcher.find()) {
      String name = matcher.group(1);
      matcher.appendReplacement(
          out, name.equals("position") ? "0" : name.equals("slug") ? "x" : ANY_ID);
    }
    matcher.appendTail(out);
    return out.toString();
  }

  private MockHttpServletRequestBuilder request(Endpoint endpoint) {
    String url = concrete(endpoint.path());
    MockHttpServletRequestBuilder builder =
        switch (endpoint.method().name()) {
          case "GET" -> get(url);
          case "PUT" -> put(url);
          default -> post(url);
        };
    String body = BODIES.get(endpoint.key());
    if (body != null) {
      builder.contentType("application/json").content(body);
    }
    if (endpoint.path().endsWith("/attempt") && endpoint.method() == HttpMethod.POST) {
      builder.header("Idempotency-Key", UUID.randomUUID().toString());
    }
    return builder;
  }

  // ---- the matrix -----------------------------------------------------------------------------

  @Test
  void everyEndpointHasAnExplicitAccessRule() {
    List<String> unclassified =
        endpoints().stream()
            .filter(endpoint -> endpoint.authorities().isEmpty() && !OPEN.contains(endpoint.key()))
            .map(Endpoint::key)
            .toList();

    assertThat(unclassified)
        .as("endpoints with neither a @PreAuthorize rule nor a place in the open list")
        .isEmpty();
    assertThat(endpoints())
        .as("the matrix found the application's endpoints")
        .hasSizeGreaterThan(30);
  }

  @Test
  void anonymousCallersAreRefusedEverywhereExceptTheOpenEndpoints() throws Exception {
    List<String> wrong = new ArrayList<>();
    for (Endpoint endpoint : endpoints()) {
      if (OPEN.contains(endpoint.key())) {
        continue;
      }
      int status =
          mvc.perform(request(endpoint).with(csrf())).andReturn().getResponse().getStatus();
      if (status != 401) {
        wrong.add(endpoint.key() + " -> " + status);
      }
    }
    assertThat(wrong).as("anonymous responses other than 401").isEmpty();
  }

  @Test
  void eachRoleIsRefusedWhatItLacksAndAdmittedToWhatItHas() throws Exception {
    List<String> wrong = new ArrayList<>();
    int refused = 0;
    int admitted = 0;
    for (Role role : EnumSet.of(Role.LEARNER, Role.EDITOR, Role.REVIEWER, Role.ADMINISTRATOR)) {
      Cookie session = SESSIONS.get(role.name());
      Set<String> has = authoritiesOf(role);
      for (Endpoint endpoint : endpoints()) {
        if (endpoint.authorities().isEmpty()) {
          continue;
        }
        boolean allowed = endpoint.authorities().stream().anyMatch(has::contains);
        int status =
            mvc.perform(request(endpoint).with(csrf()).cookie(session))
                .andReturn()
                .getResponse()
                .getStatus();
        if (allowed) {
          admitted++;
          // Past authorization: the handler may still say 400, 404 or 409 about the data.
          if (status == 401 || status == 403 || status >= 500) {
            wrong.add(role + " should reach " + endpoint.key() + " but got " + status);
          }
        } else {
          refused++;
          if (status != 403) {
            wrong.add(role + " should be refused " + endpoint.key() + " but got " + status);
          }
        }
      }
    }
    assertThat(wrong).isEmpty();
    assertThat(refused).as("the matrix refused something").isGreaterThan(50);
    assertThat(admitted).as("the matrix admitted something").isGreaterThan(30);
  }

  @Test
  void stateChangingEndpointsRefuseARequestWithoutTheCsrfToken() throws Exception {
    List<String> wrong = new ArrayList<>();
    Cookie admin = SESSIONS.get(Role.ADMINISTRATOR.name());
    for (Endpoint endpoint : endpoints()) {
      if (endpoint.method() == HttpMethod.GET) {
        continue;
      }
      int status =
          mvc.perform(request(endpoint).cookie(admin)).andReturn().getResponse().getStatus();
      if (status != 403) {
        wrong.add(endpoint.key() + " -> " + status);
      }
    }
    assertThat(wrong)
        .as("state-changing requests accepted or mishandled without a CSRF token")
        .isEmpty();
  }

  @BeforeAll
  static void clear() {
    SESSIONS.clear();
  }
}
