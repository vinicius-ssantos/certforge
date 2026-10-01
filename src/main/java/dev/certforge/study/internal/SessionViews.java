package dev.certforge.study.internal;

import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.PublishedQuestion;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Learner-facing projections. Questions are {@link PublishedQuestion}s, which carry no answer key,
 * explanation, references or editorial data.
 */
interface SessionViews {

  record SessionView(
      UUID id,
      TopicId topicId,
      String status,
      int requestedCount,
      Instant createdAt,
      Instant expiresAt,
      @Schema(nullable = true) Instant closedAt,
      List<SessionQuestionView> questions) {}

  record SessionQuestionView(int position, PublishedQuestion question, boolean answered) {}

  record SessionSummary(
      UUID id,
      TopicId topicId,
      String status,
      int questionCount,
      int answeredCount,
      Instant createdAt,
      Instant expiresAt,
      @Schema(nullable = true) Instant closedAt) {}
}
