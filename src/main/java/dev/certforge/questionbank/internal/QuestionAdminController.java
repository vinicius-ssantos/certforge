package dev.certforge.questionbank.internal;

import dev.certforge.questionbank.Difficulty;
import dev.certforge.questionbank.QuestionType;
import dev.certforge.questionbank.RevisionStatus;
import dev.certforge.questionbank.Seniority;
import dev.certforge.questionbank.internal.AdminQuestionViews.QuestionSummary;
import dev.certforge.questionbank.internal.AdminQuestionViews.QuestionView;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Editorial API. Each operation requires the explicit permission for its stage: authoring, review
 * or publication. Every command returns the updated editorial view of the question.
 */
@RestController
class QuestionAdminController {

  private static final String AUTHOR_ACCESS = "hasAuthority('CONTENT_AUTHOR')";
  private static final String READ_ACCESS =
      "hasAnyAuthority('CONTENT_AUTHOR', 'CONTENT_REVIEW', 'CONTENT_PUBLISH')";

  private final QuestionBankService service;

  QuestionAdminController(QuestionBankService service) {
    this.service = service;
  }

  @GetMapping("/api/admin/questions")
  @PreAuthorize(READ_ACCESS)
  List<QuestionSummary> list(@RequestParam(required = false) RevisionStatus status) {
    return service.list(status);
  }

  @GetMapping("/api/admin/questions/{questionId}")
  @PreAuthorize(READ_ACCESS)
  QuestionView get(@PathVariable UUID questionId) {
    return service.get(questionId);
  }

  @PostMapping("/api/admin/questions")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize(AUTHOR_ACCESS)
  QuestionView create(@Valid @RequestBody RevisionRequest request) {
    return service.create(request.toContent());
  }

  @PostMapping("/api/admin/questions/{questionId}/revisions")
  @ResponseStatus(HttpStatus.CREATED)
  @PreAuthorize(AUTHOR_ACCESS)
  QuestionView newRevision(@PathVariable UUID questionId) {
    return service.newRevision(questionId);
  }

  @PutMapping("/api/admin/question-revisions/{revisionId}")
  @PreAuthorize(AUTHOR_ACCESS)
  QuestionView edit(@PathVariable UUID revisionId, @Valid @RequestBody RevisionRequest request) {
    return service.edit(revisionId, request.toContent());
  }

  @PostMapping("/api/admin/question-revisions/{revisionId}/submit")
  @PreAuthorize(AUTHOR_ACCESS)
  QuestionView submit(@PathVariable UUID revisionId) {
    return service.submit(revisionId);
  }

  @PostMapping("/api/admin/question-revisions/{revisionId}/approve")
  @PreAuthorize("hasAuthority('CONTENT_REVIEW')")
  QuestionView approve(
      @PathVariable UUID revisionId, @Valid @RequestBody(required = false) ReviewRequest request) {
    return service.approve(
        revisionId,
        request == null ? null : request.comment(),
        request == null ? null : request.checklist());
  }

  @PostMapping("/api/admin/question-revisions/{revisionId}/request-changes")
  @PreAuthorize("hasAuthority('CONTENT_REVIEW')")
  QuestionView requestChanges(
      @PathVariable UUID revisionId, @Valid @RequestBody RequiredReviewRequest request) {
    return service.requestChanges(revisionId, request.comment(), request.checklist());
  }

  @PostMapping("/api/admin/question-revisions/{revisionId}/publish")
  @PreAuthorize("hasAuthority('CONTENT_PUBLISH')")
  QuestionView publish(@PathVariable UUID revisionId) {
    return service.publish(revisionId);
  }

  @PostMapping("/api/admin/question-revisions/{revisionId}/deprecate")
  @PreAuthorize("hasAuthority('CONTENT_PUBLISH')")
  QuestionView deprecate(@PathVariable UUID revisionId) {
    return service.deprecate(revisionId);
  }

  /** Draft content. Completeness is checked when the revision is submitted, not when saved. */
  record RevisionRequest(
      @NotNull QuestionType type,
      UUID topicId,
      @Min(1) Integer javaRelease,
      Seniority seniority,
      Difficulty difficulty,
      @Size(max = 2000) String difficultyRationale,
      @Size(max = 10000) String prompt,
      @Size(max = 10000) String explanation,
      @Valid @Size(max = 8) List<OptionRequest> options,
      @Valid @Size(max = 10) List<ReferenceRequest> references) {

    RevisionContent toContent() {
      return new RevisionContent(
          type,
          topicId,
          javaRelease,
          seniority,
          difficulty,
          difficultyRationale,
          prompt,
          explanation,
          options == null
              ? List.of()
              : options.stream()
                  .map(
                      o ->
                          new RevisionContent.Option(
                              o.key(), o.text(), o.correct(), o.explanation()))
                  .toList(),
          references == null
              ? List.of()
              : references.stream()
                  .map(r -> new RevisionContent.Reference(r.title(), r.url()))
                  .toList());
    }
  }

  record OptionRequest(
      @NotBlank @Pattern(regexp = "^[A-H]$") String key,
      @NotBlank @Size(max = 2000) String text,
      boolean correct,
      @Size(max = 2000) String explanation) {}

  record ReferenceRequest(
      @NotBlank @Size(max = 300) String title,
      @NotBlank @Size(max = 500) @Pattern(regexp = "^https://\\S+$") String url) {}

  /**
   * {@code checklist} lists the content-policy items the reviewer checked, by code (see {@code
   * ReviewChecklist}); it is recorded with the decision and optional.
   */
  record ReviewRequest(@Size(max = 4000) String comment, @Size(max = 10) List<String> checklist) {}

  record RequiredReviewRequest(
      @NotBlank @Size(max = 4000) String comment, @Size(max = 10) List<String> checklist) {}
}
