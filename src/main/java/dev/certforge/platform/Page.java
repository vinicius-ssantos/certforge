package dev.certforge.platform;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.function.Function;
import org.springframework.http.HttpStatus;

/**
 * One page of results and, when there are more, the cursor of the next page. Pages are fetched one
 * row longer than their size: the extra row only tells whether another page follows.
 */
public record Page<T>(List<T> items, @Schema(nullable = true) String nextCursor) {

  public static final int DEFAULT_SIZE = 20;
  public static final int MAX_SIZE = 50;

  /** The requested page size, defaulted and range checked. */
  public static int size(Integer requested) {
    int size = requested == null ? DEFAULT_SIZE : requested;
    if (size < 1 || size > MAX_SIZE) {
      throw new ProblemException(
          HttpStatus.BAD_REQUEST,
          "invalid_page_size",
          "The page size must be between 1 and " + MAX_SIZE);
    }
    return size;
  }

  /** Builds a page from rows fetched with one extra. */
  public static <R, T> Page<T> of(
      List<R> rows, int size, Function<R, T> toItem, Function<R, PageCursor> toCursor) {
    boolean more = rows.size() > size;
    List<R> visible = more ? rows.subList(0, size) : rows;
    String next = more ? toCursor.apply(visible.get(visible.size() - 1)).encode() : null;
    return new Page<>(visible.stream().map(toItem).toList(), next);
  }
}
