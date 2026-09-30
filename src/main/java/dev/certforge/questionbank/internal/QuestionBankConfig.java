package dev.certforge.questionbank.internal;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(QuestionBankProperties.class)
class QuestionBankConfig {}
