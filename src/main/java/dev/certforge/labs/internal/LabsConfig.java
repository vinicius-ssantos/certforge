package dev.certforge.labs.internal;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableConfigurationProperties(VercelSandboxProperties.class)
@EnableWebSocket
class LabsConfig implements WebSocketConfigurer {

  private final LabTerminalWebSocketHandler terminalHandler;
  private final LabTerminalHandshakeInterceptor terminalHandshakeInterceptor;

  LabsConfig(
      LabTerminalWebSocketHandler terminalHandler,
      LabTerminalHandshakeInterceptor terminalHandshakeInterceptor) {
    this.terminalHandler = terminalHandler;
    this.terminalHandshakeInterceptor = terminalHandshakeInterceptor;
  }

  @Bean
  VercelSandboxClient vercelSandboxClient(VercelSandboxProperties properties) {
    return new VercelSandboxClient(RestClient.builder(), properties);
  }

  /**
   * {@link ContainerLabOrchestrator}'s timeout reaper (ADR 0030) -- one thread for the whole
   * application instance is enough, since all it ever runs is a container removal.
   *
   * <p>{@code static}, deliberately: {@code ContainerLabOrchestrator} depends on this bean, and
   * {@code LabsConfig}'s own constructor depends on {@link LabTerminalWebSocketHandler}, which in
   * turn depends on {@code ContainerLabOrchestrator} -- a non-static {@code @Bean} method needs
   * this class's instance to exist first, which would make that a genuine circular dependency
   * (confirmed the hard way: {@code UnsatisfiedDependencyException}, "bean currently in creation").
   * A {@code static} method needs no enclosing instance, so Spring can produce this bean before
   * {@code LabsConfig} itself, breaking the cycle.
   */
  @Bean
  static ScheduledExecutorService labTimeoutReaper() {
    return Executors.newSingleThreadScheduledExecutor();
  }

  /**
   * The container labs' terminal bridge (ADR 0030) -- the path's {sessionId} is parsed by {@link
   * LabTerminalHandshakeInterceptor} itself, not by a Spring-managed template variable, since
   * {@code WebSocketHandlerRegistry} has no equivalent to {@code @PathVariable}.
   */
  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry
        .addHandler(terminalHandler, "/api/labs/sessions/*/terminal")
        .addInterceptors(terminalHandshakeInterceptor);
  }
}
