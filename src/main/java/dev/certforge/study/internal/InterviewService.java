package dev.certforge.study.internal;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.preparationcatalog.InterviewTrackView;
import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.preparationcatalog.TopicView;
import dev.certforge.questionbank.GuidedMaterial;
import dev.certforge.questionbank.PublishedQuestion;
import dev.certforge.questionbank.QuestionBank;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.questionbank.QuestionType;
import dev.certforge.questionbank.RevisionEvidence;
import dev.certforge.study.Confidence;
import dev.certforge.study.internal.InterviewRepository.SnapshotItem;
import dev.certforge.study.internal.InterviewViews.ExpectedConceptView;
import dev.certforge.study.internal.InterviewViews.GuidedOutcome;
import dev.certforge.study.internal.InterviewViews.InterviewAnswerView;
import dev.certforge.study.internal.InterviewViews.InterviewItemView;
import dev.certforge.study.internal.InterviewViews.InterviewSessionSummary;
import dev.certforge.study.internal.InterviewViews.InterviewSessionView;
import dev.certforge.study.internal.InterviewViews.ObjectiveOutcome;
import dev.certforge.study.internal.InterviewViews.OptionAnswerView;
import dev.certforge.study.internal.InterviewViews.ReferenceView;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.random.RandomGenerator;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Interview session lifecycle and answering.
 *
 * <p>The third study aggregate (ADR 0020). A session spans a subset of an interview track's topics,
 * mixes objective and guided-response items, and treats them differently where it matters: an
 * objective answer is graded and hands back the answer material, and a guided answer is recorded
 * and hands back what a reviewer wrote down. Nothing here scores a guided answer, and nothing here
 * writes to study attempts, so certification readiness is untouched by interview practice.
 */
@Service
class InterviewService {

  private final InterviewRepository repository;
  private final BlueprintService blueprints;
  private final PreparationCatalog catalog;
  private final QuestionBank questionBank;
  private final CurrentActor currentActor;
  private final Clock clock;
  private final StudyProperties properties;
  private final RandomGenerator random;

  InterviewService(
      InterviewRepository repository,
      BlueprintService blueprints,
      PreparationCatalog catalog,
      QuestionBank questionBank,
      CurrentActor currentActor,
      Clock clock,
      StudyProperties properties,
      RandomGenerator random) {
    this.repository = repository;
    this.blueprints = blueprints;
    this.catalog = catalog;
    this.questionBank = questionBank;
    this.currentActor = currentActor;
    this.clock = clock;
    this.properties = properties;
    this.random = random;
  }

  // ---- start ---------------------------------------------------------------------------------

