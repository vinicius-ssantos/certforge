package dev.certforge.identity.internal;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory sliding-window counter used to slow brute force and registration abuse. State is
 * per-instance and lost on restart; a shared store is required before running several instances.
 */
final class AttemptLimiter {

  private static final int MAX_KEYS = 10_000;

  private final Map<String, Deque<Instant>> attempts = new ConcurrentHashMap<>();
  private final Clock clock;
  private final Duration window;

  AttemptLimiter(Clock clock, Duration window) {
    this.clock = clock;
    this.window = window;
  }

  /** Records one attempt for the key. */
  void record(String key) {
    if (attempts.size() >= MAX_KEYS) {
      purgeExpired();
    }
    Deque<Instant> deque = attempts.computeIfAbsent(key, k -> new ArrayDeque<>());
    synchronized (deque) {
      expire(deque);
      deque.addLast(clock.instant());
    }
  }

  /** Whether the key already reached {@code limit} attempts inside the window. */
  boolean isBlocked(String key, int limit) {
    return retryAfter(key, limit).isPositive();
  }

  /** Time until the key is allowed again, or {@link Duration#ZERO} when it is not blocked. */
  Duration retryAfter(String key, int limit) {
    Deque<Instant> deque = attempts.get(key);
    if (deque == null) {
      return Duration.ZERO;
    }
    synchronized (deque) {
      expire(deque);
      if (deque.size() < limit) {
        return Duration.ZERO;
      }
      Duration remaining = Duration.between(clock.instant(), deque.peekFirst().plus(window));
      return remaining.isPositive() ? remaining : Duration.ZERO;
    }
  }

  /** Forgets the key, for example after a successful login. */
  void clear(String key) {
    attempts.remove(key);
  }

  private void expire(Deque<Instant> deque) {
    Instant cutoff = clock.instant().minus(window);
    while (!deque.isEmpty() && !deque.peekFirst().isAfter(cutoff)) {
      deque.pollFirst();
    }
  }

  private void purgeExpired() {
    attempts
        .entrySet()
        .removeIf(
            entry -> {
              synchronized (entry.getValue()) {
                expire(entry.getValue());
                return entry.getValue().isEmpty();
              }
            });
  }
}
