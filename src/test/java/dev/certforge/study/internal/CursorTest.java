package dev.certforge.study.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class CursorTest {

  @Test
  void roundTripsTimestampAndIdAtMicrosecondPrecision() {
    Cursor cursor = new Cursor(Instant.parse("2026-09-30T12:34:56.123456Z"), UUID.randomUUID());

    assertThat(Cursor.decode(cursor.encode())).isEqualTo(cursor);
  }

  @Test
  void dropsSubMicrosecondPrecisionBecauseTheDatabaseDoesNotStoreIt() {
    Instant nanos = Instant.parse("2026-09-30T12:34:56.123456789Z");
    UUID id = UUID.randomUUID();

    Cursor decoded = Cursor.decode(new Cursor(nanos, id).encode());

    assertThat(decoded.at()).isEqualTo(nanos.truncatedTo(ChronoUnit.MICROS));
  }

  @Test
  void theTextFormIsOpaqueAndUrlSafe() {
    String text = new Cursor(Instant.now(), UUID.randomUUID()).encode();

    assertThat(text).matches("^[A-Za-z0-9_-]+$");
  }

  @Test
  void rejectsMalformedCursorsWithAStableCode() {
    String noSeparator = Base64.getUrlEncoder().encodeToString("12345".getBytes());
    String badNumber =
        Base64.getUrlEncoder().encodeToString(("abc:" + UUID.randomUUID()).getBytes());
    String badId = Base64.getUrlEncoder().encodeToString("123:not-a-uuid".getBytes());

    for (String bad : new String[] {"", "!!!", "garbage", noSeparator, badNumber, badId}) {
      assertThatThrownBy(() -> Cursor.decode(bad))
          .isInstanceOfSatisfying(
              StudyException.class, e -> assertThat(e.code()).isEqualTo("invalid_cursor"));
    }
  }
}
