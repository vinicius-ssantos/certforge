package dev.certforge.preparationcatalog.internal;

import dev.certforge.preparationcatalog.internal.AdminViews.AdminTrackView;
import dev.certforge.preparationcatalog.internal.CatalogRows.MappingRow;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
      @Min(1) int javaRelease,
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
}
