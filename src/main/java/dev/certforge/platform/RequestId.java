package dev.certforge.platform;

import java.util.regex.Pattern;
import org.slf4j.MDC;

/**
 * The correlation identifier of the current request. It travels in the {@code X-Request-Id} header
 * and in the logging context, never in a URL, and it ties together the log lines, the error body
 * and the records a client keeps of one request.
 */
public final class RequestId {

  public static final String HEADER = "X-Request-Id";
  public static final String MDC_KEY = "requestId";

  /** The only values accepted from a client, so an identifier can never inject into a log line. */
  private static final Pattern SAFE = Pattern.compile("^[A-Za-z0-9._-]{8,64}$");

  private RequestId() {}

  /** Whether a client-supplied identifier is safe to adopt. */
  public static boolean isSafe(String value) {
    return value != null && SAFE.matcher(value).matches();
  }

  /** The identifier of the current request, or {@code null} outside a request. */
  public static String current() {
    return MDC.get(MDC_KEY);
  }
}
