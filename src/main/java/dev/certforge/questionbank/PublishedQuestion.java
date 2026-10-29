package dev.certforge.questionbank;

import dev.certforge.preparationcatalog.TopicId;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/**
 * Learner-safe projection of a published revision. It deliberately has no correctness flags,
 * explanation, references, reviewer identity or editorial data, so it can be serialized to a
 * learner before an answer is submitted.
 *
 * <p>{@code javaRelease} is null for a question that is not about one. It was a primitive until
 * interview sessions needed this view: an interview question targets no Java release, and building
 * a learner view of one unboxed a null into a crash. The same mistake, one layer down, as the
 * certification exam that could not exist without a Java release.
 *
 * <p>{@code aiReviewed} is the one piece of editorial provenance this view does carry, by ADR 0022
 * decision 6: a question currently published on an unconfirmed AI approval says so to the learner
 * looking at it, the same way the editorial desk already discloses a self-review (ADR 0018). It is
 * never true for a revision a human reviewer approved, and it stops being true the moment a {@code
 * CONTENT_REVIEW} account confirms it.
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
    List<PublishedOption> options,
    boolean aiReviewed) {}
