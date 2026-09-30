package dev.certforge.identity.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.certforge.identity.Role;
import jakarta.servlet.http.Cookie;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ExtendWith(OutputCaptureExtension.class)
class IdentityIT {

  private static final String PASSWORD = "correct horse battery";
  private static final String SESSION_COOKIE = "CERTFORGE_SESSION";
  private static final AtomicInteger IP_SEQUENCE = new AtomicInteger();

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired MockMvc mvc;
  @Autowired AccountService accounts;
  @Autowired JdbcTemplate jdbc;

  // ---- helpers -------------------------------------------------------------------------------

  /** A unique client address per call so the in-memory throttle never leaks between tests. */
  private static RequestPostProcessor freshIp() {
    String ip = "10.1." + (IP_SEQUENCE.incrementAndGet() / 250) + "." + (IP_SEQUENCE.get() % 250);
    return request -> {
      request.setRemoteAddr(ip);
      return request;
    };
  }

  private static RequestPostProcessor ip(String address) {
    return request -> {
      request.setRemoteAddr(address);
      return request;
    };
  }

  private static String email() {
    return "user-" + UUID.randomUUID() + "@example.com";
  }

  private static String credentials(String email, String password) {
    return "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
  }

  private Account provision(Set<Role> roles) {
    return accounts.create(email(), PASSWORD, roles);
  }

  private MvcResult login(String email, String password, RequestPostProcessor address)
      throws Exception {
    return mvc.perform(
            post("/api/auth/login")
                .with(csrf())
                .with(address)
                .contentType("application/json")
                .content(credentials(email, password)))
        .andReturn();
  }

  private Cookie sessionFor(Account account) throws Exception {
    MvcResult result = login(account.email(), PASSWORD, freshIp());
    assertThat(result.getResponse().getStatus()).isEqualTo(200);
    Cookie cookie = result.getResponse().getCookie(SESSION_COOKIE);
    assertThat(cookie).isNotNull();
    return cookie;
  }

  private int meStatus(Cookie session) throws Exception {
    return mvc.perform(get("/api/auth/me").cookie(session)).andReturn().getResponse().getStatus();
  }

  private int assignRolesStatus(Cookie session, UUID target, String rolesJson) throws Exception {
    var request =
        put("/api/admin/accounts/" + target + "/roles")
            .with(csrf())
            .contentType("application/json")
            .content("{\"roles\":" + rolesJson + "}");
    if (session != null) {
      request.cookie(session);
    }
    return mvc.perform(request).andReturn().getResponse().getStatus();
  }

  // ---- registration and login flow -----------------------------------------------------------

  @Test
  void registersLogsInReadsProfileAndLogsOut() throws Exception {
    String email = email();
    mvc.perform(
            post("/api/auth/register")
                .with(csrf())
                .with(freshIp())
                .contentType("application/json")
                .content(credentials(email, PASSWORD)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.email").value(email))
        .andExpect(jsonPath("$.roles[0]").value("LEARNER"))
        .andExpect(jsonPath("$.permissions[0]").value("STUDY"))
        .andExpect(jsonPath("$.passwordHash").doesNotExist())
        .andExpect(jsonPath("$.password").doesNotExist());

    MvcResult login = login(email, PASSWORD, freshIp());
    assertThat(login.getResponse().getStatus()).isEqualTo(200);
    Cookie session = login.getResponse().getCookie(SESSION_COOKIE);
    assertThat(session).isNotNull();

    mvc.perform(get("/api/auth/me").cookie(session))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value(email));

    mvc.perform(post("/api/auth/logout").with(csrf()).cookie(session))
        .andExpect(status().isNoContent());

    // The old cookie must no longer work: the session is destroyed server-side.
    assertThat(meStatus(session)).isEqualTo(401);
  }

  @Test
  void sessionCookieIsHttpOnlyAndSameSite() throws Exception {
    Account account = provision(Set.of());

    MvcResult result = login(account.email(), PASSWORD, freshIp());

    String setCookie = result.getResponse().getHeader("Set-Cookie");
    assertThat(setCookie).contains(SESSION_COOKIE).containsIgnoringCase("HttpOnly");
    assertThat(setCookie).containsIgnoringCase("SameSite=Lax");
  }

  @Test
  void storesOnlyAHashOfThePassword() {
    Account account = provision(Set.of());

    String stored =
        jdbc.queryForObject(
            "select password_hash from certforge.identity_account where id = ?",
            String.class,
            account.id());

    assertThat(stored).isNotEqualTo(PASSWORD).doesNotContain(PASSWORD).startsWith("{");
  }

  @Test
  void rejectsDuplicateEmailIgnoringCase() throws Exception {
    String email = email();
    accounts.register(email, PASSWORD);

    mvc.perform(
            post("/api/auth/register")
                .with(csrf())
                .with(freshIp())
                .contentType("application/json")
                .content(credentials(email.toUpperCase(), PASSWORD)))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("email_already_registered"));
  }

