package dev.certforge.platform;

import java.util.Map;
import org.springframework.http.HttpStatus;

/**
 * A failure that is reported to the client as an RFC 9457 problem response with a stable,
 * machine-readable {@code code}. Every module raises its domain failures as subclasses of this type
 * and never builds an error body itself, so the shape of errors is defined in one place.
 *
 * <p>The message is the problem title and is sent to the client: it must never contain submitted
 * values, secrets or answer material.
 */
public class ProblemException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  private final HttpStatus httpStatus;
  private final String problemCode;
  private final transient Map<String, Object> problemDetails;
  private final transient Map<String, String> problemHeaders;

  public ProblemException(HttpStatus status, String code, String title) {
    this(status, code, title, Map.of(), Map.of());
  }

  public ProblemException(
      HttpStatus status,
      String code,
      String title,
      Map<String, Object> details,
      Map<String, String> headers) {
    super(title);
    this.httpStatus = status;
    this.problemCode = code;
    this.problemDetails = Map.copyOf(details);
    this.problemHeaders = Map.copyOf(headers);
  }

  public HttpStatus status() {
    return httpStatus;
  }

  public String code() {
    return problemCode;
  }

  /** Extra, non-sensitive properties added to the problem body. */
  public Map<String, Object> details() {
    return problemDetails;
  }

  /** Response headers to send with the problem, for example {@code Retry-After}. */
  public Map<String, String> headers() {
    return problemHeaders;
  }
}
