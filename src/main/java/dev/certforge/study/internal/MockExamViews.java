package dev.certforge.study.internal;

import dev.certforge.preparationcatalog.PreparationTrackId;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.PublishedQuestion;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/** Learner-facing mock-exam projections. Answer material exists only in terminal result views. */
interface MockExamViews {

  record MockExamView(
      UUID id,
      PreparationTrackId trackId,
      String status,
      int questionCount,
      int answeredCount,
      int passingPercentage,
      Instant createdAt,
      Instant expiresAt,
      @Schema(nullable = true) Instant closedAt,
      List<MockExamQuestionView> questions) {}

  record MockExamQuestionView(
      int position, TopicId topicId, PublishedQuestion question, boolean answered) {}

  record ResponseReceipt(
      int position, UUID revisionId, List<String> selectedOptions, Instant submittedAt) {}

  record MockExamResult(
      UUID id,
      PreparationTrackId trackId,
      String status,
      int total,
      int answered,
      int correct,
      int percentage,
      int passingPercentage,
      int passingCorrectCount,
      boolean passed,
      long elapsedSeconds,
      List<TopicResult> topics,
      List<QuestionResult> questions) {}

  record TopicResult(TopicId topicId, int total, int answered, int correct, int percentage) {}

  record QuestionResult(
      int position,
      TopicId topicId,
      PublishedQuestion question,
      List<String> selectedOptions,
      boolean answered,
      boolean correct,
      Answer answer) {}

  record Answer(
      List<String> correctOptions,
      String explanation,
      List<OptionAnswer> options,
      List<Reference> references) {}

  record OptionAnswer(String key, String text, boolean correct, String explanation) {}

  record Reference(String title, String url) {}
}