  @Test
  void rejectsWeakPasswordWithoutEchoingIt() throws Exception {
    mvc.perform(
            post("/api/auth/register")
                .with(csrf())
                .with(freshIp())
                .contentType("application/json")
                .content(credentials(email(), "tiny-pw-xyz")))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("password_too_short"))
        .andExpect(
            result ->
                assertThat(result.getResponse().getContentAsString())
                    .doesNotContain("tiny-pw-xyz"));
  }

  @Test
  void rejectsInvalidEmail() throws Exception {
    mvc.perform(
            post("/api/auth/register")
                .with(csrf())
                .with(freshIp())
                .contentType("application/json")
                .content(credentials("not-an-email", PASSWORD)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("validation_failed"))
        .andExpect(jsonPath("$.fields[0]").value("email"));
  }

  // ---- authentication failures ---------------------------------------------------------------

  @Test
  void loginFailuresDoNotRevealWhetherTheAccountExists() throws Exception {
    Account account = provision(Set.of());

    MvcResult wrongPassword = login(account.email(), "wrong password here", freshIp());
    MvcResult unknownAccount = login(email(), "wrong password here", freshIp());

    assertThat(wrongPassword.getResponse().getStatus()).isEqualTo(401);
    assertThat(unknownAccount.getResponse().getStatus()).isEqualTo(401);
    assertThat(wrongPassword.getResponse().getContentAsString())
        .isEqualTo(unknownAccount.getResponse().getContentAsString())
        .contains("invalid_credentials");
  }

  @Test
  void disabledAccountLooksLikeAWrongPassword() throws Exception {
    Account account = provision(Set.of());
    Account admin = provision(Set.of(Role.ADMINISTRATOR));
    accounts.setEnabled(new dev.certforge.identity.ActorId(admin.id()), account.id(), false);

    MvcResult result = login(account.email(), PASSWORD, freshIp());

    assertThat(result.getResponse().getStatus()).isEqualTo(401);
    assertThat(result.getResponse().getContentAsString()).contains("invalid_credentials");
  }

  @Test
  void throttlesRepeatedFailuresEvenForTheCorrectPassword() throws Exception {
    Account account = provision(Set.of());
    String address = "172.16.0.1";

    for (int i = 0; i < 5; i++) {
      assertThat(
              login(account.email(), "wrong password here", ip(address)).getResponse().getStatus())
          .isEqualTo(401);
    }

    MvcResult blocked = login(account.email(), PASSWORD, ip(address));
    assertThat(blocked.getResponse().getStatus()).isEqualTo(429);
    assertThat(blocked.getResponse().getHeader("Retry-After")).isNotBlank();
    assertThat(blocked.getResponse().getContentAsString()).contains("too_many_attempts");
  }

  @Test
  void throttlesRegistrationPerClientAddress() throws Exception {
    String address = "172.16.0.2";
    int status = 0;
    for (int i = 0; i < 11; i++) {
      status =
          mvc.perform(
                  post("/api/auth/register")
                      .with(csrf())
                      .with(ip(address))
                      .contentType("application/json")
                      .content(credentials(email(), PASSWORD)))
              .andReturn()
              .getResponse()
              .getStatus();
    }

    assertThat(status).isEqualTo(429);
  }

  // ---- anonymous access and CSRF -------------------------------------------------------------

  @Test
  void anonymousRequestsToProtectedEndpointsGetAStableUnauthorizedProblem() throws Exception {
    mvc.perform(get("/api/auth/me"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.code").value("unauthenticated"))
        .andExpect(header().string("Content-Type", "application/problem+json"));
    mvc.perform(get("/api/anything-else")).andExpect(status().isUnauthorized());
    mvc.perform(put("/api/admin/accounts/" + UUID.randomUUID() + "/roles").with(csrf()))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void stateChangingRequestsWithoutCsrfTokenAreRejected() throws Exception {
    mvc.perform(
            post("/api/auth/login")
                .with(freshIp())
                .contentType("application/json")
                .content(credentials(email(), PASSWORD)))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value("csrf_invalid"));
  }

  @Test
  void healthStaysPublic() throws Exception {
    mvc.perform(get("/actuator/health")).andExpect(status().isOk());
  }

  // ---- authorization matrix ------------------------------------------------------------------

  @Test
  void accountAdministrationRequiresTheAccountManagePermission() throws Exception {
    Account target = provision(Set.of());
    Account learner = provision(Set.of(Role.LEARNER));
    Account editor = provision(Set.of(Role.EDITOR));
    Account reviewer = provision(Set.of(Role.REVIEWER));
    Account admin = provision(Set.of(Role.ADMINISTRATOR));

    assertThat(assignRolesStatus(null, target.id(), "[\"LEARNER\"]")).isEqualTo(401);
    assertThat(assignRolesStatus(sessionFor(learner), target.id(), "[\"LEARNER\"]")).isEqualTo(403);
    assertThat(assignRolesStatus(sessionFor(editor), target.id(), "[\"LEARNER\"]")).isEqualTo(403);
    assertThat(assignRolesStatus(sessionFor(reviewer), target.id(), "[\"LEARNER\"]"))
        .isEqualTo(403);
    assertThat(assignRolesStatus(sessionFor(admin), target.id(), "[\"EDITOR\"]")).isEqualTo(200);
  }

  @Test
  void assigningRolesKeepsLearnerAndExposesExplicitPermissions() throws Exception {
    Account target = provision(Set.of());
    Cookie admin = sessionFor(provision(Set.of(Role.ADMINISTRATOR)));

    mvc.perform(
            put("/api/admin/accounts/" + target.id() + "/roles")
                .with(csrf())
                .cookie(admin)
                .contentType("application/json")
                .content("{\"roles\":[\"REVIEWER\"]}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.roles[0]").value("LEARNER"))
        .andExpect(jsonPath("$.roles[1]").value("REVIEWER"))
        .andExpect(jsonPath("$.permissions[0]").value("CONTENT_REVIEW"));
  }

  @Test
  void unknownRoleNameIsABadRequest() throws Exception {
    Account target = provision(Set.of());
    Cookie admin = sessionFor(provision(Set.of(Role.ADMINISTRATOR)));

    assertThat(assignRolesStatus(admin, target.id(), "[\"SUPERUSER\"]")).isEqualTo(400);
  }

  @Test
  void changingRolesRevokesTheTargetsExistingSessions() throws Exception {
    Account target = provision(Set.of());
    Cookie targetSession = sessionFor(target);
    Cookie admin = sessionFor(provision(Set.of(Role.ADMINISTRATOR)));
    assertThat(meStatus(targetSession)).isEqualTo(200);

    assertThat(assignRolesStatus(admin, target.id(), "[\"EDITOR\"]")).isEqualTo(200);

    assertThat(meStatus(targetSession)).isEqualTo(401);
  }

  @Test
  void disablingAnAccountRevokesItsSessionsAndBlocksLogin() throws Exception {
    Account target = provision(Set.of());
    Cookie targetSession = sessionFor(target);
    Cookie admin = sessionFor(provision(Set.of(Role.ADMINISTRATOR)));

    mvc.perform(post("/api/admin/accounts/" + target.id() + "/disable").with(csrf()).cookie(admin))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.enabled").value(false));

    assertThat(meStatus(targetSession)).isEqualTo(401);
    assertThat(login(target.email(), PASSWORD, freshIp()).getResponse().getStatus()).isEqualTo(401);
  }

  @Test
  void administratorCannotRemoveOrDisableTheirOwnAccess() throws Exception {
    Account adminAccount = provision(Set.of(Role.ADMINISTRATOR));
    Cookie admin = sessionFor(adminAccount);

    assertThat(assignRolesStatus(admin, adminAccount.id(), "[\"EDITOR\"]")).isEqualTo(409);
    mvc.perform(
            post("/api/admin/accounts/" + adminAccount.id() + "/disable")
                .with(csrf())
                .cookie(admin))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("own_admin_access"));
  }

  @Test
  void unknownTargetAccountIsNotFound() throws Exception {
    Cookie admin = sessionFor(provision(Set.of(Role.ADMINISTRATOR)));

    assertThat(assignRolesStatus(admin, UUID.randomUUID(), "[\"EDITOR\"]")).isEqualTo(404);
  }

  // ---- secrets in logs -----------------------------------------------------------------------

  @Test
  void passwordsAndSessionTokensNeverAppearInLogs(CapturedOutput output) throws Exception {
    String secret = "unique-secret-" + UUID.randomUUID();
    String email = email();
    mvc.perform(
            post("/api/auth/register")
                .with(csrf())
                .with(freshIp())
                .contentType("application/json")
                .content(credentials(email, secret)))
        .andExpect(status().isCreated());
    MvcResult login = login(email, secret, freshIp());
    Cookie session = login.getResponse().getCookie(SESSION_COOKIE);
    login(email, secret + "-wrong", freshIp());

    assertThat(output.getAll()).doesNotContain(secret);
    assertThat(session).isNotNull();
    assertThat(output.getAll()).doesNotContain(session.getValue());
  }
}
