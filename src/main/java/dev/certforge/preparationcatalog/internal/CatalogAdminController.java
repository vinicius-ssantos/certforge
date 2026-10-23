package dev.certforge.preparationcatalog.internal;

import dev.certforge.preparationcatalog.internal.AdminViews.AdminTrackView;
import dev.certforge.preparationcatalog.internal.CatalogRows.MappingRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.ObjectiveRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.ObjectiveSnapshotRow;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Administrative catalog operations. Every operation requires CATALOG_MANAGE and returns the
 * updated view of the affected track.
 */
@RestController
@RequestMapping("/api/admin/catalog")
@PreAuthorize("hasAuthority('CATALOG_MANAGE')")
class CatalogAdminController {

  private static final String SLUG_PATTERN = "^[a-z0-9]+(-[a-z0-9]+)*$";

  private final CatalogAdminService service;

  CatalogAdminController(CatalogAdminService service) {
    this.service = service;
  }

  @GetMapping("/tracks")
  List<AdminTrackView> tracks() {
    return service.listTracks();
  }

  @GetMapping("/tracks/{trackId}")
  AdminTrackView track(@PathVariable UUID trackId) {
    return service.getTrack(trackId);
  }

  @PostMapping("/tracks")
  @ResponseStatus(HttpStatus.CREATED)
  AdminTrackView createTrack(@Valid @RequestBody CreateTrackRequest request) {
    return service.createTrack(
        request.slug(), request.name(), request.provider(), request.certificationName());
  }

  @PostMapping("/tracks/{trackId}/activate")
  AdminTrackView activateTrack(@PathVariable UUID trackId) {
    return service.activateTrack(trackId);
  }

  @PostMapping("/tracks/{trackId}/deactivate")
  AdminTrackView deactivateTrack(@PathVariable UUID trackId) {
    return service.deactivateTrack(trackId);
  }

  @PostMapping("/tracks/{trackId}/exam-versions")
  @ResponseStatus(HttpStatus.CREATED)
  AdminTrackView createExamVersion(
      @PathVariable UUID trackId, @Valid @RequestBody CreateExamVersionRequest request) {
    return service.createExamVersion(
        trackId,
        request.label(),
        request.examCode(),
        request.examName(),
        request.javaRelease(),
        request.objectivesUrl());
  }

  @PutMapping("/exam-versions/{examVersionId}/topics")
  AdminTrackView setMappings(
      @PathVariable UUID examVersionId, @Valid @RequestBody SetMappingsRequest request) {
    List<MappingRow> rows =
        request.topics().stream()
            .map(
                entry ->
                    new MappingRow(
                        examVersionId,
                        entry.topicId(),
                        entry.objectiveRef().trim(),
                        entry.position(),
                        // A canonical weight is interview-track material (ADR 0016 decision 7).
                        // This endpoint maps an exam's objectives, where position is the ordering
                        // and every topic carries the same weight by definition.
                        null))
            .toList();
    return service.setMappings(examVersionId, rows);
  }

  /**
   * Records the verified objectives of one exam version: what was read, from where, and when.
   *
   * <p>PUT because it is one reading of one page replacing another, not an append.
   */
  @PutMapping("/exam-versions/{examVersionId}/objectives")
  AdminTrackView setObjectives(
      @PathVariable UUID examVersionId, @Valid @RequestBody SetObjectivesRequest request) {
    List<ObjectiveRow> objectives =
        request.objectives().stream()
            .map(
                entry ->
                    new ObjectiveRow(
                        examVersionId,
                        entry.key().trim(),
                        entry.title().trim(),
                        entry.sourceRef() == null ? null : entry.sourceRef().trim()))
            .toList();
    return service.setObjectives(
        examVersionId,
        new ObjectiveSnapshotRow(
            examVersionId,
            request.providerVersion().trim(),
            request.verifiedOn(),
            request.sourceUrl().trim(),
            request.sourceDigest().trim(),
            // VERIFIED unless the reader says otherwise. STALE is how a person records that the
            // provider's page has moved on and this reading has not caught up yet: nothing here
            // fetches that page, by policy, so staleness is an observation and not a computation.
            request.status() == null ? "VERIFIED" : request.status()),
        objectives);
  }

