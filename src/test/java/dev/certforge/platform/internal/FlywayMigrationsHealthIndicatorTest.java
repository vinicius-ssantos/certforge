package dev.certforge.platform.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.flywaydb.core.api.MigrationInfoService;
import org.flywaydb.core.api.MigrationState;
import org.junit.jupiter.api.Test;
import org.springframework.boot.health.contributor.Status;

class FlywayMigrationsHealthIndicatorTest {

  private static MigrationInfo migration(MigrationState state) {
    MigrationInfo info = mock(MigrationInfo.class);
    when(info.getState()).thenReturn(state);
    return info;
  }

  private static FlywayMigrationsHealthIndicator indicator(
      MigrationInfo[] all, MigrationInfo[] pending) {
    Flyway flyway = mock(Flyway.class);
    MigrationInfoService service = mock(MigrationInfoService.class);
    when(flyway.info()).thenReturn(service);
    when(service.all()).thenReturn(all);
    when(service.pending()).thenReturn(pending);
    return new FlywayMigrationsHealthIndicator(flyway);
  }

  @Test
  void isUpWhenEveryMigrationIsApplied() {
    var health =
        indicator(
                new MigrationInfo[] {
                  migration(MigrationState.SUCCESS), migration(MigrationState.SUCCESS)
                },
                new MigrationInfo[0])
            .health();

    assertThat(health.getStatus()).isEqualTo(Status.UP);
    assertThat(health.getDetails()).containsEntry("failed", 0L).containsEntry("pending", 0);
  }

  @Test
  void isDownWhenAMigrationFailed() {
    var health =
        indicator(
                new MigrationInfo[] {
                  migration(MigrationState.SUCCESS), migration(MigrationState.FAILED)
                },
                new MigrationInfo[0])
            .health();

    assertThat(health.getStatus()).isEqualTo(Status.DOWN);
    assertThat(health.getDetails()).containsEntry("failed", 1L);
  }

  @Test
  void isDownWhileMigrationsArePending() {
    MigrationInfo pending = migration(MigrationState.PENDING);

    var health =
        indicator(
                new MigrationInfo[] {migration(MigrationState.SUCCESS), pending},
                new MigrationInfo[] {pending})
            .health();

    assertThat(health.getStatus()).isEqualTo(Status.DOWN);
    assertThat(health.getDetails()).containsEntry("pending", 1);
  }
}
