package dev.certforge.study.internal;

import dev.certforge.study.internal.MockExamService.ResponseOutcome;
import dev.certforge.study.internal.MockExamViews.MockExamResult;
import dev.certforge.study.internal.MockExamViews.MockExamView;
import dev.certforge.study.internal.MockExamViews.ResponseReceipt;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Timed certification mock exams. Active-run endpoints never expose answer material. */
@RestController
@RequestMapping("/api/study/mock-exams")
@PreAuthorize("hasAuthority('STUDY')")
class MockExamController {

  private static final String IDEMPOTENCY_KEY = "Idempotency-Key";
  private static final String REPLAYED = "Idempotency-Replayed";

  private final MockExamService service;

  MockExamController(MockExamService service) {
    this.service = service;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  MockExamView start(@Valid @RequestBody StartRequest request) {
    return service.start(request.trackSlug());
  }

  @GetMapping("/{sessionId}")
  MockExamView get(@PathVariable UUID sessionId) {
    return service.get(sessionId);
  }

  @PostMapping("/{sessionId}/questions/{position}/response")
  ResponseEntity<ResponseReceipt> respond(
      @PathVariable UUID sessionId,
      @PathVariable int position,
      @RequestHeader(name = IDEMPOTENCY_KEY, required = false) String idempotencyKey,
      @Valid @RequestBody ResponseRequest request) {
    ResponseOutcome outcome =
        service.respond(sessionId, position, idempotencyKey, request.selectedOptions());
    ResponseEntity.BodyBuilder response =
        ResponseEntity.status(outcome.replayed() ? HttpStatus.OK : HttpStatus.CREATED)
            .cacheControl(CacheControl.noStore());
    if (outcome.replayed()) {
      response.header(REPLAYED, "true");
    }
    return response.body(outcome.receipt());
  }

  @PostMapping("/{sessionId}/finish")
  MockExamView finish(@PathVariable UUID sessionId) {
    return service.finish(sessionId);
  }

  @GetMapping("/{sessionId}/result")
  ResponseEntity<MockExamResult> result(@PathVariable UUID sessionId) {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.noStore())
        .body(service.result(sessionId));
  }

  record StartRequest(@NotBlank String trackSlug) {}

  record ResponseRequest(
      @NotEmpty @Size(max = 8) List<@Pattern(regexp = "^[A-Z]$") String> selectedOptions) {}
}