  /**
   * Starts a session on one interview track, over every topic of it or the subset asked for.
   *
   * <p>The subset is the point of the aggregate: preparing for one role is not preparing for a
   * whole taxonomy. An empty subset means the whole track.
   */
  @Transactional
  InterviewSessionView start(
      String trackSlug, List<UUID> topicIds, Integer requestedCount, UUID blueprintId) {
    ActorId learner = currentActor.require();
    Instant now = clock.instant().truncatedTo(ChronoUnit.MICROS);
    repository.expireDue(learner.value(), now);

    // Not activeTrack: a learner TrackView names an exam, so it filters interview tracks out by
    // construction. This read is the one shaped for a taxonomy.
    InterviewTrackView track =
        catalog
            .activeInterviewTrack(trackSlug)
            .orElseThrow(
                () ->
                    StudyException.notFound(
                        "interview_track_not_found", "No active interview track with that slug"));

    // A blueprint is the learner's own reading of a role, so it chooses the topics and how much
    // of the session each one gets. Asking for both a blueprint and a topic list is refused rather
    // than silently preferring one: the learner would not know which of their two answers was used.
    if (blueprintId != null && topicIds != null && !topicIds.isEmpty()) {
      throw StudyException.invalid(
          "blueprint_and_topics",
          "Choose a blueprint or a list of topics, not both: a blueprint already chooses topics");
    }
    Map<UUID, Integer> weights =
        blueprintId == null
            ? Map.of()
            : blueprints.weightsOf(blueprintId, track.versionId().value());
    List<TopicId> topics =
        blueprintId == null
            ? chosenTopics(track, topicIds)
            : weights.keySet().stream().map(TopicId::new).toList();
    if (topics.isEmpty()) {
      throw StudyException.conflict(
          "blueprint_weighs_nothing",
          "That blueprint matched no topic, so there is nothing to practise from it");
    }
    int count = requestedCount == null ? properties.defaultQuestionCount() : requestedCount;
    if (count < 1 || count > properties.maxQuestionCount()) {
      throw StudyException.invalid(
          "question_count_out_of_range",
          "The number of questions must be between 1 and " + properties.maxQuestionCount());
    }

    repository
        .findActive(learner.value(), track.versionId().value())
        .ifPresent(
            existing -> {
              throw StudyException.conflict(
                  "active_interview_session_exists",
                  "An interview session for this track is already in progress",
                  java.util.Map.of("sessionId", existing.id()));
            });

    List<SnapshotItem> pool = new ArrayList<>();
    for (TopicId topic : topics) {
      for (PublishedQuestion question : questionBank.eligibleForInterview(topic)) {
        pool.add(
            new SnapshotItem(
                0,
                question.revisionId().value(),
                topic.value(),
                question.type() == QuestionType.GUIDED_RESPONSE
                    ? ItemKind.GUIDED
                    : ItemKind.OBJECTIVE));
      }
    }
    if (pool.size() < count) {
      throw StudyException.conflict(
          "insufficient_content",
          "This track does not have that many published questions yet",
          java.util.Map.of("requested", count, "available", pool.size()));
    }
    List<SnapshotItem> chosen = new ArrayList<>(pool);
    java.util.Collections.shuffle(chosen, random);
    if (!weights.isEmpty()) {
      // Heavier topics first, so the questions the blueprint asked for survive the cut to the
      // requested count.
      // Within a weight the shuffled order stands, so two sessions from one blueprint still differ.
      chosen.sort(
          Comparator.comparingInt((SnapshotItem item) -> weights.getOrDefault(item.topicId(), 0))
              .reversed());
    }
    chosen = new ArrayList<>(chosen.subList(0, count));

    InterviewSession session =
        new InterviewSession(
            UUID.randomUUID(),
            learner.value(),
            track.versionId().value(),
            SessionStatus.IN_PROGRESS,
            count,
            now,
            now.plus(properties.sessionTtl()),
            null);
    try {
      repository.insert(session, chosen);
    } catch (DuplicateKeyException race) {
      InterviewSession winner =
          repository.findActive(learner.value(), track.versionId().value()).orElseThrow(() -> race);
      throw StudyException.conflict(
          "active_interview_session_exists",
          "An interview session for this track is already in progress",
          java.util.Map.of("sessionId", winner.id()));
    }
    return view(session);
  }

  /** Every active topic of the track, or the subset asked for, refusing a topic outside it. */
  private List<TopicId> chosenTopics(InterviewTrackView track, List<UUID> topicIds) {
    List<TopicId> all = new ArrayList<>();
    collect(track.topics(), all);
    if (topicIds == null || topicIds.isEmpty()) {
      return all;
    }
    Set<UUID> known = new HashSet<>();
    all.forEach(topic -> known.add(topic.value()));
    List<TopicId> chosen = new ArrayList<>();
    for (UUID topic : topicIds) {
      if (!known.contains(topic)) {
        throw StudyException.invalid(
            "topic_not_in_track", "A chosen topic is not part of this interview track");
      }
      chosen.add(new TopicId(topic));
    }
    return chosen;
  }

  private static void collect(List<TopicView> topics, List<TopicId> into) {
    for (TopicView topic : topics) {
      into.add(topic.id());
      collect(topic.subtopics(), into);
    }
  }

  // ---- reads ---------------------------------------------------------------------------------

  @Transactional
  InterviewSessionView get(UUID sessionId) {
    return view(owned(sessionId));
  }

