package dev.certforge.study.internal;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.UUID;

/**
 * Keyset pagination position: the timestamp and id of the last item of a page. Because it names a
 * row instead of counting rows, new items arriving at the front cannot make a later page skip or
 * repeat anything.
 */
record Cursor(Instant at, UUID id) {

  /** Opaque, URL-safe text form. */
  String encode() {
    long micros = at.getEpochSecond() * 1_000_000L + at.getNano() / 1_000L;
    String raw = micros + ":" + id;
    return Base64.getUrlEncoder()
        .withoutPadding()
        .encodeToString(raw.getBytes(StandardCharsets.UTF_8));
  }

  /** Parses a cursor; any malformed value is a stable {@code invalid_cursor} error. */
  static Cursor decode(String text) {
    try {
      String raw = new String(Base64.getUrlDecoder().decode(text), StandardCharsets.UTF_8);
      int separator = raw.indexOf(':');
      long micros = Long.parseLong(raw.substring(0, separator));
      UUID id = UUID.fromString(raw.substring(separator + 1));
      return new Cursor(Instant.EPOCH.plus(micros, ChronoUnit.MICROS), id);
    } catch (IllegalArgumentException | StringIndexOutOfBoundsException e) {
      throw StudyException.invalid("invalid_cursor", "The cursor is not valid");
    }
  }
}
