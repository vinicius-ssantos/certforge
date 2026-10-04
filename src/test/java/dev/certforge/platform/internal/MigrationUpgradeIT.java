package dev.certforge.platform.internal;

import static org.assertj.core.api.Assertions.assertThat;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

/**
 * Upgrades, as opposed to fresh installs (every other integration test starts from an empty
 * database). v0.1.0 is the first release, so the upgrade paths that exist are the ones from
 * databases created by earlier development builds, at any earlier version, holding real data.
 *
 * <p>Two things are checked. Every version applies on top of the one before it, one at a time, as
 * it would on a database that was last started on that version. And the most recent change that
 * touches existing data keeps what was there: a review recorded before the checklist existed is
 * still there afterwards, unchanged, with an empty checklist.
 */
@Testcontainers
class MigrationUpgradeIT {

  @Container
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  private static Flyway flyway(String target) {
    return Flyway.configure()
        .dataSource(postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword())
        .locations("classpath:db/migration")
        .defaultSchema("public")
        .target(target)
        .load();
  }

  private static Connection connect() throws SQLException {
    return java.sql.DriverManager.getConnection(
        postgres.getJdbcUrl(), postgres.getUsername(), postgres.getPassword());
  }

  @Test
  void everyVersionAppliesOnTopOfThePreviousOneAndALaterRunHasNothingLeftToDo() {
    int latest = flyway("latest").info().all().length;
    assertThat(latest).as("the application ships migrations").isGreaterThanOrEqualTo(11);

    for (int version = 1; version <= latest; version++) {
      var result = flyway(String.valueOf(version)).migrate();
      assertThat(result.success).as("migrating to version " + version).isTrue();
      assertThat(result.migrationsExecuted).as("version " + version + " ran once").isEqualTo(1);
    }

    var again = flyway("latest").migrate();
    assertThat(again.migrationsExecuted).as("nothing left after the last version").isZero();
    assertThat(flyway("latest").info().pending()).isEmpty();
  }

  @Test
  void aReviewRecordedBeforeTheChecklistExistedSurvivesTheUpgradeUnchanged() throws Exception {
    // A database as an earlier build left it: everything up to version 10, with a reviewed
    // revision.
    try (Connection connection = connect();
        Statement statement = connection.createStatement()) {
      statement.execute("drop schema if exists certforge cascade");
      statement.execute("drop schema public cascade");
      statement.execute("create schema public");
    }
    assertThat(flyway("10").migrate().success).isTrue();

    UUID question = UUID.randomUUID();
    UUID revision = UUID.randomUUID();
    UUID author = UUID.randomUUID();
    UUID reviewer = UUID.randomUUID();
    try (Connection connection = connect();
        Statement statement = connection.createStatement()) {
      statement.execute(
          "insert into certforge.qb_question (id, created_by) values ('"
              + question
              + "', '"
              + author
              + "')");
      statement.execute(
          "insert into certforge.qb_question_revision"
              + " (id, question_id, revision_number, status, question_type, author_id, prompt)"
              + " values ('"
              + revision
              + "', '"
              + question
              + "', 1, 'APPROVED', 'SINGLE_CHOICE', '"
              + author
              + "', 'Written before the upgrade')");
      statement.execute(
          "insert into certforge.qb_content_review"
              + " (id, revision_id, reviewer_id, decision, comment)"
              + " values ('"
              + UUID.randomUUID()
              + "', '"
              + revision
              + "', '"
              + reviewer
              + "', 'APPROVED', 'Reviewed before the upgrade')");
    }

    var upgraded = flyway("latest").migrate();
    assertThat(upgraded.success).isTrue();
    assertThat(upgraded.migrationsExecuted)
        .as("only the newer versions ran")
        .isGreaterThanOrEqualTo(1);

    try (Connection connection = connect();
        Statement statement = connection.createStatement();
        ResultSet rows =
            statement.executeQuery(
                "select r.prompt, r.status, c.decision, c.comment, c.checklist"
                    + " from certforge.qb_question_revision r"
                    + " join certforge.qb_content_review c on c.revision_id = r.id"
                    + " where r.id = '"
                    + revision
                    + "'")) {
      assertThat(rows.next()).as("the revision and its review are still there").isTrue();
      assertThat(rows.getString("prompt")).isEqualTo("Written before the upgrade");
      assertThat(rows.getString("status")).isEqualTo("APPROVED");
      assertThat(rows.getString("decision")).isEqualTo("APPROVED");
      assertThat(rows.getString("comment")).isEqualTo("Reviewed before the upgrade");
      assertThat(rows.getString("checklist")).as("no checklist was recorded then").isEmpty();
      assertThat(rows.next()).isFalse();
    }
  }

