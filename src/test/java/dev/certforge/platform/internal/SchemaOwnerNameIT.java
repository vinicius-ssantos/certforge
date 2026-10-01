package dev.certforge.platform.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

/**
 * The documented setup (docker-compose and the default configuration) connects as a database user
 * named {@code certforge}, the same name as the application schema. PostgreSQL's default search
 * path puts a schema named like the user first, so once the first migration creates the schema it
 * silently becomes the current schema. Flyway must not follow it: its history table is in {@code
 * public}, and looking anywhere else makes readiness report the schema as not migrated and makes
 * the next start fail with "non-empty schema but no schema history table".
 *
 * <p>Every other test connects as a different user, which is why this one exists.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class SchemaOwnerNameIT {

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres =
      new PostgreSQLContainer("postgres:18.6-alpine")
          .withUsername("certforge")
          .withDatabaseName("certforge")
          .withPassword("certforge");

  @Autowired MockMvc mvc;
  @Autowired JdbcTemplate jdbc;
  @Autowired Flyway flyway;

  @Test
  void readinessIsUpWhenTheDatabaseUserSharesTheSchemaName() throws Exception {
    mvc.perform(get("/actuator/health/readiness"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.components.flywayMigrations.status").value("UP"));
  }

  @Test
  void aSecondMigrationRunFindsTheHistoryAndHasNothingPending() {
    assertThat(jdbc.queryForObject("select current_schema()", String.class)).isEqualTo("certforge");

    // This is what the next application start does.
    assertThat(flyway.migrate().migrationsExecuted).isZero();
    assertThat(flyway.info().pending()).isEmpty();
  }
}
