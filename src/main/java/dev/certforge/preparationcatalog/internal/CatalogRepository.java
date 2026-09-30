package dev.certforge.preparationcatalog.internal;

import dev.certforge.preparationcatalog.TrackKind;
import dev.certforge.preparationcatalog.internal.CatalogRows.ExamVersionRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.MappingRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.TopicRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.TrackRow;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
class CatalogRepository {

  private static final String STATUS = "status";
  private static final String SLUG = "slug";
  private static final String NAME = "name";
  private static final String TRACK_ID = "trackId";
  private static final String SELECT_TRACK =
      "select t.id, t.slug, t.name, t.kind, t.status, p.provider, p.certification_name"
          + " from certforge.catalog_track t"
          + " join certforge.catalog_certification_profile p on p.track_id = t.id";
  private static final String SELECT_VERSION =
      "select id, track_id, label, exam_code, exam_name, java_release, objectives_url, status"
          + " from certforge.catalog_exam_version";
  private static final String SELECT_TOPIC =
      "select id, track_id, parent_id, slug, name from certforge.catalog_topic";

  private final JdbcClient jdbc;

  CatalogRepository(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  // ---- tracks --------------------------------------------------------------------------------

  List<TrackRow> findTracks(CatalogStatus status) {
    return jdbc.sql(SELECT_TRACK + " where t.status = :status order by t.slug")
        .param(STATUS, status.name())
        .query(CatalogRepository::mapTrack)
        .list();
  }

  List<TrackRow> findAllTracks() {
    return jdbc.sql(SELECT_TRACK + " order by t.slug").query(CatalogRepository::mapTrack).list();
  }

  Optional<TrackRow> findTrack(UUID id) {
    return jdbc.sql(SELECT_TRACK + " where t.id = :id")
        .param("id", id)
        .query(CatalogRepository::mapTrack)
        .optional();
  }

  Optional<TrackRow> findActiveTrackBySlug(String slug) {
    return jdbc.sql(SELECT_TRACK + " where t.slug = :slug and t.status = 'ACTIVE'")
        .param(SLUG, slug)
        .query(CatalogRepository::mapTrack)
        .optional();
  }

  /** Inserts a draft certification track with its profile; fails on a duplicate slug. */
  void insertTrack(UUID id, String slug, String name, String provider, String certificationName) {
    try {
      jdbc.sql(
              "insert into certforge.catalog_track (id, slug, name, kind, status)"
                  + " values (:id, :slug, :name, 'CERTIFICATION', 'DRAFT')")
          .param("id", id)
          .param(SLUG, slug)
          .param(NAME, name)
          .update();
    } catch (DuplicateKeyException e) {
      throw CatalogException.conflict("slug_already_exists", "A track with this slug exists");
    }
    jdbc.sql(
            "insert into certforge.catalog_certification_profile"
                + " (track_id, provider, certification_name) values (:id, :provider, :name)")
        .param("id", id)
        .param("provider", provider)
        .param(NAME, certificationName)
        .update();
  }

  void setTrackStatus(UUID id, CatalogStatus status) {
    jdbc.sql("update certforge.catalog_track set status = :status where id = :id")
        .param(STATUS, status.name())
        .param("id", id)
        .update();
  }

  // ---- exam versions -------------------------------------------------------------------------

  List<ExamVersionRow> findExamVersions(UUID trackId) {
    return jdbc.sql(SELECT_VERSION + " where track_id = :trackId order by label")
        .param(TRACK_ID, trackId)
        .query(CatalogRepository::mapVersion)
        .list();
  }

  Optional<ExamVersionRow> findActiveExamVersion(UUID trackId) {
    return jdbc.sql(SELECT_VERSION + " where track_id = :trackId and status = 'ACTIVE'")
        .param(TRACK_ID, trackId)
        .query(CatalogRepository::mapVersion)
        .optional();
  }

  Optional<ExamVersionRow> findExamVersion(UUID id) {
    return jdbc.sql(SELECT_VERSION + " where id = :id")
        .param("id", id)
        .query(CatalogRepository::mapVersion)
        .optional();
  }

  void insertExamVersion(ExamVersionRow row) {
    try {
      jdbc.sql(
              "insert into certforge.catalog_exam_version"
                  + " (id, track_id, label, exam_code, exam_name, java_release, objectives_url)"
                  + " values (:id, :trackId, :label, :code, :name, :release, :url)")
          .param("id", row.id())
          .param(TRACK_ID, row.trackId())
          .param("label", row.label())
          .param("code", row.examCode())
          .param(NAME, row.examName())
          .param("release", row.javaRelease())
          .param("url", row.objectivesUrl())
          .update();
    } catch (DuplicateKeyException e) {
      throw CatalogException.conflict(
          "exam_version_already_exists", "An exam version with this label exists");
    }
  }

  void setExamVersionStatus(UUID id, CatalogStatus status) {
    try {
      jdbc.sql("update certforge.catalog_exam_version set status = :status where id = :id")
          .param(STATUS, status.name())
          .param("id", id)
          .update();
    } catch (DuplicateKeyException e) {
      throw CatalogException.conflict(
          "active_exam_version_exists", "The track already has an active exam version");
    }
  }

  // ---- topics --------------------------------------------------------------------------------

  List<TopicRow> findTopics(UUID trackId) {
    return jdbc.sql(SELECT_TOPIC + " where track_id = :trackId order by slug")
        .param(TRACK_ID, trackId)
        .query(CatalogRepository::mapTopic)
        .list();
  }

  Optional<TopicRow> findTopic(UUID id) {
    return jdbc.sql(SELECT_TOPIC + " where id = :id")
        .param("id", id)
        .query(CatalogRepository::mapTopic)
        .optional();
  }

  void insertTopic(TopicRow row) {
    try {
      jdbc.sql(
              "insert into certforge.catalog_topic (id, track_id, parent_id, slug, name)"
                  + " values (:id, :trackId, :parentId, :slug, :name)")
          .param("id", row.id())
          .param(TRACK_ID, row.trackId())
          .param("parentId", row.parentId())
          .param(SLUG, row.slug())
          .param(NAME, row.name())
          .update();
    } catch (DuplicateKeyException e) {
      throw CatalogException.conflict("slug_already_exists", "A topic with this slug exists");
    }
  }

  void renameTopic(UUID id, String name) {
    jdbc.sql("update certforge.catalog_topic set name = :name where id = :id")
        .param(NAME, name)
        .param("id", id)
        .update();
  }

  // ---- mappings ------------------------------------------------------------------------------

  List<MappingRow> findMappings(UUID examVersionId) {
    return jdbc.sql(
            "select exam_version_id, topic_id, objective_ref, position"
                + " from certforge.catalog_exam_version_topic"
                + " where exam_version_id = :id order by position")
        .param("id", examVersionId)
        .query(CatalogRepository::mapMapping)
        .list();
  }

  void replaceMappings(UUID examVersionId, List<MappingRow> mappings) {
    jdbc.sql("delete from certforge.catalog_exam_version_topic where exam_version_id = :id")
        .param("id", examVersionId)
        .update();
    for (MappingRow mapping : mappings) {
      jdbc.sql(
              "insert into certforge.catalog_exam_version_topic"
                  + " (exam_version_id, topic_id, objective_ref, position)"
                  + " values (:version, :topic, :ref, :position)")
          .param("version", examVersionId)
          .param("topic", mapping.topicId())
          .param("ref", mapping.objectiveRef())
          .param("position", mapping.position())
          .update();
    }
  }

  /** The active topic row if it is mapped in the active exam version of an active track. */
  Optional<TopicRow> findActiveTopic(UUID topicId) {
    return jdbc.sql(
            "select tp.id, tp.track_id, tp.parent_id, tp.slug, tp.name"
                + " from certforge.catalog_topic tp"
                + " join certforge.catalog_exam_version_topic m on m.topic_id = tp.id"
                + " join certforge.catalog_exam_version v on v.id = m.exam_version_id"
                + " join certforge.catalog_track t on t.id = v.track_id"
                + " where tp.id = :id and v.status = 'ACTIVE' and t.status = 'ACTIVE'")
        .param("id", topicId)
        .query(CatalogRepository::mapTopic)
        .optional();
  }

  // ---- mapping helpers -----------------------------------------------------------------------

  private static TrackRow mapTrack(ResultSet rs, int rowNum) throws SQLException {
    return new TrackRow(
        rs.getObject("id", UUID.class),
        rs.getString("slug"),
        rs.getString("name"),
        TrackKind.valueOf(rs.getString("kind")),
        CatalogStatus.valueOf(rs.getString("status")),
        rs.getString("provider"),
        rs.getString("certification_name"));
  }

  private static ExamVersionRow mapVersion(ResultSet rs, int rowNum) throws SQLException {
    return new ExamVersionRow(
        rs.getObject("id", UUID.class),
        rs.getObject("track_id", UUID.class),
        rs.getString("label"),
        rs.getString("exam_code"),
        rs.getString("exam_name"),
        rs.getInt("java_release"),
        rs.getString("objectives_url"),
        CatalogStatus.valueOf(rs.getString("status")));
  }

  private static TopicRow mapTopic(ResultSet rs, int rowNum) throws SQLException {
    return new TopicRow(
        rs.getObject("id", UUID.class),
        rs.getObject("track_id", UUID.class),
        rs.getObject("parent_id", UUID.class),
        rs.getString("slug"),
        rs.getString("name"));
  }

  private static MappingRow mapMapping(ResultSet rs, int rowNum) throws SQLException {
    return new MappingRow(
        rs.getObject("exam_version_id", UUID.class),
        rs.getObject("topic_id", UUID.class),
        rs.getString("objective_ref"),
        rs.getInt("position"));
  }
}
