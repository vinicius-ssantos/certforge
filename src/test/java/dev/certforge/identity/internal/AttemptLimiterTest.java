package dev.certforge.identity.internal;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;

class AttemptLimiterTest {

  private static final Duration WINDOW = Duration.ofMinutes(15);

  private final MutableClock clock = new MutableClock();
  private final AttemptLimiter limiter = new AttemptLimiter(clock, WINDOW);

  @Test
  void blocksOnceLimitIsReachedInsideWindow() {
    for (int i = 0; i < 3; i++) {
      assertThat(limiter.isBlocked("k", 3)).isFalse();
      limiter.record("k");
    }

    assertThat(limiter.isBlocked("k", 3)).isTrue();
    assertThat(limiter.retryAfter("k", 3)).isEqualTo(WINDOW);
  }

  @Test
  void unblocksAfterWindowElapses() {
    for (int i = 0; i < 3; i++) {
      limiter.record("k");
    }

    clock.advance(WINDOW.plusSeconds(1));

    assertThat(limiter.isBlocked("k", 3)).isFalse();
  }

  @Test
  void retryAfterShrinksAsTimePasses() {
    limiter.record("k");
    clock.advance(Duration.ofMinutes(5));

    assertThat(limiter.retryAfter("k", 1)).isEqualTo(Duration.ofMinutes(10));
  }

  @Test
  void keysAreIndependentAndClearResetsOne() {
    limiter.record("a");
    limiter.record("b");

    limiter.clear("a");

    assertThat(limiter.isBlocked("a", 1)).isFalse();
    assertThat(limiter.isBlocked("b", 1)).isTrue();
  }

  private static final class MutableClock extends Clock {
    private Instant now = Instant.parse("2026-01-01T00:00:00Z");

    void advance(Duration duration) {
      now = now.plus(duration);
    }

    @Override
    public java.time.ZoneId getZone() {
      return ZoneOffset.UTC;
    }

    @Override
    public Clock withZone(java.time.ZoneId zone) {
      return this;
    }

    @Override
    public Instant instant() {
      return now;
    }
  }
}
