package dev.certforge.labs.internal;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
@EnableConfigurationProperties(VercelSandboxProperties.class)
class LabsConfig {

  @Bean
  VercelSandboxClient vercelSandboxClient(VercelSandboxProperties properties) {
    return new VercelSandboxClient(RestClient.builder(), properties);
  }
}
