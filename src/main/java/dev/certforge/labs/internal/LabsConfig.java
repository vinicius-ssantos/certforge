package dev.certforge.labs.internal;

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
