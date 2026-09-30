package dev.certforge.study.internal;

import java.security.SecureRandom;
import java.util.random.RandomGenerator;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(StudyProperties.class)
class StudyConfig {

  /**
   * Source of randomness for question selection. It is unpredictable in production. Tests add a
   * primary seeded generator to get reproducible sessions; there is deliberately no way for a
   * client to influence it.
   */
  @Bean
  RandomGenerator selectionRandom() {
    return new SecureRandom();
  }
}
