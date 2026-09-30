package dev.certforge;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.jdbc.core.JdbcTemplate;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

@SpringBootTest
@Testcontainers
class PostgreSqlBootstrapIT {

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired JdbcTemplate jdbcTemplate;

  @Test
  void appliesFlywayMigrationsAgainstDisposablePostgres() {
    Integer appliedMigrations =
        jdbcTemplate.queryForObject(
            "select count(*) from flyway_schema_history where success = true", Integer.class);

    assertThat(appliedMigrations).isNotNull().isGreaterThanOrEqualTo(1);
  }
}