  @Transactional(readOnly = true)
  List<InterviewSessionSummary> list(SessionStatus status) {
    ActorId learner = currentActor.require();
    return repository.findByLearner(learner.value(), status).stream()
        .map(
            session ->
                new InterviewSessionSummary(
                    session.id(),
                    session.trackVersionId(),
                    session.status().name(),
                    repository.snapshot(session.id()).size(),
                    repository.answeredPositions(session.id()).size(),
                    session.createdAt(),
                    session.expiresAt(),
                    session.closedAt()))
        .toList();
  }

  // ---- answering -----------------------------------------------------------------------------

  /**
   * Records an answer to one item.
   *
   * <p>The item decides what happens, not the request: an objective item is graded against its
   * options, and a guided item records that it was answered and returns the reviewed material. A
   * request that sends options for a guided item is refused rather than ignored, because ignoring
   * it would leave a learner believing their selection meant something.
   */
  @Transactional
  InterviewAnswerView answer(
      UUID sessionId,
      int position,
      String key,
      List<String> selectedOptions,
      Confidence confidence,
      long elapsedMillis,
      Map<Integer, Boolean> coveredConcepts) {
    ActorId learner = currentActor.require();
    requireKey(key);
    List<String> selected = normalize(selectedOptions);
    String fingerprint = fingerprint(sessionId, position, selected, confidence, elapsedMillis);

    Optional<InterviewResponse> earlier = repository.findByKey(learner.value(), key);
    if (earlier.isPresent()) {
      return replay(earlier.get(), fingerprint);
    }

    InterviewSession session = owned(sessionId);
    if (session.status() == SessionStatus.EXPIRED) {
      throw StudyException.conflict("session_expired", "The session has expired");
    }
    if (session.status() != SessionStatus.IN_PROGRESS) {
      throw StudyException.conflict(
          "session_not_in_progress", "The session is no longer in progress");
    }
    SnapshotItem item =
        repository
            .itemAt(sessionId, position)
            .orElseThrow(() -> StudyException.notFound("question_not_found", "Question not found"));
    Optional<InterviewResponse> answered = repository.findAt(sessionId, position);
    if (answered.isPresent()) {
      if (answered.get().idempotencyKey().equals(key)) {
        return replay(answered.get(), fingerprint);
      }
      throw StudyException.conflict(
          "question_already_answered", "This question has already been answered");
    }

    // The kind is the snapshot's, not a fresh read of the question: the question bank returns no
    // evidence at all for a guided revision, by design, and a session has to stay answerable from
    // what it recorded when it started.
    ItemKind kind = item.itemKind();
    RevisionEvidence evidence =
        kind == ItemKind.OBJECTIVE
            ? questionBank
                .findRevision(new QuestionRevisionId(item.revisionId()))
                .orElseThrow(
                    () ->
                        new IllegalStateException(
                            "Revision " + item.revisionId() + " of a session is not readable"))
            : null;
    if (kind == ItemKind.GUIDED && !selected.isEmpty()) {
      throw StudyException.invalid(
          "guided_item_takes_no_options",
          "This question is answered in your own words; nothing here grades a selection");
    }
    if (kind == ItemKind.OBJECTIVE) {
      validate(evidence, selected);
      if (!coveredConcepts.isEmpty()) {
        throw StudyException.invalid(
            "objective_item_has_no_concepts",
            "An objective question is graded against its options, not against expected concepts");
      }
    }
    if (kind == ItemKind.GUIDED) {
      validateConcepts(item.revisionId(), coveredConcepts);
    }

    Instant now = clock.instant().truncatedTo(ChronoUnit.MICROS);
    InterviewResponse response =
        new InterviewResponse(
            UUID.randomUUID(),
            sessionId,
            position,
            learner.value(),
            item.revisionId(),
            kind,
            kind == ItemKind.OBJECTIVE ? String.join(",", selected) : null,
            kind == ItemKind.OBJECTIVE ? grade(evidence, selected) : null,
            confidence,
            elapsedMillis,
            now,
            key,
            fingerprint);
    repository.insertResponse(response);
    // The learner's own marks about their own answer: evidence they created, recorded beside the
    // response and immutable with it (#23). Nothing scores them.
    repository.insertConceptMarks(response.id(), coveredConcepts);
    return answerView(response, evidence);
  }

