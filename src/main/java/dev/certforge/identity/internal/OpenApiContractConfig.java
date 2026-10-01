package dev.certforge.identity.internal;

import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import java.util.List;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Completes the OpenAPI contract with what is not a controller method: the logout endpoint, which
 * Spring Security serves itself, and the session-cookie security scheme the whole API uses.
 */
@Configuration
class OpenApiContractConfig {

  static final String SESSION_SCHEME = "sessionCookie";

  @Bean
  OpenApiCustomizer identityContract() {
    return openApi -> {
      openApi.path(
          "/api/auth/logout",
          new PathItem()
              .post(
                  new Operation()
                      .summary("End the current session")
                      .addTagsItem("auth-controller")
                      .operationId("logout")
                      .responses(
                          new ApiResponses()
                              .addApiResponse("204", new ApiResponse().description("Signed out"))
                              .addApiResponse(
                                  "403",
                                  new ApiResponse()
                                      .description("CSRF token missing or invalid")))));
      openApi.schemaRequirement(
          SESSION_SCHEME,
          new SecurityScheme()
              .type(SecurityScheme.Type.APIKEY)
              .in(SecurityScheme.In.COOKIE)
              .name(SessionCookieConfig.COOKIE_NAME)
              .description(
                  "Server-side session cookie. State-changing requests also need the X-XSRF-TOKEN"
                      + " header; call GET /api/auth/csrf first."));
      openApi.setSecurity(List.of(new SecurityRequirement().addList(SESSION_SCHEME)));
    };
  }
}
