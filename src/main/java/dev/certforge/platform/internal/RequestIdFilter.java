package dev.certforge.platform.internal;

import dev.certforge.platform.RequestId;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Assigns every request a correlation id before anything else runs, including security. A safe
 * {@code X-Request-Id} sent by the client is kept; anything else is replaced by a random id. The id
 * goes into the logging context and back to the client in the response header.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class RequestIdFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String incoming = request.getHeader(RequestId.HEADER);
    String id = RequestId.isSafe(incoming) ? incoming : UUID.randomUUID().toString();
    MDC.put(RequestId.MDC_KEY, id);
    response.setHeader(RequestId.HEADER, id);
    try {
      chain.doFilter(request, response);
    } finally {
      MDC.remove(RequestId.MDC_KEY);
    }
  }
}