  @PostMapping("/exam-versions/{examVersionId}/activate")
  AdminTrackView activateExamVersion(@PathVariable UUID examVersionId) {
    return service.activateExamVersion(examVersionId);
  }

  @PostMapping("/exam-versions/{examVersionId}/deactivate")
  AdminTrackView deactivateExamVersion(@PathVariable UUID examVersionId) {
    return service.deactivateExamVersion(examVersionId);
  }

  @PostMapping("/tracks/{trackId}/topics")
  @ResponseStatus(HttpStatus.CREATED)
  AdminTrackView createTopic(
      @PathVariable UUID trackId, @Valid @RequestBody CreateTopicRequest request) {
    return service.createTopic(trackId, request.slug(), request.name(), request.parentId());
  }

  @PutMapping("/topics/{topicId}")
  AdminTrackView renameTopic(
      @PathVariable UUID topicId, @Valid @RequestBody RenameTopicRequest request) {
    return service.renameTopic(topicId, request.name());
  }

  record CreateTrackRequest(
      @NotBlank @Size(max = 64) @Pattern(regexp = SLUG_PATTERN) String slug,
      @NotBlank @Size(max = 200) String name,
      @NotBlank @Size(max = 100) String provider,
      @NotBlank @Size(max = 200) String certificationName) {}

  record CreateExamVersionRequest(
      @NotBlank @Size(max = 100) String label,
      @NotBlank @Size(max = 32) String examCode,
      @NotBlank @Size(max = 200) String examName,
      /** Omitted for an exam that is not about a Java release — CKAD, CKA, an AWS associate. */
      @Min(1) Integer javaRelease,
      @NotBlank @Size(max = 500) @Pattern(regexp = "^https://\\S+$") String objectivesUrl) {}

  record CreateTopicRequest(
      @NotBlank @Size(max = 64) @Pattern(regexp = SLUG_PATTERN) String slug,
      @NotBlank @Size(max = 200) String name,
      UUID parentId) {}

  record RenameTopicRequest(@NotBlank @Size(max = 200) String name) {}

  record SetMappingsRequest(@NotNull @Valid List<MappingEntry> topics) {}

  record MappingEntry(
      @NotNull UUID topicId,
      @NotBlank @Size(max = 300) String objectiveRef,
      @Min(0) int position) {}

  /**
   * One reading of a provider's objectives page. The digest is of the page as it was read, so a
   * later reading that produces a different digest is a different snapshot and says so; the shapes
   * are checked here so that a bad one is a 400 naming the field rather than a constraint violation
   * from the database.
   */
  record SetObjectivesRequest(
      @NotBlank @Size(max = 100) String providerVersion,
      @NotNull LocalDate verifiedOn,
      @NotBlank @Size(max = 500) @Pattern(regexp = "^https://\\S+$") String sourceUrl,
      @NotBlank @Pattern(regexp = "^sha256:[0-9a-f]{64}$") String sourceDigest,
      @NotNull @Valid @Size(min = 1, max = 200) List<ObjectiveEntry> objectives,
      /**
       * Omitted for an ordinary reading, which is VERIFIED. STALE records that the provider has
       * published something newer and this reading has not caught up; RETIRED, that the exam is
       * gone. Both are observations a person makes, because nothing here reads a provider's page by
       * itself.
       */
      @Pattern(regexp = "^(VERIFIED|STALE|RETIRED)$") String status) {}

  /** {@code sourceRef} is where on the page the objective was read, and may be omitted. */
  record ObjectiveEntry(
      @NotBlank @Size(max = 120) String key,
      @NotBlank @Size(max = 400) String title,
      @Size(max = 500) String sourceRef) {}
}
