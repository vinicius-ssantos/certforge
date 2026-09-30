package dev.certforge.identity.internal;

import java.time.Duration;

class TooManyAttempts extends RuntimeException {

  private static final long serialVersionUID = 1L;

  private final long waitSeconds;

  TooManyAttempts(Duration retryAfter) {
    super("Too many attempts");
    this.waitSeconds = Math.max(1, retryAfter.toSeconds());
  }

  long retryAfterSeconds() {
    return waitSeconds;
  }
}
