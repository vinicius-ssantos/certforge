package dev.certforge.labs.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.WebSocketHandler;

/**
 * The terminal bridge's handshake gate (ADR 0030) -- nothing else exercises this path: it is not a
 * {@code @RequestMapping} method, so {@code AuthorizationMatrixIT}'s auto-discovery never sees it.
 * Covers the {@code STUDY} authority check and the session-ownership/token check together.
 */
class LabTerminalHandshakeInterceptorTest {

  private static final String PATH = "/api/labs/sessions/container_1/terminal";

  @AfterEach
  void clearSecurityContext() {
    SecurityContextHolder.clearContext();
  }

  private static ServerHttpRequest requestFor(String path, String query) {
    ServerHttpRequest request = mock(ServerHttpRequest.class);
    String full = query == null ? path : path + "?" + query;
    when(request.getURI()).thenReturn(URI.create("http://localhost" + full));
    return request;
  }

  private static void authenticateAs(List<GrantedAuthority> authorities) {
    Authentication authentication =
        new UsernamePasswordAuthenticationToken("learner@example.com", "n/a", authorities);
    SecurityContextHolder.getContext().setAuthentication(authentication);
  }

  @Test
  void refusesAnAnonymousCaller() {
    SecurityContextHolder.getContext()
        .setAuthentication(
            new AnonymousAuthenticationToken(
                "key", "anonymous", List.of(new SimpleGrantedAuthority("ROLE_ANONYMOUS"))));
    ContainerLabOrchestrator orchestrator = mock(ContainerLabOrchestrator.class);
    LabTerminalHandshakeInterceptor interceptor = new LabTerminalHandshakeInterceptor(orchestrator);
    ServerHttpRequest request = requestFor(PATH, "token=tok");
    ServerHttpResponse response = mock(ServerHttpResponse.class);

    boolean allowed =
        interceptor.beforeHandshake(
            request, response, mock(WebSocketHandler.class), new HashMap<>());

    assertThat(allowed).isFalse();
    verify(response).setStatusCode(HttpStatus.FORBIDDEN);
  }

  @Test
  void refusesAnAuthenticatedCallerWithoutStudyAuthority() {
    authenticateAs(List.of(new SimpleGrantedAuthority("SOME_OTHER_AUTHORITY")));
    ContainerLabOrchestrator orchestrator = mock(ContainerLabOrchestrator.class);
    LabTerminalHandshakeInterceptor interceptor = new LabTerminalHandshakeInterceptor(orchestrator);
    ServerHttpRequest request = requestFor(PATH, "token=tok");
    ServerHttpResponse response = mock(ServerHttpResponse.class);

    boolean allowed =
        interceptor.beforeHandshake(
            request, response, mock(WebSocketHandler.class), new HashMap<>());

    assertThat(allowed).isFalse();
    verify(response).setStatusCode(HttpStatus.FORBIDDEN);
  }

  @Test
  void refusesAMissingOrWrongToken() {
    authenticateAs(List.of(new SimpleGrantedAuthority("STUDY")));
    ContainerLabOrchestrator orchestrator = mock(ContainerLabOrchestrator.class);
    when(orchestrator.ownedByCurrentActor("container_1", "wrong")).thenReturn(false);
    LabTerminalHandshakeInterceptor interceptor = new LabTerminalHandshakeInterceptor(orchestrator);
    ServerHttpResponse response = mock(ServerHttpResponse.class);

    boolean allowedNoToken =
        interceptor.beforeHandshake(
            requestFor(PATH, null), response, mock(WebSocketHandler.class), new HashMap<>());
    boolean allowedWrongToken =
        interceptor.beforeHandshake(
            requestFor(PATH, "token=wrong"),
            response,
            mock(WebSocketHandler.class),
            new HashMap<>());

    assertThat(allowedNoToken).isFalse();
    assertThat(allowedWrongToken).isFalse();
  }

  @Test
  void allowsTheOwningLearnerWithTheRightTokenAndRecordsTheContainerId() {
    authenticateAs(List.of(new SimpleGrantedAuthority("STUDY")));
    ContainerLabOrchestrator orchestrator = mock(ContainerLabOrchestrator.class);
    when(orchestrator.ownedByCurrentActor("container_1", "right-token")).thenReturn(true);
    LabTerminalHandshakeInterceptor interceptor = new LabTerminalHandshakeInterceptor(orchestrator);
    Map<String, Object> attributes = new HashMap<>();

    boolean allowed =
        interceptor.beforeHandshake(
            requestFor(PATH, "token=right-token"),
            mock(ServerHttpResponse.class),
            mock(WebSocketHandler.class),
            attributes);

    assertThat(allowed).isTrue();
    assertThat(attributes)
        .containsEntry(LabTerminalHandshakeInterceptor.SESSION_ID_ATTRIBUTE, "container_1");
  }
}
