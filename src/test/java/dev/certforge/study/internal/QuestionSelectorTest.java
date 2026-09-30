package dev.certforge.study.internal;

import static org.assertj.core.api.Assertions.assertThat;

import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.Difficulty;
import dev.certforge.questionbank.PublishedQuestion;
import dev.certforge.questionbank.QuestionId;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.questionbank.QuestionType;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.IntStream;
import org.junit.jupiter.api.Test;

class QuestionSelectorTest {

  private static final TopicId TOPIC = new TopicId(UUID.randomUUID());

  private static List<PublishedQuestion> questions(int count) {
    return IntStream.range(0, count)
        .mapToObj(
            i ->
                new PublishedQuestion(
                    new QuestionId(UUID.randomUUID()),
                    new QuestionRevisionId(UUID.randomUUID()),
                    1,
                    QuestionType.SINGLE_CHOICE,
                    TOPIC,
                    21,
                    Difficulty.EASY,
                    "Prompt " + i,
                    List.of()))
        .toList();
  }

  @Test
  void selectsTheRequestedNumberOfDistinctQuestionsFromTheEligibleOnes() {
    List<PublishedQuestion> eligible = questions(10);

    List<PublishedQuestion> selected = new QuestionSelector(new Random(1)).select(eligible, 4);

    assertThat(selected).hasSize(4).doesNotHaveDuplicates().isSubsetOf(eligible);
  }

  @Test
  void theSameSeedGivesTheSameSelectionAndOrder() {
    List<PublishedQuestion> eligible = questions(12);

    List<PublishedQuestion> first = new QuestionSelector(new Random(42)).select(eligible, 6);
    List<PublishedQuestion> second = new QuestionSelector(new Random(42)).select(eligible, 6);

    assertThat(first).isEqualTo(second);
  }

  @Test
  void differentSeedsGiveDifferentSelections() {
    List<PublishedQuestion> eligible = questions(20);

    List<PublishedQuestion> first = new QuestionSelector(new Random(1)).select(eligible, 10);
    List<PublishedQuestion> second = new QuestionSelector(new Random(2)).select(eligible, 10);

    assertThat(first).isNotEqualTo(second);
  }

  @Test
  void asksForAllQuestionsReturnsAPermutation() {
    List<PublishedQuestion> eligible = questions(5);

    List<PublishedQuestion> selected = new QuestionSelector(new Random(3)).select(eligible, 5);

    assertThat(selected).containsExactlyInAnyOrderElementsOf(eligible);
  }

  @Test
  void doesNotModifyTheEligibleList() {
    List<PublishedQuestion> eligible = questions(8);
    List<PublishedQuestion> before = List.copyOf(eligible);

    new QuestionSelector(new Random(9)).select(eligible, 3);

    assertThat(eligible).isEqualTo(before);
  }
}
