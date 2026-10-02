package dev.certforge.study.internal;

import dev.certforge.study.Confidence;
import dev.certforge.study.internal.AttemptService.Outcome;
import dev.certforge.study.internal.AttemptService.Submission;
import dev.certforge.study.internal.AttemptViews.AttemptResult;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Answer submission. Responses contain the answer key, so they are marked {@code no-store}; the key
 * is only ever sent after the submission has been accepted.
 */
@RestController
@RequestMapping("/api/study/sessions/{sessionId}/questions/{position}/attempt")
@PreAuthorize("hasAuthority('STUDY')")
class AttemptController {

  static final String IDEMPOTENCY_KEY = "Idempotency-Key";
  static final String REPLAYED = "Idempotency-Replayed";

  private final AttemptService service;

  AttemptController(AttemptService service) {
    this.service = service;
  }

  /** {@code 201} for a new attempt, {@code 200} with {@code Idempotency-Replayed} for a retry. */
  @PostMapping
  ResponseEntity<AttemptResult> submit(
      @PathVariable UUID sessionId,
      @PathVariable int position,
      @RequestHeader(name = IDEMPOTENCY_KEY, required = false) String idempotencyKey,
      @Valid @RequestBody AttemptRequest request) {
    Outcome outcome =
        service.submit(
            sessionId,
            position,
            idempotencyKey,
            new Submission(
                request.selectedOptions(), request.confidence(), request.elapsedMillis()));
    ResponseEntity.BodyBuilder response =
        ResponseEntity.status(outcome.replayed() ? HttpStatus.OK : HttpStatus.CREATED)
            .cacheControl(CacheControl.noStore());
    if (outcome.replayed()) {
      response.header(REPLAYED, "true");
    }
    return response.body(outcome.result());
  }

  @GetMapping
  ResponseEntity<AttemptResult> get(@PathVariable UUID sessionId, @PathVariable int position) {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.noStore())
        .body(service.get(sessionId, position));
  }

  /**
   * The learner's answer. It has no {@code correct} field on purpose: correctness is computed by
   * the server, and any such field sent by a client is ignored.
   */
  record AttemptRequest(
      @NotEmpty @Size(max = 8) List<@Pattern(regexp = "^[A-Z]$") String> selectedOptions,
      @NotNull Confidence confidence,
      @NotNull @Min(0) @Max(86_400_000L) Long elapsedMillis) {}
}
