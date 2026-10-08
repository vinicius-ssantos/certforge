package dev.certforge.study.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import dev.certforge.preparationcatalog.ExamVersionView;
import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.PreparationTrackId;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.preparationcatalog.TopicView;
import dev.certforge.preparationcatalog.TrackKind;
import dev.certforge.preparationcatalog.TrackVersionId;
import dev.certforge.preparationcatalog.TrackView;
import dev.certforge.questionbank.Difficulty;
import dev.certforge.questionbank.PublishedQuestion;
import dev.certforge.questionbank.QuestionBank;
import dev.certforge.questionbank.QuestionId;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.questionbank.QuestionType;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class MockExamPlannerTest {

  @Test
  void buildsFiftyDistinctQuestionsWithFiveFromEveryExamTopic() {
    Fixture fixture = fixture(15);
    MockExamPlanner planner =
        new MockExamPlanner(
            fixture.catalog, fixture.questionBank, new MockExamBlueprintCatalog(), new Random(42));

    MockExamPlanner.Plan plan = planner.plan("java-se-21");

    assertThat(plan.blueprint().examCode()).isEqualTo("1Z0-830");
    assertThat(plan.questions()).hasSize(50);
    assertThat(plan.questions().stream().map(q -> q.question().revisionId()).distinct())
        .hasSize(50);
    for (TopicView topic : fixture.topics) {
      assertThat(plan.questions().stream().filter(q -> q.topicId().equals(topic.id())).count())
          .isEqualTo(5);
    }
  }

  @Test
  void readinessReportsThePublishedContentShortfallWithoutStartingAMock() {
    Fixture fixture = fixture(2);
    MockExamPlanner planner =
        new MockExamPlanner(
            fixture.catalog, fixture.questionBank, new MockExamBlueprintCatalog(), new Random(42));

    MockExamPlanner.Readiness readiness = planner.readiness("java-se-21");

    assertThat(readiness.contentReady()).isFalse();
    assertThat(readiness.missingQuestionCount()).isEqualTo(30);
    assertThat(readiness.topics()).hasSize(10);
    assertThat(readiness.topics())
        .allSatisfy(
            topic -> {
              assertThat(topic.required()).isEqualTo(5);
              assertThat(topic.available()).isEqualTo(2);
              assertThat(topic.missing()).isEqualTo(3);
              assertThat(topic.ready()).isFalse();
            });
  }

  @Test
  void seededRandomnessMakesTheWholePlanReproducibleForTests() {
    Fixture fixture = fixture(15);

    List<QuestionRevisionId> first =
        new MockExamPlanner(
                fixture.catalog,
                fixture.questionBank,
                new MockExamBlueprintCatalog(),
                new Random(7))
            .plan("java-se-21").questions().stream().map(q -> q.question().revisionId()).toList();
    List<QuestionRevisionId> second =
        new MockExamPlanner(
                fixture.catalog,
                fixture.questionBank,
                new MockExamBlueprintCatalog(),
                new Random(7))
            .plan("java-se-21").questions().stream().map(q -> q.question().revisionId()).toList();

    assertThat(first).isEqualTo(second).doesNotHaveDuplicates();
  }

  @Test
  void aTopicWithTooLittlePublishedContentFailsInsteadOfSilentlyShorteningTheMock() {
    Fixture fixture = fixture(15);
    TopicView shortTopic = fixture.topics.get(4);
    when(fixture.questionBank.eligibleForTopic(shortTopic.id()))
        .thenReturn(fixture.questionsByTopic.get(4).subList(0, 4));

    assertThatThrownBy(
            () ->
                new MockExamPlanner(
                        fixture.catalog,
                        fixture.questionBank,
                        new MockExamBlueprintCatalog(),
                        new Random(3))
                    .plan("java-se-21"))
        .isInstanceOfSatisfying(
            StudyException.class,
            error -> {
              assertThat(error.code()).isEqualTo("insufficient_mock_content");
              assertThat(error.details())
                  .containsEntry("topicId", shortTopic.id().value().toString())
                  .containsEntry("requested", 5)
                  .containsEntry("available", 4);
            });
  }

  @Test
  void anExamWithoutABlueprintFailsExplicitly() {
    PreparationCatalog catalog = mock(PreparationCatalog.class);
    QuestionBank bank = mock(QuestionBank.class);
    TrackView track = track("1Z0-999", topics(10));
    when(catalog.activeTrack("future")).thenReturn(java.util.Optional.of(track));

    assertThatThrownBy(
            () ->
                new MockExamPlanner(catalog, bank, new MockExamBlueprintCatalog(), new Random(1))
                    .plan("future"))
        .isInstanceOfSatisfying(
            StudyException.class,
            error -> assertThat(error.code()).isEqualTo("mock_exam_not_configured"));
  }

  @Test
  void blueprintAndActiveTopicCountMustAgree() {
    PreparationCatalog catalog = mock(PreparationCatalog.class);
    QuestionBank bank = mock(QuestionBank.class);
    TrackView track = track("1Z0-830", topics(9));
    when(catalog.activeTrack("java-se-21")).thenReturn(java.util.Optional.of(track));

    assertThatThrownBy(
            () ->
                new MockExamPlanner(catalog, bank, new MockExamBlueprintCatalog(), new Random(1))
                    .plan("java-se-21"))
        .isInstanceOfSatisfying(
            StudyException.class,
            error -> {
              assertThat(error.code()).isEqualTo("mock_exam_topic_mismatch");
              assertThat(error.details())
                  .containsEntry("expected", 10)
                  .containsEntry("available", 9);
            });
  }

  private static Fixture fixture(int questionsPerTopic) {
    List<TopicView> topics = topics(10);
    PreparationCatalog catalog = mock(PreparationCatalog.class);
    QuestionBank bank = mock(QuestionBank.class);
    TrackView track = track("1Z0-830", topics);
    when(catalog.activeTrack("java-se-21")).thenReturn(java.util.Optional.of(track));

    List<List<PublishedQuestion>> all = new ArrayList<>();
    for (TopicView topic : topics) {
      List<PublishedQuestion> questions = questions(topic.id(), questionsPerTopic);
      all.add(questions);
      when(bank.eligibleForTopic(topic.id())).thenReturn(questions);
    }
    return new Fixture(catalog, bank, topics, all);
  }

  private static TrackView track(String examCode, List<TopicView> topics) {
    return new TrackView(
        new PreparationTrackId(UUID.randomUUID()),
        "java-se-21",
        "Java SE 21 Developer",
        TrackKind.CERTIFICATION,
        "Oracle",
        "Java SE 21 Developer Professional",
        new ExamVersionView(
            new TrackVersionId(UUID.randomUUID()),
            "Java SE 21",
            examCode,
            "Java SE 21 Developer Professional",
            21,
            "https://education.oracle.com/"),
        topics);
  }

  private static List<TopicView> topics(int count) {
    List<TopicView> topics = new ArrayList<>();
    for (int i = 0; i < count; i++) {
      topics.add(
          new TopicView(
              new TopicId(UUID.randomUUID()),
              "topic-" + i,
              "Topic " + i,
              "Objective " + i,
              List.of()));
    }
    return List.copyOf(topics);
  }

  private static List<PublishedQuestion> questions(TopicId topicId, int count) {
    List<PublishedQuestion> questions = new ArrayList<>();
    HashSet<QuestionRevisionId> seen = new HashSet<>();
    for (int i = 0; i < count; i++) {
      QuestionRevisionId revisionId = new QuestionRevisionId(UUID.randomUUID());
      seen.add(revisionId);
      questions.add(
          new PublishedQuestion(
              new QuestionId(UUID.randomUUID()),
              revisionId,
              1,
              QuestionType.SINGLE_CHOICE,
              topicId,
              21,
              Difficulty.MEDIUM,
              "Prompt " + i,
              List.of()));
    }
    assertThat(seen).hasSize(count);
    return List.copyOf(questions);
  }

  private record Fixture(
      PreparationCatalog catalog,
      QuestionBank questionBank,
      List<TopicView> topics,
      List<List<PublishedQuestion>> questionsByTopic) {}
}