  private InterviewAnswerView replay(InterviewResponse response, String fingerprint) {
    if (!response.fingerprint().equals(fingerprint)) {
      throw StudyException.conflict(
          "idempotency_key_reused", "That idempotency key was used for a different answer");
    }
    RevisionEvidence evidence =
        response.itemKind() == ItemKind.OBJECTIVE
            ? questionBank
                .findRevision(new QuestionRevisionId(response.revisionId()))
                .orElseThrow(
                    () ->
                        new IllegalStateException(
                            "Revision " + response.revisionId() + " is not readable"))
            : null;
    return answerView(response, evidence);
  }

  private InterviewAnswerView answerView(InterviewResponse response, RevisionEvidence evidence) {
    ObjectiveOutcome objective = null;
    GuidedOutcome guided = null;
    if (response.itemKind() == ItemKind.OBJECTIVE) {
      objective =
          new ObjectiveOutcome(
              List.of(response.selectedOptions().split(",", -1)),
              Boolean.TRUE.equals(response.correct()),
              evidence.options().stream()
                  .filter(RevisionEvidence.Option::correct)
                  .map(RevisionEvidence.Option::key)
                  .sorted()
                  .toList(),
              evidence.explanation(),
              evidence.options().stream()
                  .map(
                      option ->
                          new OptionAnswerView(
                              option.key(), option.text(), option.correct(), option.explanation()))
                  .toList(),
              evidence.references().stream()
                  .map(reference -> new ReferenceView(reference.title(), reference.url()))
                  .toList());
    } else {
      GuidedMaterial material =
          questionBank
              .findGuidedMaterial(new QuestionRevisionId(response.revisionId()))
              .orElseThrow(
                  () ->
                      new IllegalStateException(
                          "Guided revision "
                              + response.revisionId()
                              + " has no reviewed material"));
      guided =
          new GuidedOutcome(
              material.referenceAnswer(),
              material.expectedConcepts().stream()
                  .map(
                      concept ->
                          new ExpectedConceptView(
                              concept.text(), concept.required(), concept.explanation()))
                  .toList(),
              material.commonMistakes(),
              material.followUps());
    }
    return new InterviewAnswerView(
        response.position(),
        response.revisionId(),
        response.itemKind().name(),
        response.confidence().name(),
        response.elapsedMillis(),
        response.submittedAt(),
        objective,
        guided);
  }

  // ---- lifecycle -----------------------------------------------------------------------------

  @Transactional
  InterviewSessionView complete(UUID sessionId) {
    return close(sessionId, SessionStatus.COMPLETED);
  }

  @Transactional
  InterviewSessionView abandon(UUID sessionId) {
    return close(sessionId, SessionStatus.ABANDONED);
  }

  private InterviewSessionView close(UUID sessionId, SessionStatus to) {
    InterviewSession session = owned(sessionId);
    if (session.status() != SessionStatus.IN_PROGRESS) {
      // Closing twice is the same answer as closing once, so a retry is not an error.
      return view(session);
    }
    Instant now = clock.instant().truncatedTo(ChronoUnit.MICROS);
    repository.close(sessionId, to, now);
    return view(repository.find(sessionId).orElseThrow());
  }

  // ---- helpers -------------------------------------------------------------------------------

  /**
   * The session, if it belongs to the current learner. A session of another learner is reported as
   * missing rather than forbidden: whether it exists is not theirs to know.
   */
  private InterviewSession owned(UUID sessionId) {
    ActorId learner = currentActor.require();
    Instant now = clock.instant().truncatedTo(ChronoUnit.MICROS);
    repository.expireDue(learner.value(), now);
    return repository
        .find(sessionId)
        .filter(session -> session.learnerId().equals(learner.value()))
        .orElseThrow(
            () -> StudyException.notFound("interview_session_not_found", "Session not found"));
  }

