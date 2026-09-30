package dev.certforge.identity.internal;

import dev.certforge.platform.ProblemException;
import java.time.Duration;
import java.util.Map;
import org.springframework.http.HttpStatus;

class TooManyAttempts extends ProblemException {

  private static final long serialVersionUID = 1L;

  TooManyAttempts(Duration retryAfter) {
    super(
        HttpStatus.TOO_MANY_REQUESTS,
        "too_many_attempts",
        "Too many attempts",
        Map.of(),
        Map.of("Retry-After", String.valueOf(Math.max(1, retryAfter.toSeconds()))));
  }
}
