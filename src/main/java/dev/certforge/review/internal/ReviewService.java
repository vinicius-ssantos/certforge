package dev.certforge.review.internal;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.preparationcatalog.TopicView;
import dev.certforge.questionbank.PublishedQuestion;
import dev.certforge.questionbank.QuestionBank;
import dev.certforge.questionbank.QuestionId;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.review.internal.ReviewViews.Misconception;
import dev.certforge.review.internal.ReviewViews.Queue;
import dev.certforge.review.internal.ReviewViews.QueueItem;
import dev.certforge.study.AttemptFact;
import dev.certforge.study.Confidence;
import dev.certforge.study.StudyEvidence;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The review queue, derived from attempts on read (ADR 0013).
 *
 * <p>Nothing is stored. The queue is a projection of evidence the learner can already see, so it is
 * always reproducible and there is no scheduler state to drift from the attempts that produced it.
 * The cost is that the work grows with a learner's history, which is why the flow carries a
 * measured budget rather than an assumption.
 */
@Service
class ReviewService {

  /** The recall interval after the first confident-correct answer. It doubles from here. */
  static final Duration FIRST_RECALL = Duration.ofDays(1);

  /** Doubling stops here, so a question never leaves the queue for good. */
  static final Duration LONGEST_RECALL = Duration.ofDays(64);

  private final StudyEvidence evidence;
  private final QuestionBank questions;
  private final PreparationCatalog catalog;
  private final CurrentActor currentActor;
  private final Clock clock;

  ReviewService(
      StudyEvidence evidence,
      QuestionBank questions,
      PreparationCatalog catalog,
      CurrentActor currentActor,
      Clock clock) {
    this.evidence = evidence;
    this.questions = questions;
    this.catalog = catalog;
    this.currentActor = currentActor;
    this.clock = clock;
  }

  @Transactional(readOnly = true)
  Queue queue(Optional<TopicId> topic, int limit) {
    ActorId learner = currentActor.require();
    Instant now = clock.instant();

    List<AttemptFact> allAttempts = evidence.attemptsOf(learner);

    // Each distinct revision is resolved once. A learner answers the same question many times, so
    // looking it up per attempt is the difference between a cost that grows with attempts and one
    // that grows with questions: measured at 610 attempts over 20 questions, that was 256 ms
    // against 20 ms. The snapshot resolves a revision even after it has been replaced, so a
    // corrected question keeps the history of the revision the learner actually saw.
    Map<QuestionRevisionId, Optional<PublishedQuestion>> snapshots = new HashMap<>();
    for (AttemptFact attempt : allAttempts) {
      snapshots.computeIfAbsent(attempt.revision(), questions::findSnapshotQuestion);
    }

    // Attempts arrive oldest first, so grouping keeps each question's history in order.
    Map<QuestionId, List<AttemptFact>> history = new LinkedHashMap<>();
    Map<QuestionId, TopicId> topicOf = new HashMap<>();
    for (AttemptFact attempt : allAttempts) {
      snapshots
          .get(attempt.revision())
          .ifPresent(
              snapshot -> {
                history
                    .computeIfAbsent(snapshot.questionId(), id -> new ArrayList<>())
                    .add(attempt);
                topicOf.put(snapshot.questionId(), snapshot.topicId());
              });
    }

    // What is published now, per topic the learner has touched. A question that has been retired
    // since is not worth reviewing, and a corrected one is reviewed at its current revision.
    Map<QuestionId, PublishedQuestion> publishedNow = new HashMap<>();
    Map<TopicId, Integer> publishedPerTopic = new HashMap<>();
    for (TopicId attemptedTopic : new HashSet<>(topicOf.values())) {
      List<PublishedQuestion> eligible = questions.eligibleForTopic(attemptedTopic);
      publishedPerTopic.put(attemptedTopic, eligible.size());
      eligible.forEach(question -> publishedNow.put(question.questionId(), question));
    }

    List<QueueItem> due = new ArrayList<>();
    int waiting = 0;
    for (Map.Entry<QuestionId, List<AttemptFact>> entry : history.entrySet()) {
      PublishedQuestion published = publishedNow.get(entry.getKey());
      if (published == null) {
        continue;
      }
      if (topic.isPresent() && !topic.get().equals(published.topicId())) {
        continue;
      }
      List<AttemptFact> attempts = entry.getValue();
      Optional<ReviewReason> reason = reasonFor(attempts, now);
      if (reason.isEmpty()) {
        waiting += 1;
        continue;
      }
      due.add(item(published, attempts, reason.get()));
    }

    due.sort(Comparator.comparing(QueueItem::reason).thenComparing(QueueItem::lastAttemptedAt));
    int dueNow = due.size();
    List<QueueItem> page =
        due.size() > limit ? List.copyOf(due.subList(0, limit)) : List.copyOf(due);

    int attemptedQuestions = history.size();
    int publishedInTouchedTopics =
        publishedPerTopic.values().stream().mapToInt(Integer::intValue).sum();
    int neverAttempted = Math.max(0, publishedInTouchedTopics - attemptedQuestions);
    return new Queue(page, dueNow, waiting, neverAttempted);
  }

