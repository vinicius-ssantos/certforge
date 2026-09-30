package dev.certforge.identity.internal;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

/** Tunables for abuse protection and the optional first administrator. */
@ConfigurationProperties("certforge.identity")
record IdentityProperties(Throttle throttle, BootstrapAdmin bootstrapAdmin, Boolean secureCookie) {

  IdentityProperties {
    throttle = throttle == null ? new Throttle(5, 50, Duration.ofMinutes(15), 10) : throttle;
    bootstrapAdmin = bootstrapAdmin == null ? new BootstrapAdmin(null, null) : bootstrapAdmin;
  }

  /**
   * Limits are per application instance (in memory).
   *
   * @param loginFailuresPerEmail failed logins tolerated per email within the window
   * @param loginFailuresPerIp failed logins tolerated per client address within the window
   * @param window sliding window for login and registration counters
   * @param registrationsPerIp registrations tolerated per client address within the window
   */
  record Throttle(
      int loginFailuresPerEmail, int loginFailuresPerIp, Duration window, int registrationsPerIp) {}

  /** Creates an administrator at startup when none exists. Both values must be provided. */
  record BootstrapAdmin(String email, String password) {

    boolean configured() {
      return email != null && !email.isBlank() && password != null && !password.isBlank();
    }

    @Override
    public String toString() {
      return "BootstrapAdmin[configured=" + configured() + "]";
    }
  }
}
