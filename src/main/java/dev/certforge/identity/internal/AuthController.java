package dev.certforge.identity.internal;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Clock;
import java.time.Duration;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
class AuthController {

  private final AccountService accounts;
  private final AuthenticationManager authenticationManager;
  private final SecurityContextRepository securityContextRepository;
  private final SessionAuthenticationStrategy sessionStrategy;
  private final IdentityProperties.Throttle throttle;
  private final AttemptLimiter loginLimiter;
  private final AttemptLimiter registrationLimiter;

  AuthController(
      AccountService accounts,
      AuthenticationManager authenticationManager,
      SecurityContextRepository securityContextRepository,
      SessionAuthenticationStrategy sessionStrategy,
      IdentityProperties properties,
      Clock clock) {
    this.accounts = accounts;
    this.authenticationManager = authenticationManager;
    this.securityContextRepository = securityContextRepository;
    this.sessionStrategy = sessionStrategy;
    this.throttle = properties.throttle();
    this.loginLimiter = new AttemptLimiter(clock, throttle.window());
    this.registrationLimiter = new AttemptLimiter(clock, throttle.window());
  }

  /** Issues the CSRF cookie and returns the token so a client can send it as a header. */
  @GetMapping("/csrf")
  CsrfView csrf(CsrfToken token) {
    return new CsrfView(token.getHeaderName(), token.getToken());
  }

  @PostMapping("/register")
  ResponseEntity<AccountView> register(
      @Valid @RequestBody RegisterRequest request, HttpServletRequest http) {
    String ipKey = "ip:" + http.getRemoteAddr();
    failIfBlocked(registrationLimiter, ipKey, throttle.registrationsPerIp());
    registrationLimiter.record(ipKey);
    Account account = accounts.register(request.email(), request.password());
    return ResponseEntity.status(HttpStatus.CREATED).body(AccountView.of(account));
  }

  @PostMapping("/login")
  AccountView login(
      @Valid @RequestBody LoginRequest request,
      HttpServletRequest http,
      HttpServletResponse response) {
    String email = AccountService.normalizeEmail(request.email());
    String emailKey = "email:" + email;
    String ipKey = "ip:" + http.getRemoteAddr();
    failIfBlocked(loginLimiter, emailKey, throttle.loginFailuresPerEmail());
    failIfBlocked(loginLimiter, ipKey, throttle.loginFailuresPerIp());

    Authentication authentication;
    try {
      authentication =
          authenticationManager.authenticate(
              UsernamePasswordAuthenticationToken.unauthenticated(email, request.password()));
    } catch (AuthenticationException e) {
      loginLimiter.record(emailKey);
      loginLimiter.record(ipKey);
      throw new InvalidCredentials();
    }

    sessionStrategy.onAuthentication(authentication, http, response);
    SecurityContext context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(authentication);
    SecurityContextHolder.setContext(context);
    securityContextRepository.saveContext(context, http, response);
    loginLimiter.clear(emailKey);
    return AccountView.of(accounts.get(UUID.fromString(authentication.getName())));
  }

  @GetMapping("/me")
  AccountView me(Authentication authentication) {
    return AccountView.of(accounts.get(UUID.fromString(authentication.getName())));
  }

  private static void failIfBlocked(AttemptLimiter limiter, String key, int limit) {
    Duration retryAfter = limiter.retryAfter(key, limit);
    if (retryAfter.isPositive()) {
      throw new TooManyAttempts(retryAfter);
    }
  }

  record CsrfView(String headerName, String token) {}

  record RegisterRequest(
      @NotBlank @Email @Size(max = 254) String email, @NotBlank @Size(max = 128) String password) {

    @Override
    public String toString() {
      return "RegisterRequest[email=" + email + "]";
    }
  }

  record LoginRequest(
      @NotBlank @Size(max = 254) String email, @NotBlank @Size(max = 128) String password) {

    @Override
    public String toString() {
      return "LoginRequest[email=" + email + "]";
    }
  }
}
