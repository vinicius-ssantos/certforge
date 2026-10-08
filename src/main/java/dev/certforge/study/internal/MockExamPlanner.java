package dev.certforge.study.internal;

import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.PreparationTrackId;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.preparationcatalog.TopicView;
import dev.certforge.preparationcatalog.TrackVersionId;
import dev.certforge.preparationcatalog.TrackView;
import dev.certforge.questionbank.PublishedQuestion;
import dev.certforge.questionbank.QuestionBank;
import dev.certforge.questionbank.QuestionRevisionId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.random.RandomGenerator;
import org.springframework.stereotype.Component;

/**
 * Builds the immutable question plan that a mock-exam session will persist.
 *
 * <p>No answers are exposed here. The planner reads only learner-safe published questions, takes
 * the configured number from each top-level exam topic, then shuffles the combined set. The caller
 * will persist the exact revision ids and order in the mock-exam aggregate introduced by the next
 * slice.
 */
@Component
class MockExamPlanner {

  record PlannedQuestion(TopicId topicId, PublishedQuestion question) {}

  record Plan(
      PreparationTrackId trackId,
      TrackVersionId examVersionId,
      MockExamBlueprint blueprint,
      List<PlannedQuestion> questions) {}

  record TopicReadiness(TopicId topicId, int required, int available) {
    int missing() {
      return Math.max(0, required - available);
    }

    boolean ready() {
      return missing() == 0;
    }
  }

  record Readiness(
      PreparationTrackId trackId, MockExamBlueprint blueprint, List<TopicReadiness> topics) {
    boolean contentReady() {
      return topics.stream().allMatch(TopicReadiness::ready);
    }

    int missingQuestionCount() {
      return topics.stream().mapToInt(TopicReadiness::missing).sum();
    }
  }

  private final PreparationCatalog catalog;
  private final QuestionBank questionBank;
  private final MockExamBlueprintCatalog blueprints;
  private final RandomGenerator random;

  MockExamPlanner(
      PreparationCatalog catalog,
      QuestionBank questionBank,
      MockExamBlueprintCatalog blueprints,
      RandomGenerator random) {
    this.catalog = catalog;
    this.questionBank = questionBank;
    this.blueprints = blueprints;
    this.random = random;
  }

  Readiness readiness(String trackSlug) {
    TrackView track =
        catalog
            .activeTrack(trackSlug)
            .orElseThrow(() -> StudyException.notFound("track_not_found", "Track not found"));
    MockExamBlueprint blueprint =
        blueprints
            .find(track.examVersion().examCode())
            .orElseThrow(
                () ->
                    StudyException.conflict(
                        "mock_exam_not_configured",
                        "Mock exam is not configured for this exam version"));

    List<TopicView> topics = track.topics();
    if (topics.size() != blueprint.topicCount()) {
      throw StudyException.conflict(
          "mock_exam_topic_mismatch",
          "The active exam topics do not match the configured mock-exam blueprint",
          Map.of("expected", blueprint.topicCount(), "available", topics.size()));
    }

    List<TopicReadiness> readiness = new ArrayList<>(topics.size());
    for (TopicView topic : topics) {
      readiness.add(
          new TopicReadiness(
              topic.id(),
              blueprint.questionsPerTopic(),
              questionBank.eligibleForTopic(topic.id()).size()));
    }
    return new Readiness(track.id(), blueprint, List.copyOf(readiness));
  }

  Plan plan(String trackSlug) {
    TrackView track =
        catalog
            .activeTrack(trackSlug)
            .orElseThrow(() -> StudyException.notFound("track_not_found", "Track not found"));
    MockExamBlueprint blueprint =
        blueprints
            .find(track.examVersion().examCode())
            .orElseThrow(
                () ->
                    StudyException.conflict(
                        "mock_exam_not_configured",
                        "Mock exam is not configured for this exam version"));

    List<TopicView> topics = track.topics();
    if (topics.size() != blueprint.topicCount()) {
      throw StudyException.conflict(
          "mock_exam_topic_mismatch",
          "The active exam topics do not match the configured mock-exam blueprint",
          Map.of("expected", blueprint.topicCount(), "available", topics.size()));
    }

    List<PlannedQuestion> selected = new ArrayList<>(blueprint.questionCount());
    Set<QuestionRevisionId> revisionIds = new HashSet<>();
    for (TopicView topic : topics) {
      List<PublishedQuestion> eligible = questionBank.eligibleForTopic(topic.id());
      if (eligible.size() < blueprint.questionsPerTopic()) {
        throw StudyException.conflict(
            "insufficient_mock_content",
            "Not enough published questions for a mock-exam topic",
            Map.of(
                "topicId", topic.id().value().toString(),
                "requested", blueprint.questionsPerTopic(),
                "available", eligible.size()));
      }
      List<PublishedQuestion> shuffled = new ArrayList<>(eligible);
      Collections.shuffle(shuffled, random);
      for (PublishedQuestion question : shuffled.subList(0, blueprint.questionsPerTopic())) {
        if (!revisionIds.add(question.revisionId())) {
          throw new IllegalStateException(
              "A revision was selected more than once across mock-exam topics");
        }
        selected.add(new PlannedQuestion(topic.id(), question));
      }
    }

    Collections.shuffle(selected, random);
    return new Plan(track.id(), track.examVersion().id(), blueprint, List.copyOf(selected));
  }
}
