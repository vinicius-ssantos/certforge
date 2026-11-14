package dev.certforge.labs.internal;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

/**
 * Gates the terminal bridge's WebSocket upgrade (ADR 0030) before any byte relays. The handshake
 * HTTP request already goes through the ordinary Spring Security filter chain and its session
 * cookie (so an anonymous caller never reaches here at all) -- this adds the two checks a
 * {@code @RestController}'s {@code @PreAuthorize} would otherwise give for free, since neither
 * applies to a raw {@link WebSocketHandler}: the {@code STUDY} authority every other {@code
 * /api/labs} endpoint requires, and that the caller actually owns this session and presented its
 * one-time token (ADR 0030 decision 3) -- a second, explicit check, not a replacement for the
 * cookie.
 */
@Component
class LabTerminalHandshakeInterceptor implements HandshakeInterceptor {

  static final String SESSION_ID_ATTRIBUTE = "containerId";

  private static final Pattern PATH_PATTERN =
      Pattern.compile("/api/labs/sessions/([^/]+)/terminal$");

  private final ContainerLabOrchestrator orchestrator;

  LabTerminalHandshakeInterceptor(ContainerLabOrchestrator orchestrator) {
    this.orchestrator = orchestrator;
  }

  @Override
  public boolean beforeHandshake(
      ServerHttpRequest request,
      ServerHttpResponse response,
      WebSocketHandler wsHandler,
      Map<String, Object> attributes) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !hasStudyAuthority(authentication)) {
      response.setStatusCode(org.springframework.http.HttpStatus.FORBIDDEN);
      return false;
    }

    Matcher matcher = PATH_PATTERN.matcher(request.getURI().getPath());
    if (!matcher.find()) {
      response.setStatusCode(org.springframework.http.HttpStatus.NOT_FOUND);
      return false;
    }
    String containerId = matcher.group(1);
    String token = queryParam(request, "token");

    if (token == null || !orchestrator.ownedByCurrentActor(containerId, token)) {
      response.setStatusCode(org.springframework.http.HttpStatus.NOT_FOUND);
      return false;
    }

    attributes.put(SESSION_ID_ATTRIBUTE, containerId);
    return true;
  }

  @Override
  public void afterHandshake(
      ServerHttpRequest request,
      ServerHttpResponse response,
      WebSocketHandler wsHandler,
      Exception exception) {}

  private static boolean hasStudyAuthority(Authentication authentication) {
    return authentication.getAuthorities().stream()
        .anyMatch(authority -> authority.getAuthority().equals("STUDY"));
  }

  private static String queryParam(ServerHttpRequest request, String name) {
    String query = request.getURI().getQuery();
    if (query == null) {
      return null;
    }
    for (String pair : query.split("&")) {
      List<String> parts = List.of(pair.split("=", 2));
      if (parts.size() == 2 && parts.get(0).equals(name)) {
        return parts.get(1);
      }
    }
    return null;
  }
}
