package dev.certforge.platform;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.UUID;
import org.springframework.http.HttpStatus;

/**
 * Keyset pagination position: the timestamp and id of the last item of a page. Because it names a
 * row instead of counting rows, new items arriving at the front cannot make a later page skip or
 * repeat anything. Timestamps are kept at microsecond precision, which is what PostgreSQL stores.
 */
public record PageCursor(Instant at, UUID id) {

  /** Opaque, URL-safe text form. */
  public String encode() {
    long micros = at.getEpochSecond() * 1_000_000L + at.getNano() / 1_000L;
    String raw = micros + ":" + id;
    return Base64.getUrlEncoder()
        .withoutPadding()
        .encodeToString(raw.getBytes(StandardCharsets.UTF_8));
  }

  /** The cursor in text form, or none for a blank value. Malformed values are a stable error. */
  public static PageCursor decodeOrNull(String text) {
    return text == null || text.isBlank() ? null : decode(text);
  }

  /** Parses a cursor; any malformed value is a stable {@code invalid_cursor} error. */
  public static PageCursor decode(String text) {
    try {
      String raw = new String(Base64.getUrlDecoder().decode(text), StandardCharsets.UTF_8);
      int separator = raw.indexOf(':');
      long micros = Long.parseLong(raw.substring(0, separator));
      UUID id = UUID.fromString(raw.substring(separator + 1));
      return new PageCursor(Instant.EPOCH.plus(micros, ChronoUnit.MICROS), id);
    } catch (IllegalArgumentException | StringIndexOutOfBoundsException e) {
      throw new ProblemException(
          HttpStatus.BAD_REQUEST, "invalid_cursor", "The cursor is not valid");
    }
  }
}
