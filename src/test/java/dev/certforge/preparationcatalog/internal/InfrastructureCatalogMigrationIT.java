package dev.certforge.preparationcatalog.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import dev.certforge.preparationcatalog.TrackKind;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.jdbc.core.JdbcTemplate;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.postgresql.PostgreSQLContainer;

/** Regression checks for the additive infrastructure track foundation (#165). */
@SpringBootTest
@Testcontainers
class InfrastructureCatalogMigrationIT {

  @Container @ServiceConnection
  static final PostgreSQLContainer postgres = new PostgreSQLContainer("postgres:18.6-alpine");

  @Autowired JdbcTemplate jdbc;

  @Test
  void javaCertificationKeepsItsExamIdentityAndJavaRelease() {
    assertThat(
            jdbc.queryForObject(
                "select exam_code || ':' || java_release from certforge.catalog_certification_exam"
                    + " where track_version_id = ?::uuid",
                String.class,
                "a2000000-0000-4000-8000-000000000001"))
        .isEqualTo("1Z0-830:21");
  }

  @Test
  void generalTrackKindIsSupportedWithoutAnExamProfile() {
    var trackId = UUID.randomUUID();
    jdbc.update(
        "insert into certforge.catalog_track(id,slug,name,kind,status)"
            + " values (?, ?, 'Infrastructure Fundamentals', 'GENERAL', 'DRAFT')",
        trackId,
        "infra-" + trackId.toString().substring(0, 8));

    assertThat(
            TrackKind.valueOf(
                jdbc.queryForObject(
                    "select kind from certforge.catalog_track where id=?", String.class, trackId)))
        .isEqualTo(TrackKind.GENERAL);
    assertThat(
            jdbc.queryForObject(
                "select count(*) from certforge.catalog_certification_profile where track_id=?",
                Integer.class,
                trackId))
        .isZero();
  }

  @Test
  void infrastructureFoundationsRemainDraftAndInvisibleToLearners() {
    String track = "a1000000-0000-4000-8000-000000000003";
    String version = "a2000000-0000-4000-8000-000000000003";

    assertThat(
            jdbc.queryForObject(
                "select kind || ':' || status from certforge.catalog_track where id=?::uuid",
                String.class,
                track))
        .isEqualTo("GENERAL:DRAFT");
    assertThat(
            jdbc.queryForObject(
                "select count(*) from certforge.catalog_track_version_topic"
                    + " where track_version_id=?::uuid",
                Integer.class,
                version))
        .isEqualTo(10);
    assertThat(
            jdbc.queryForObject(
                "select count(*) from certforge.catalog_certification_exam"
                    + " where track_version_id=?::uuid",
                Integer.class,
                version))
        .isZero();
  }

  @Test
  void examSnapshotsRequireExplicitValidProvenance() {
    var versionId = UUID.randomUUID();
    var trackId = UUID.randomUUID();
    jdbc.update(
        "insert into certforge.catalog_track(id,slug,name,kind,status)"
            + " values (?, ?, 'Sample Cloud Exam', 'CERTIFICATION', 'DRAFT')",
        trackId,
        "exam-" + trackId.toString().substring(0, 8));
    jdbc.update(
        "insert into certforge.catalog_track_version(id,track_id,label)"
            + " values (?, ?, '2026.1')",
        versionId,
        trackId);
    jdbc.update(
        "insert into certforge.catalog_certification_exam"
            + "(track_version_id,exam_code,exam_name,java_release,objectives_url)"
            + " values (?, 'X-123', 'Cloud Exam', null, 'https://example.org/objectives')",
        versionId);

    assertThatThrownBy(
            () ->
                jdbc.update(
                    "insert into certforge.catalog_exam_objective_snapshot"
                        + "(track_version_id,provider_version,verified_on,source_url,source_digest)"
                        + " values (?, '2026.1', current_date, 'http://invalid.example', ?)",
                    versionId,
                    "sha256:" + "a".repeat(64)))
        .isInstanceOf(org.springframework.dao.DataIntegrityViolationException.class);

    jdbc.update(
        "insert into certforge.catalog_exam_objective_snapshot"
            + "(track_version_id,provider_version,verified_on,source_url,source_digest)"
            + " values (?, '2026.1', current_date, 'https://example.org/objectives', ?)",
        versionId,
        "sha256:" + "a".repeat(64));
    assertThat(
            jdbc.queryForObject(
                "select count(*) from certforge.catalog_exam_objective_snapshot where track_version_id=?",
                Integer.class,
                versionId))
        .isEqualTo(1);
  }
}