  /**
   * The claim V13 has to earn. It renames the column a published revision is bound to, and the
   * whole of ADR 0003 rests on that binding: a published revision points at exactly the context it
   * was approved for, and nothing may silently move it. So this starts from a database as version
   * 12 left it, with a question published against an exam version, and checks the binding is the
   * same id afterwards under the new name — and that the exam identity V13 moved to its own table
   * went with it rather than being recreated.
   */
  @Test
  void aPublishedRevisionKeepsItsBindingWhenTheExamVersionBecomesATrackVersion() throws Exception {
    try (Connection connection = connect();
        Statement statement = connection.createStatement()) {
      statement.execute("drop schema if exists certforge cascade");
      statement.execute("drop schema public cascade");
      statement.execute("create schema public");
    }
    assertThat(flyway("12").migrate().success).isTrue();

    UUID question = UUID.randomUUID();
    UUID revision = UUID.randomUUID();
    UUID author = UUID.randomUUID();
    UUID examVersion;
    try (Connection connection = connect();
        Statement statement = connection.createStatement()) {
      // The seeded Java SE 21 exam version, which V4 inserted and V13 will rename around.
      try (ResultSet active =
          statement.executeQuery(
              "select id from certforge.catalog_exam_version where status = 'ACTIVE'")) {
        assertThat(active.next()).as("version 12 seeds an active exam version").isTrue();
        examVersion = active.getObject("id", UUID.class);
      }
      statement.execute(
          "insert into certforge.qb_question (id, created_by) values ('"
              + question
              + "', '"
              + author
              + "')");
      statement.execute(
          "insert into certforge.qb_question_revision"
              + " (id, question_id, revision_number, status, question_type, author_id, prompt,"
              + " exam_version_id, published_by, published_at)"
              + " values ('"
              + revision
              + "', '"
              + question
              + "', 1, 'PUBLISHED', 'SINGLE_CHOICE', '"
              + author
              + "', 'Published before the upgrade', '"
              + examVersion
              + "', '"
              + author
              + "', now())");
    }

    assertThat(flyway("latest").migrate().success).isTrue();

    try (Connection connection = connect();
        Statement statement = connection.createStatement();
        ResultSet rows =
            statement.executeQuery(
                "select r.status, r.track_version_id, v.label, e.exam_code"
                    + " from certforge.qb_question_revision r"
                    + " join certforge.catalog_track_version v on v.id = r.track_version_id"
                    + " join certforge.catalog_certification_exam e on e.track_version_id = v.id"
                    + " where r.id = '"
                    + revision
                    + "'")) {
      assertThat(rows.next()).as("the published revision is still bound to its context").isTrue();
      assertThat(rows.getString("status")).isEqualTo("PUBLISHED");
      assertThat(rows.getObject("track_version_id", UUID.class))
          .as("the same id, under the new column name")
          .isEqualTo(examVersion);
      assertThat(rows.getString("exam_code"))
          .as("the exam identity moved to its own table with the version it belongs to")
          .isEqualTo("1Z0-830");
      assertThat(rows.next()).isFalse();
    }
  }
}