  private InterviewSessionView view(InterviewSession session) {
    Set<Integer> answered = new HashSet<>(repository.answeredPositions(session.id()));
    List<InterviewItemView> items = new ArrayList<>();
    for (SnapshotItem item : repository.snapshot(session.id())) {
      PublishedQuestion question =
          questionBank
              .findInterviewSnapshotQuestion(new QuestionRevisionId(item.revisionId()))
              .orElseThrow(
                  () ->
                      new IllegalStateException(
                          "Snapshot revision " + item.revisionId() + " is no longer readable"));
      items.add(
          new InterviewItemView(
              item.position(),
              new TopicId(item.topicId()),
              question,
              answered.contains(item.position())));
    }
    items.sort(Comparator.comparingInt(InterviewItemView::position));
    return new InterviewSessionView(
        session.id(),
        session.trackVersionId(),
        session.status().name(),
        session.requestedCount(),
        session.createdAt(),
        session.expiresAt(),
        session.closedAt(),
        items);
  }

  private static void requireKey(String key) {
    if (key == null || key.isBlank()) {
      throw StudyException.invalid(
          "idempotency_key_required", "The Idempotency-Key header is required");
    }
    if (!key.matches("^[A-Za-z0-9_-]{8,64}$")) {
      throw StudyException.invalid(
          "idempotency_key_invalid",
          "The Idempotency-Key must be 8 to 64 letters, digits, hyphens or underscores");
    }
  }

  private static List<String> normalize(List<String> requested) {
    if (requested == null) {
      return List.of();
    }
    Set<String> distinct = new HashSet<>(requested);
    if (distinct.size() != requested.size()) {
      throw StudyException.invalid("duplicate_option", "An option was selected more than once");
    }
    return distinct.stream().sorted().toList();
  }

  /**
   * The marks have to be about concepts this question actually lists, or the evidence would record
   * a statement about something that does not exist.
   */
  private void validateConcepts(UUID revisionId, Map<Integer, Boolean> marks) {
    if (marks.isEmpty()) {
      return;
    }
    int concepts =
        questionBank
            .findGuidedMaterial(new QuestionRevisionId(revisionId))
            .map(material -> material.expectedConcepts().size())
            .orElse(0);
    for (Integer position : marks.keySet()) {
      if (position == null || position < 0 || position >= concepts) {
        throw StudyException.invalid(
            "unknown_expected_concept", "That expected concept is not part of this question");
      }
    }
  }

  private static void validate(RevisionEvidence evidence, List<String> selected) {
    Set<String> known = new HashSet<>();
    evidence.options().forEach(option -> known.add(option.key()));
    if (!known.containsAll(selected)) {
      throw StudyException.invalid("invalid_option", "An option does not belong to this question");
    }
    if (evidence.type() == QuestionType.SINGLE_CHOICE && selected.size() != 1) {
      throw StudyException.invalid(
          "single_choice_requires_one_option", "Select exactly one option");
    }
    if (selected.isEmpty()) {
      throw StudyException.invalid("no_option_selected", "Select at least one option");
    }
  }

  private static boolean grade(RevisionEvidence evidence, List<String> selected) {
    Set<String> correct = new HashSet<>();
    evidence.options().stream()
        .filter(RevisionEvidence.Option::correct)
        .forEach(option -> correct.add(option.key()));
    return correct.equals(new HashSet<>(selected));
  }

  private static String fingerprint(
      UUID sessionId, int position, List<String> selected, Confidence confidence, long elapsed) {
    String canonical =
        sessionId
            + "|"
            + position
            + "|"
            + String.join(",", selected)
            + "|"
            + confidence
            + "|"
            + elapsed;
    try {
      byte[] hash =
          MessageDigest.getInstance("SHA-256").digest(canonical.getBytes(StandardCharsets.UTF_8));
      return HexFormat.of().formatHex(hash);
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException("SHA-256 is required", e);
    }
  }
}
