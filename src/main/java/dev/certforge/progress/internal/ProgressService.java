package dev.certforge.progress.internal;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.preparationcatalog.TopicView;
import dev.certforge.preparationcatalog.TrackView;
import dev.certforge.progress.internal.ProgressRepository.Counts;
import dev.certforge.progress.internal.ProgressViews.CountsView;
import dev.certforge.progress.internal.ProgressViews.Difference;
import dev.certforge.progress.internal.ProgressViews.RebuildResult;
import dev.certforge.progress.internal.ProgressViews.Reconciliation;
import dev.certforge.progress.internal.ProgressViews.TopicProgress;
import dev.certforge.study.AttemptFact;
import dev.certforge.study.AttemptRecorded;
import dev.certforge.study.StudyEvidence;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Topic progress, derived from accepted attempts.
 *
 * <p>The attempts are the evidence and this projection can always be recomputed from them. It is
 * kept up to date synchronously: the listener runs inside the transaction that records the attempt,
 * so the two commit or roll back together. {@link #reconcile()} shows any drift and {@link
 * #rebuild()} repairs it.
 *
 * <p>What counts: every accepted attempt, whatever the status of its session. A question that was
 * never answered is neither attempted nor incorrect, and a session without answers adds nothing.
 */
@Service
class ProgressService {

  private final ProgressRepository repository;
  private final StudyEvidence evidence;
  private final PreparationCatalog catalog;
  private final CurrentActor currentActor;
  private final TransactionTemplate transaction;

  ProgressService(
      ProgressRepository repository,
      StudyEvidence evidence,
      PreparationCatalog catalog,
      CurrentActor currentActor,
      PlatformTransactionManager transactionManager) {
    this.repository = repository;
    this.evidence = evidence;
    this.catalog = catalog;
    this.currentActor = currentActor;
    this.transaction = new TransactionTemplate(transactionManager);
  }

  // ---- keeping the projection up to date -----------------------------------------------------

  /** Runs inside the transaction that recorded the attempt. */
  @EventListener
  void onAttemptRecorded(AttemptRecorded event) {
    UUID learner = event.learner().value();
    repository.lock(learner);
    repository.add(learner, event.topic().value(), event.correct(), event.submittedAt());
  }

  // ---- reading -------------------------------------------------------------------------------

  /** One entry per topic of the active tracks, in catalog order, then any other topic with data. */
  @Transactional(readOnly = true)
  List<TopicProgress> topics() {
    Map<UUID, Counts> stored = repository.find(currentActor.require().value());
    List<TopicProgress> result = new ArrayList<>();
    Set<UUID> shown = new HashSet<>();
    for (TrackView track : catalog.activeTracks()) {
      for (TopicView topic : flatten(track.topics())) {
        UUID id = topic.id().value();
        shown.add(id);
        result.add(view(topic.id(), topic.name(), track.slug(), stored.get(id)));
      }
    }
    // Topics no longer in an active track keep their history.
    stored.entrySet().stream()
        .filter(entry -> !shown.contains(entry.getKey()))
        .sorted(Map.Entry.comparingByKey())
        .forEach(
            entry -> result.add(view(new TopicId(entry.getKey()), null, null, entry.getValue())));
    return result;
  }

  private static List<TopicView> flatten(List<TopicView> topics) {
    List<TopicView> flat = new ArrayList<>();
    for (TopicView topic : topics) {
      flat.add(topic);
      flat.addAll(flatten(topic.subtopics()));
    }
    return flat;
  }

  private static TopicProgress view(TopicId id, String name, String trackSlug, Counts counts) {
    int attempted = counts == null ? 0 : counts.attempted();
    int correct = counts == null ? 0 : counts.correct();
    return new TopicProgress(
        id,
        name,
        trackSlug,
        attempted,
        correct,
        attempted - correct,
        accuracy(attempted, correct),
        counts == null ? null : counts.lastActivityAt());
  }

  /** {@code correct / attempted} to four decimals; absent until something has been attempted. */
  static BigDecimal accuracy(int attempted, int correct) {
    if (attempted == 0) {
      return null;
    }
    return BigDecimal.valueOf(correct)
        .divide(BigDecimal.valueOf(attempted), 4, RoundingMode.HALF_UP);
  }

  // ---- reconciliation and rebuild ------------------------------------------------------------

  /**
   * Compares the stored projection with what the attempts say it should be. Both reads use one
   * snapshot, so a submission committing in between cannot be mistaken for drift.
   */
  @Transactional(isolation = Isolation.REPEATABLE_READ, readOnly = true)
  Reconciliation reconcile() {
    ActorId learner = currentActor.require();
    Map<UUID, Counts> expected = derive(learner);
    Map<UUID, Counts> stored = repository.find(learner.value());
    List<Difference> differences = new ArrayList<>();
    Set<UUID> topics = new HashSet<>(expected.keySet());
    topics.addAll(stored.keySet());
    topics.stream()
        .sorted()
        .forEach(
            topic -> {
              Counts want = expected.get(topic);
              Counts have = stored.get(topic);
              if (!java.util.Objects.equals(want, have)) {
                differences.add(new Difference(new TopicId(topic), counts(want), counts(have)));
              }
            });
    return new Reconciliation(differences.isEmpty(), differences);
  }

  /** Recomputes the current learner's projection from their attempts. */
  @Transactional
  RebuildResult rebuild() {
    return rebuild(currentActor.require());
  }

  /** Rebuilds every learner's projection, including removing rows with no attempts behind them. */
  void rebuildAll() {
    Set<UUID> learners = new HashSet<>();
    evidence.learnersWithAttempts().forEach(learner -> learners.add(learner.value()));
    learners.addAll(repository.learnersWithRows());
    for (UUID learner : learners) {
      transaction.executeWithoutResult(status -> rebuild(new ActorId(learner)));
    }
  }

  private RebuildResult rebuild(ActorId learner) {
    // Waits for any attempt being recorded, and makes recording wait for this rebuild.
    repository.lock(learner.value());
    Map<UUID, Counts> expected = derive(learner);
    Map<UUID, Counts> stored = repository.find(learner.value());
    Set<UUID> topics = new HashSet<>(expected.keySet());
    topics.addAll(stored.keySet());
    int corrected =
        (int)
            topics.stream()
                .filter(topic -> !java.util.Objects.equals(expected.get(topic), stored.get(topic)))
                .count();
    repository.deleteAll(learner.value());
    expected.forEach((topic, counts) -> repository.insert(learner.value(), topic, counts));
    return new RebuildResult(expected.size(), corrected);
  }

  /** The projection as the persisted attempts define it. */
  private Map<UUID, Counts> derive(ActorId learner) {
    Map<UUID, int[]> totals = new LinkedHashMap<>();
    Map<UUID, java.time.Instant> last = new HashMap<>();
    for (AttemptFact fact : evidence.attemptsOf(learner)) {
      UUID topic = fact.topic().value();
      int[] counts = totals.computeIfAbsent(topic, key -> new int[2]);
      counts[0]++;
      if (fact.correct()) {
        counts[1]++;
      }
      last.merge(topic, fact.submittedAt(), (a, b) -> a.isAfter(b) ? a : b);
    }
    Map<UUID, Counts> result = new LinkedHashMap<>();
    totals.forEach(
        (topic, counts) -> result.put(topic, new Counts(counts[0], counts[1], last.get(topic))));
    return result;
  }

  private static CountsView counts(Counts counts) {
    return counts == null
        ? null
        : new CountsView(counts.attempted(), counts.correct(), counts.lastActivityAt());
  }
}
