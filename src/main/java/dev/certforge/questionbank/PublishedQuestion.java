package dev.certforge.questionbank;

import dev.certforge.preparationcatalog.TopicId;
import java.util.List;

/**
 * Learner-safe projection of a published revision. It deliberately has no correctness flags,
 * explanation, references, reviewer or editorial data, so it can be serialized to a learner before
 * an answer is submitted.
 */
public record PublishedQuestion(
    QuestionId questionId,
    QuestionRevisionId revisionId,
    int revisionNumber,
    QuestionType type,
    TopicId topicId,
    int javaRelease,
    Difficulty difficulty,
    String prompt,
    List<PublishedOption> options) {}
