package dev.certforge.platform.internal;

import io.swagger.v3.oas.models.media.Schema;
import java.util.List;
import java.util.Map;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Makes the OpenAPI contract say what the API actually does. Response records always serialize
 * every component (a missing value is sent as {@code null}), so in every response schema each
 * property is required unless it is declared nullable with {@code @Schema(nullable = true)}.
 * Without this, generated clients would see every field as optional and be forced into defensive
 * code that hides real mistakes.
 *
 * <p>Request schemas ({@code *Request}) keep their own rules: there, absent fields are often
 * legitimate, for example in a draft.
 */
@Configuration
class ContractRequiredProperties {

  @Bean
  OpenApiCustomizer responsePropertiesAreRequiredUnlessNullable() {
    return openApi -> {
      if (openApi.getComponents() == null || openApi.getComponents().getSchemas() == null) {
        return;
      }
      openApi
          .getComponents()
          .getSchemas()
          .forEach(
              (name, schema) -> {
                if (!name.endsWith("Request") && schema.getProperties() != null) {
                  schema.setRequired(requiredNames(schema.getProperties()));
                }
              });
    };
  }

  @SuppressWarnings("rawtypes")
  private static List<String> requiredNames(Map<String, Schema> properties) {
    return properties.entrySet().stream()
        .filter(entry -> !Boolean.TRUE.equals(entry.getValue().getNullable()))
        .map(Map.Entry::getKey)
        .sorted()
        .toList();
  }
}
