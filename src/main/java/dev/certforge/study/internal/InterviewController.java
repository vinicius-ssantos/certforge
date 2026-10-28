package dev.certforge.study.internal;

import dev.certforge.study.Confidence;
import dev.certforge.study.internal.InterviewViews.InterviewAnswerView;
import dev.certforge.study.internal.InterviewViews.InterviewSessionSummary;
import dev.certforge.study.internal.InterviewViews.InterviewSessionView;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Interview practice sessions. Every operation requires the STUDY permission, the same as ordinary
 * study: it is the same learner practising, on material that is reviewed the same way.
 */
@RestController
@RequestMapping("/api/study/interviews")
@PreAuthorize("hasAuthority('STUDY')")
class InterviewController {

  private final InterviewService service;
  private final InterviewEvidenceService evidenceService;

  InterviewController(InterviewService service, InterviewEvidenceService evidenceService) {
    this.service = service;
    this.evidenceService = evidenceService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  InterviewSessionView start(@Valid @RequestBody InterviewStartRequest request) {
    return service.start(
        request.trackSlug(), request.topicIds(), request.questionCount(), request.blueprintId());
  }

  @GetMapping
  List<InterviewSessionSummary> list(@RequestParam(required = false) SessionStatus status) {
    return service.list(status);
  }

  @GetMapping("/{sessionId}")
  InterviewSessionView get(@PathVariable UUID sessionId) {
    return service.get(sessionId);
  }

  /**
   * Answers one item. An objective item takes the options selected; a guided item takes none, and
   * sending some is refused rather than ignored.
   */
  @PostMapping("/{sessionId}/items/{position}/answer")
  @ResponseStatus(HttpStatus.CREATED)
  InterviewAnswerView answer(
      @PathVariable UUID sessionId,
      @PathVariable int position,
      @RequestHeader(value = AttemptController.IDEMPOTENCY_KEY, required = false) String key,
      @Valid @RequestBody AnswerRequest request) {
    return service.answer(
        sessionId,
        position,
        key,
        request.selectedOptions(),
        request.confidence(),
        request.elapsedMillis());
  }

  /**
   * What the learner says their own guided answer covered, which can only be said after they have
   * read what a reviewer expected -- so it is its own step, not a field on the answer above.
   */
  @PostMapping("/{sessionId}/items/{position}/concepts")
  @ResponseStatus(HttpStatus.CREATED)
  InterviewAnswerView markConcepts(
      @PathVariable UUID sessionId,
      @PathVariable int position,
      @Valid @RequestBody MarkRequest request) {
    return service.markConcepts(
        sessionId,
        position,
        request.coveredConcepts() == null ? Map.of() : request.coveredConcepts());
  }

  /** What interview practice has shown, with the responses behind every number (#23). */
  @GetMapping("/evidence")
  InterviewEvidenceViews.InterviewEvidenceView evidence(@RequestParam String trackSlug) {
    return evidenceService.of(trackSlug);
  }

  @PostMapping("/{sessionId}/complete")
  InterviewSessionView complete(@PathVariable UUID sessionId) {
    return service.complete(sessionId);
  }

  @PostMapping("/{sessionId}/abandon")
  InterviewSessionView abandon(@PathVariable UUID sessionId) {
    return service.abandon(sessionId);
  }

  /**
   * {@code topicIds} empty means the whole track; {@code questionCount} is optional and the server
   * applies its default and limits.
   */
  record InterviewStartRequest(
      @NotBlank @Size(max = 100) String trackSlug,
      @Size(max = 30) List<UUID> topicIds,
      Integer questionCount,
      /**
       * A blueprint of the learner's own, which chooses the topics and weights them. Cannot be
       * combined with {@code topicIds}: two answers to the same question, and the learner would not
       * know which was used.
       */
      UUID blueprintId) {}

  /**
   * {@code selectedOptions} is empty for a guided item, where the learner's own answer stays in
   * their browser: there is nothing the product could do with the text that would not be a claim
   * about the person (ADR 0019).
   */
  record AnswerRequest(
      @Size(max = 8) List<@NotBlank @Size(max = 1) String> selectedOptions,
      @NotNull Confidence confidence,
      @Min(0) @Max(86400000) long elapsedMillis) {}

  /**
   * Which expected concepts the learner says their own guided answer covered, by the concept's
   * position, true for covered and false for not.
   *
   * <p>Marking nothing means only that they did not say — it is not a claim that nothing was
   * covered. The product never fills this in, because it never reads the answer (ADR 0019).
   */
  record MarkRequest(@Size(max = 20) Map<Integer, Boolean> coveredConcepts) {}
}
