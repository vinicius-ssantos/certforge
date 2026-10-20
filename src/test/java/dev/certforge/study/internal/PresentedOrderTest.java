package dev.certforge.study.internal;

import static org.assertj.core.api.Assertions.assertThat;

import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.Difficulty;
import dev.certforge.questionbank.PublishedOption;
import dev.certforge.questionbank.PublishedQuestion;
import dev.certforge.questionbank.QuestionId;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.questionbank.QuestionType;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class PresentedOrderTest {

  private static final List<String> AUTHORED = List.of("A", "B", "C", "D");

  private static PublishedQuestion question(UUID revision) {
    return new PublishedQuestion(
        new QuestionId(UUID.randomUUID()),
        new QuestionRevisionId(revision),
        1,
        QuestionType.SINGLE_CHOICE,
        new TopicId(UUID.randomUUID()),
        21,
        Difficulty.EASY,
        "Prompt",
        AUTHORED.stream().map(key -> new PublishedOption(key, "Text " + key)).toList());
  }

  @Test
  void showsEveryOptionExactlyOnce() {
    List<String> presented = PresentedOrder.of(UUID.randomUUID(), UUID.randomUUID(), AUTHORED);
    assertThat(presented).containsExactlyInAnyOrderElementsOf(AUTHORED);
  }

  @Test
  void isTheSameOrderEveryTimeTheSameSessionAsksAboutTheSameQuestion() {
    UUID session = UUID.fromString("11111111-1111-4111-8111-111111111111");
    UUID revision = UUID.fromString("22222222-2222-4222-8222-222222222222");
    List<String> first = PresentedOrder.of(session, revision, AUTHORED);
    for (int again = 0; again < 20; again++) {
      // Not a cache: it is recomputed, and a learner refetching a question, reading the answer
      // afterwards or opening the attempt in their history must see the order they answered in.
      assertThat(PresentedOrder.of(session, revision, AUTHORED)).isEqualTo(first);
    }
  }

  @Test
  void doesNotShowEveryQuestionOfOneSessionTheSameWay() {
    UUID session = UUID.randomUUID();
    Set<List<String>> orders = new HashSet<>();
    for (int question = 0; question < 40; question++) {
      orders.add(PresentedOrder.of(session, UUID.randomUUID(), AUTHORED));
    }
    // The point of the whole thing: the authored order stops being the order on the screen. With
    // forty questions and twenty-four orders, one order for all of them would be a broken seed.
    assertThat(orders).hasSizeGreaterThan(1);
  }

  @Test
  void givesTwoSessionsDifferentOrdersForOneQuestion() {
    UUID revision = UUID.randomUUID();
    Set<List<String>> orders = new HashSet<>();
    for (int session = 0; session < 40; session++) {
      orders.add(PresentedOrder.of(UUID.randomUUID(), revision, AUTHORED));
    }
    assertThat(orders).hasSizeGreaterThan(1);
  }

  @Test
  void keepsTheQuestionItselfUntouched() {
    UUID revision = UUID.randomUUID();
    PublishedQuestion authored = question(revision);
    PublishedQuestion presented = PresentedOrder.of(UUID.randomUUID(), authored);

    assertThat(presented.questionId()).isEqualTo(authored.questionId());
    assertThat(presented.revisionId()).isEqualTo(authored.revisionId());
    assertThat(presented.prompt()).isEqualTo(authored.prompt());
    assertThat(presented.options()).containsExactlyInAnyOrderElementsOf(authored.options());
    // Each option keeps its own key, which is what an answer submits: only the order changes.
    assertThat(presented.options().stream().map(PublishedOption::key))
        .containsExactlyInAnyOrderElementsOf(AUTHORED);
  }

  @Test
  void ordersAQuestionTheSameWayWhicheverFormItIsAskedAbout() {
    UUID session = UUID.randomUUID();
    UUID revision = UUID.randomUUID();
    PublishedQuestion presented = PresentedOrder.of(session, question(revision));
    // The learner-safe projection and the graded answer are built in different places from
    // different records; if they disagreed, the reasons would sit under the wrong options.
    assertThat(presented.options().stream().map(PublishedOption::key).toList())
        .isEqualTo(PresentedOrder.of(session, revision, AUTHORED));
  }
}
