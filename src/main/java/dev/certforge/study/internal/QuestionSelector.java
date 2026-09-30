package dev.certforge.study.internal;

import dev.certforge.questionbank.PublishedQuestion;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.random.RandomGenerator;
import org.springframework.stereotype.Component;

/** Picks which eligible questions a session contains, and in which order. */
@Component
class QuestionSelector {

  private final RandomGenerator random;

  QuestionSelector(RandomGenerator random) {
    this.random = random;
  }

  /** A random subset of {@code count} distinct questions in a random order. */
  List<PublishedQuestion> select(List<PublishedQuestion> eligible, int count) {
    List<PublishedQuestion> shuffled = new ArrayList<>(eligible);
    Collections.shuffle(shuffled, random);
    return List.copyOf(shuffled.subList(0, count));
  }
}
