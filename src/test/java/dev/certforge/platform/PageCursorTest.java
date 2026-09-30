package dev.certforge.platform;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class PageCursorTest {

  @Test
  void roundTripsTimestampAndIdAtMicrosecondPrecision() {
    PageCursor cursor =
        new PageCursor(Instant.parse("2026-09-30T12:34:56.123456Z"), UUID.randomUUID());

    assertThat(PageCursor.decode(cursor.encode())).isEqualTo(cursor);
  }

  @Test
  void dropsSubMicrosecondPrecisionBecauseTheDatabaseDoesNotStoreIt() {
    Instant nanos = Instant.parse("2026-09-30T12:34:56.123456789Z");

    PageCursor decoded = PageCursor.decode(new PageCursor(nanos, UUID.randomUUID()).encode());

    assertThat(decoded.at()).isEqualTo(nanos.truncatedTo(ChronoUnit.MICROS));
  }

  @Test
  void theTextFormIsOpaqueAndUrlSafe() {
    String text = new PageCursor(Instant.now(), UUID.randomUUID()).encode();

    assertThat(text).matches("^[A-Za-z0-9_-]+$");
  }

  @Test
  void rejectsMalformedCursorsWithAStableCode() {
    String noSeparator = Base64.getUrlEncoder().encodeToString("12345".getBytes());
    String badNumber =
        Base64.getUrlEncoder().encodeToString(("abc:" + UUID.randomUUID()).getBytes());
    String badId = Base64.getUrlEncoder().encodeToString("123:not-a-uuid".getBytes());

    for (String bad : new String[] {"", "!!!", "garbage", noSeparator, badNumber, badId}) {
      assertThatThrownBy(() -> PageCursor.decode(bad))
          .isInstanceOfSatisfying(
              ProblemException.class, e -> assertThat(e.code()).isEqualTo("invalid_cursor"));
    }
  }

  @Test
  void aBlankCursorMeansTheFirstPage() {
    assertThat(PageCursor.decodeOrNull(null)).isNull();
    assertThat(PageCursor.decodeOrNull("  ")).isNull();
  }

  @Test
  void pageSizeIsDefaultedAndRangeChecked() {
    assertThat(Page.size(null)).isEqualTo(Page.DEFAULT_SIZE);
    assertThat(Page.size(1)).isEqualTo(1);
    assertThat(Page.size(Page.MAX_SIZE)).isEqualTo(Page.MAX_SIZE);
    for (int bad : new int[] {0, -1, Page.MAX_SIZE + 1}) {
      assertThatThrownBy(() -> Page.size(bad))
          .isInstanceOfSatisfying(
              ProblemException.class, e -> assertThat(e.code()).isEqualTo("invalid_page_size"));
    }
  }

  @Test
  void aPageHasANextCursorOnlyWhenThereIsAnExtraRow() {
    List<Integer> rows = List.of(1, 2, 3);
    UUID id = UUID.randomUUID();

    Page<Integer> more = Page.of(rows, 2, row -> row, row -> new PageCursor(Instant.EPOCH, id));
    Page<Integer> last =
        Page.of(List.of(1, 2), 2, row -> row, row -> new PageCursor(Instant.EPOCH, id));

    assertThat(more.items()).containsExactly(1, 2);
    assertThat(more.nextCursor()).isNotNull();
    assertThat(last.items()).containsExactly(1, 2);
    assertThat(last.nextCursor()).isNull();
  }
}
