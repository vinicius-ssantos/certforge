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

  record MockExamAvailability(
      boolean contentReady,
      @Schema(nullable = true) UUID activeSessionId,
      int questionCount,
      int questionsPerTopic,
      int missingQuestionCount,
      List<MockExamTopicAvailability> topics) {}

  record MockExamTopicAvailability(TopicId topicId, int required, int available, int missing) {}

  record MockExamHistoryItem(
      UUID id,
      PreparationTrackId trackId,
      String status,
      int questionCount,
      int answeredCount,
      @Schema(nullable = true) Integer correctCount,
      @Schema(nullable = true) Integer percentage,
      int passingPercentage,
      @Schema(nullable = true) Boolean passed,
      Instant createdAt,
      Instant expiresAt,
      @Schema(nullable = true) Instant closedAt,
      List<MockExamTopicHistoryItem> topics) {}

  record MockExamTopicHistoryItem(
      TopicId topicId, int total, int answered, int correct, int percentage, boolean needsReview) {}

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

  /**
   * What the learner is shown once an answer has been accepted.
   *
   * <p>Everything in here is answer material. It is built only on the paths that have already
   * established the learner may see it, and the verification evidence is no different: the output
   * of a question's programme frequently is the answer.
   */
  record Answer(
      List<String> correctOptions,
      String explanation,
      List<OptionAnswer> options,
      List<Reference> references,
      Verification verification) {}

  /** The programme the build ran for this question and what it printed. Null when there is none. */
  record Verification(List<SourceFile> files, String output) {}

  record SourceFile(String path, String body) {}

  record OptionAnswer(String key, String text, boolean correct, String explanation) {}

  record Reference(String title, String url) {}
}
