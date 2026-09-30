package dev.certforge.platform.internal;

import io.micrometer.common.KeyValues;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.observation.DefaultServerRequestObservationConvention;
import org.springframework.http.server.observation.ServerRequestObservationContext;
import org.springframework.http.server.observation.ServerRequestObservationConvention;

/**
 * Data minimization for HTTP telemetry. The default server observation adds the concrete request
 * path (for example {@code /api/admin/accounts/<account id>/roles}) as a high-cardinality value. It
 * is not a metric tag, but it would be attached to every trace span, putting account and session
 * identifiers into telemetry that does not need them. The templated {@code uri} (for example {@code
 * /api/admin/accounts/{id}/roles}), the method, the status and the outcome remain, and they are
 * enough to see what happened.
 */
@Configuration
class MinimalHttpObservations {

  @Bean
  ServerRequestObservationConvention minimalServerRequestObservationConvention() {
    return new DefaultServerRequestObservationConvention() {
      @Override
      public KeyValues getHighCardinalityKeyValues(ServerRequestObservationContext context) {
        return KeyValues.empty();
      }
    };
  }
}
