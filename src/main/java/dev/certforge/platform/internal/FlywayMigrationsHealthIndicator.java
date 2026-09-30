package dev.certforge.platform.internal;

import java.util.Arrays;
import org.flywaydb.core.Flyway;
import org.springframework.boot.health.contributor.Health;
import org.springframework.boot.health.contributor.HealthIndicator;
import org.springframework.stereotype.Component;

/**
 * Readiness of the database schema. The application is only ready to serve traffic when every
 * migration has been applied and none has failed. It is part of the readiness group only: a failed
 * migration means the instance cannot do useful work, but restarting it (what a failed liveness
 * probe triggers) would not repair that.
 */
@Component("flywayMigrations")
class FlywayMigrationsHealthIndicator implements HealthIndicator {

  private final Flyway flyway;

  FlywayMigrationsHealthIndicator(Flyway flyway) {
    this.flyway = flyway;
  }

  @Override
  public Health health() {
    var info = flyway.info();
    long failed = Arrays.stream(info.all()).filter(m -> m.getState().isFailed()).count();
    int pending = info.pending().length;
    Health.Builder health = failed > 0 || pending > 0 ? Health.down() : Health.up();
    return health.withDetail("failed", failed).withDetail("pending", pending).build();
  }
}
