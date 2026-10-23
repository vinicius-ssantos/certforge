package dev.certforge.questionbank;

import dev.certforge.preparationcatalog.TopicId;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/**
 * Learner-safe projection of a published revision. It deliberately has no correctness flags,
 * explanation, references, reviewer or editorial data, so it can be serialized to a learner before
 * an answer is submitted.
 *
 * <p>{@code javaRelease} is null for a question that is not about one. It was a primitive until
 * interview sessions needed this view: an interview question targets no Java release, and building
 * a learner view of one unboxed a null into a crash. The same mistake, one layer down, as the
 * certification exam that could not exist without a Java release.
 */
public record PublishedQuestion(
    QuestionId questionId,
    QuestionRevisionId revisionId,
    int revisionNumber,
    QuestionType type,
    TopicId topicId,
    @Schema(nullable = true) Integer javaRelease,
    @Schema(nullable = true) Difficulty difficulty,
    String prompt,
    List<PublishedOption> options) {}
