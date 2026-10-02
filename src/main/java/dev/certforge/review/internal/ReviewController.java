package dev.certforge.review.internal;

import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.review.internal.ReviewViews.Queue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * The learner's own review queue. Every operation requires the STUDY permission, and the queue is
 * always the caller's: there is no parameter that could ask for somebody else's.
 */
@RestController
@RequestMapping("/api/review")
@PreAuthorize("hasAuthority('STUDY')")
@Validated
class ReviewController {

  /** Enough for a sitting; the queue reports how many are due beyond it. */
  private static final int DEFAULT_LIMIT = 20;

  private final ReviewService service;

  ReviewController(ReviewService service) {
    this.service = service;
  }

  @GetMapping("/queue")
  Queue queue(
      @RequestParam(required = false) UUID topicId,
      @RequestParam(required = false) @Min(1) @Max(100) Integer limit) {
    return service.queue(
        Optional.ofNullable(topicId).map(TopicId::new), limit == null ? DEFAULT_LIMIT : limit);
  }
}