  /**
   * Why this question is worth revisiting, or empty when it is not yet due. The last attempt
   * decides the reason; the run of confident-correct answers before it decides how long a correct
   * one rests.
   */
  private Optional<ReviewReason> reasonFor(List<AttemptFact> attempts, Instant now) {
    AttemptFact last = attempts.getLast();
    if (!last.correct()) {
      return Optional.of(
          last.confidence() == Confidence.HIGH
              ? ReviewReason.WRONG_WHILE_CONFIDENT
              : ReviewReason.WRONG);
    }
    if (last.confidence() == Confidence.LOW) {
      return Optional.of(ReviewReason.RIGHT_BUT_UNSURE);
    }
    return now.isBefore(last.submittedAt().plus(recallInterval(attempts)))
        ? Optional.empty()
        : Optional.of(ReviewReason.DUE_FOR_RECALL);
  }

  /** One day after the first confident-correct answer, doubling for each consecutive one. */
  private Duration recallInterval(List<AttemptFact> attempts) {
    int streak = 0;
    for (int at = attempts.size() - 1; at >= 0; at--) {
      AttemptFact attempt = attempts.get(at);
      if (!attempt.correct() || attempt.confidence() == Confidence.LOW) {
        break;
      }
      streak += 1;
    }
    Duration interval = FIRST_RECALL;
    for (int doubling = 1; doubling < streak; doubling++) {
      if (interval.compareTo(LONGEST_RECALL) >= 0) {
        return LONGEST_RECALL;
      }
      interval = interval.multipliedBy(2);
    }
    return interval.compareTo(LONGEST_RECALL) > 0 ? LONGEST_RECALL : interval;
  }

  private QueueItem item(
      PublishedQuestion published, List<AttemptFact> attempts, ReviewReason reason) {
    AttemptFact last = attempts.getLast();
    int wrong = (int) attempts.stream().filter(attempt -> !attempt.correct()).count();
    return new QueueItem(
        published.questionId(),
        published.revisionId(),
        published.topicId(),
        catalog.findActiveTopic(published.topicId()).map(TopicView::name).orElse(null),
        published.prompt(),
        reason,
        last.submittedAt(),
        attempts.size(),
        wrong,
        last.correct());
  }

  /**
   * Where the learner has been wrong while saying they were confident, per topic, most recent
   * first. Derived from the attempts like the queue, and for the same reason: it is evidence they
   * can already see, so it cannot disagree with itself.
   *
   * <p>Attempts and distinct questions are counted separately because they mean different things.
   * It needs the question bank rather than the revision alone, so that a question corrected between
   * two wrong answers still counts as one question rather than two.
   */
  @Transactional(readOnly = true)
  List<Misconception> misconceptions() {
    ActorId learner = currentActor.require();
    List<AttemptFact> confidentlyWrong =
        evidence.attemptsOf(learner).stream()
            .filter(attempt -> !attempt.correct() && attempt.confidence() == Confidence.HIGH)
            .toList();

    Map<QuestionRevisionId, Optional<PublishedQuestion>> snapshots = new HashMap<>();
    for (AttemptFact attempt : confidentlyWrong) {
      snapshots.computeIfAbsent(attempt.revision(), questions::findSnapshotQuestion);
    }

    Map<TopicId, Integer> attemptsPerTopic = new LinkedHashMap<>();
    Map<TopicId, Set<QuestionId>> questionsPerTopic = new HashMap<>();
    Map<TopicId, Instant> lastPerTopic = new HashMap<>();
    for (AttemptFact attempt : confidentlyWrong) {
      Optional<PublishedQuestion> snapshot = snapshots.get(attempt.revision());
      if (snapshot.isEmpty()) {
        continue;
      }
      TopicId topic = snapshot.get().topicId();
      attemptsPerTopic.merge(topic, 1, Integer::sum);
      questionsPerTopic
          .computeIfAbsent(topic, id -> new HashSet<>())
          .add(snapshot.get().questionId());
      lastPerTopic.merge(topic, attempt.submittedAt(), (a, b) -> b.isAfter(a) ? b : a);
    }

    return attemptsPerTopic.entrySet().stream()
        .map(
            entry ->
                new Misconception(
                    entry.getKey(),
                    catalog.findActiveTopic(entry.getKey()).map(TopicView::name).orElse(null),
                    entry.getValue(),
                    questionsPerTopic.get(entry.getKey()).size(),
                    lastPerTopic.get(entry.getKey())))
        .sorted(Comparator.comparing(Misconception::lastAt).reversed())
        .toList();
  }
}
