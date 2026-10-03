package dev.certforge.study.internal;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.PreparationTrackId;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.preparationcatalog.TrackView;
import dev.certforge.questionbank.PublishedQuestion;
import dev.certforge.questionbank.QuestionBank;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.questionbank.QuestionType;
import dev.certforge.questionbank.RevisionEvidence;
import dev.certforge.study.internal.MockExamRepository.SnapshotQuestion;
import dev.certforge.study.internal.MockExamViews.Answer;
import dev.certforge.study.internal.MockExamViews.MockExamQuestionView;
import dev.certforge.study.internal.MockExamViews.MockExamResult;
import dev.certforge.study.internal.MockExamViews.MockExamView;
import dev.certforge.study.internal.MockExamViews.OptionAnswer;
import dev.certforge.study.internal.MockExamViews.QuestionResult;
import dev.certforge.study.internal.MockExamViews.Reference;
import dev.certforge.study.internal.MockExamViews.ResponseReceipt;
import dev.certforge.study.internal.MockExamViews.TopicResult;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Timed mock-exam lifecycle.
 *
 * <p>Active views and response receipts never contain correctness, explanations or references.
 * Those fields are assembled only by {@link #result(UUID)} after the run is terminal.
 */
@Service
class MockExamService {

  private static final Pattern IDEMPOTENCY_KEY = Pattern.compile("^[A-Za-z0-9_-]{8,64}$");

  record ResponseOutcome(ResponseReceipt receipt, boolean replayed) {}

  private final MockExamRepository repository;
  private final MockExamPlanner planner;
  private final PreparationCatalog catalog;
  private final QuestionBank questionBank;
  private final CurrentActor currentActor;
  private final Clock clock;
  private final TransactionTemplate transaction;

  MockExamService(
      MockExamRepository repository,
      MockExamPlanner planner,
      PreparationCatalog catalog,
      QuestionBank questionBank,
      CurrentActor currentActor,
      Clock clock,
      PlatformTransactionManager transactionManager) {
    this.repository = repository;
    this.planner = planner;
    this.catalog = catalog;
    this.questionBank = questionBank;
    this.currentActor = currentActor;
    this.clock = clock;
    this.transaction = new TransactionTemplate(transactionManager);
  }

  MockExamView start(String trackSlug) {
    ActorId learner = currentActor.require();
    Instant now = now();
    repository.expireDue(learner.value(), now);

    TrackView track =
        catalog
            .activeTrack(trackSlug)
            .orElseThrow(() -> StudyException.notFound("track_not_found", "Track not found"));
    Optional<MockExamSession> active =
        repository.findActive(learner.value(), track.id().value());
    if (active.isPresent()) {
      throw activeMockExists(active.get());
    }

    MockExamPlanner.Plan plan = planner.plan(trackSlug);
    MockExamBlueprint blueprint = plan.blueprint();
    MockExamSession session =
        new MockExamSession(
            UUID.randomUUID(),
            learner.value(),
            plan.trackId().value(),
            plan.examVersionId().value(),
            MockExamStatus.IN_PROGRESS,
            blueprint.questionCount(),
            blueprint.timeLimit().toSeconds(),
            blueprint.passingPercentage(),
            blueprint.questionsPerTopic(),
            now,
            now.plus(blueprint.timeLimit()),
            null);

    List<SnapshotQuestion> snapshot = new ArrayList<>(plan.questions().size());
    for (int position = 0; position < plan.questions().size(); position++) {
      MockExamPlanner.PlannedQuestion planned = plan.questions().get(position);
      snapshot.add(
          new SnapshotQuestion(
              position,
              planned.topicId().value(),
              planned.question().revisionId().value()));
    }

    try {
      transaction.executeWithoutResult(status -> repository.insert(session, snapshot));
    } catch (DuplicateKeyException e) {
      throw repository
          .findActive(learner.value(), track.id().value())
          .map(MockExamService::activeMockExists)
          .orElse(
              StudyException.conflict(
                  "active_mock_exam_exists", "A mock exam is already in progress"));
    }
    return view(session, plan.questions().stream().map(MockExamPlanner.PlannedQuestion::question).toList());
  }

  MockExamView get(UUID sessionId) {
    MockExamSession session = owned(sessionId);
    return view(session, snapshotQuestions(session));
  }

  ResponseOutcome respond(
      UUID sessionId, int position, String key, List<String> requestedOptions) {
    ActorId learner = currentActor.require();
    requireKey(key);
    List<String> selected = normalize(requestedOptions);
    String fingerprint = fingerprint(sessionId, position, selected);

    Optional<MockExamResponse> earlier = repository.findResponseByKey(learner.value(), key);
    if (earlier.isPresent()) {
      return replay(earlier.get(), fingerprint);
    }

    MockExamSession session = owned(sessionId);
    requireInProgress(session);
    SnapshotQuestion snapshot =
        repository
            .snapshotAt(sessionId, position)
            .orElseThrow(
                () -> StudyException.notFound("question_not_found", "Question not found"));
    RevisionEvidence evidence = evidence(snapshot.revisionId());
    validate(evidence, selected);

    MockExamResponse response =
        new MockExamResponse(
            UUID.randomUUID(),
            sessionId,
            position,
            learner.value(),
            snapshot.revisionId(),
            selected,
            now(),
            key,
            fingerprint);
    try {
      repository.insertResponse(response);
    } catch (DuplicateKeyException e) {
      return resolveResponseRace(learner, key, fingerprint, sessionId, position);
    } catch (DataAccessException e) {
      String message = e.getMessage();
      if (message != null && message.contains("has expired")) {
        expire(sessionId);
        throw StudyException.conflict("mock_exam_expired", "The mock exam has expired");
      }
      if (message != null && message.contains("not in progress")) {
        throw StudyException.conflict(
            "mock_exam_not_in_progress", "The mock exam is no longer in progress");
      }
      throw e;
    }
    return new ResponseOutcome(receipt(response), false);
  }

  MockExamView finish(UUID sessionId) {
    MockExamSession session = owned(sessionId);
    if (session.status() == MockExamStatus.EXPIRED) {
      throw StudyException.conflict("mock_exam_expired", "The mock exam has expired");
    }
    requireInProgress(session);
    if (!repository.close(sessionId, MockExamStatus.COMPLETED, now())) {
      throw StudyException.conflict(
          "mock_exam_not_in_progress", "The mock exam is no longer in progress");
    }
    MockExamSession closed = repository.find(sessionId).orElseThrow();
    return view(closed, snapshotQuestions(closed));
  }

  MockExamResult result(UUID sessionId) {
    MockExamSession session = owned(sessionId);
    if (session.status() == MockExamStatus.IN_PROGRESS) {
      throw StudyException.conflict(
          "mock_exam_in_progress", "Finish the mock exam before viewing the result");
    }

    List<SnapshotQuestion> snapshot = repository.snapshot(sessionId);
    Map<Integer, MockExamResponse> responses = new HashMap<>();
    repository.responses(sessionId).forEach(response -> responses.put(response.position(), response));

    int correct = 0;
    List<QuestionResult> questions = new ArrayList<>(snapshot.size());
    Map<UUID, TopicAccumulator> perTopic = new LinkedHashMap<>();

    for (SnapshotQuestion item : snapshot) {
      PublishedQuestion question = snapshotQuestion(item.revisionId());
      RevisionEvidence evidence = evidence(item.revisionId());
      MockExamResponse response = responses.get(item.position());
      List<String> selected = response == null ? List.of() : response.selectedOptions();
      boolean answered = response != null;
      boolean isCorrect = answered && grade(evidence, selected);
      if (isCorrect) {
        correct++;
      }

      TopicAccumulator topic =
          perTopic.computeIfAbsent(item.topicId(), ignored -> new TopicAccumulator());
      topic.total++;
      if (answered) {
        topic.answered++;
      }
      if (isCorrect) {
        topic.correct++;
      }

      questions.add(
          new QuestionResult(
              item.position(),
              new TopicId(item.topicId()),
              question,
              selected,
              answered,
              isCorrect,
              answer(evidence)));
    }

    int total = session.questionCount();
    int answered = responses.size();
    int percentage = percentage(correct, total);
    int passingCorrectCount =
        (total * session.passingPercentage() + 99) / 100;
    List<TopicResult> topics =
        perTopic.entrySet().stream()
            .map(
                entry ->
                    new TopicResult(
                        new TopicId(entry.getKey()),
                        entry.getValue().total,
                        entry.getValue().answered,
                        entry.getValue().correct,
                        percentage(entry.getValue().correct, entry.getValue().total)))
            .toList();

    Instant effectiveClose =
        session.closedAt().isAfter(session.expiresAt()) ? session.expiresAt() : session.closedAt();
    long elapsedSeconds =
        Math.max(0, Duration.between(session.createdAt(), effectiveClose).toSeconds());

    return new MockExamResult(
        session.id(),
        new PreparationTrackId(session.trackId()),
        session.status().name(),
        total,
        answered,
        correct,
        percentage,
        session.passingPercentage(),
        passingCorrectCount,
        correct >= passingCorrectCount,
        elapsedSeconds,
        topics,
        questions);
  }

  private MockExamSession owned(UUID sessionId) {
    ActorId learner = currentActor.require();
    MockExamSession session =
        repository
            .find(sessionId)
            .filter(found -> found.learnerId().equals(learner.value()))
            .orElseThrow(
                () -> StudyException.notFound("mock_exam_not_found", "Mock exam not found"));
    if (session.status() == MockExamStatus.IN_PROGRESS
        && !session.expiresAt().isAfter(clock.instant())) {
      repository.close(sessionId, MockExamStatus.EXPIRED, now());
      return repository.find(sessionId).orElseThrow();
    }
    return session;
  }

  private void expire(UUID sessionId) {
    repository.close(sessionId, MockExamStatus.EXPIRED, now());
  }

  private static StudyException activeMockExists(MockExamSession session) {
    return StudyException.conflict(
        "active_mock_exam_exists",
        "A mock exam for this track is already in progress",
        Map.of("sessionId", session.id()));
  }

  private static void requireInProgress(MockExamSession session) {
    if (session.status() == MockExamStatus.EXPIRED) {
      throw StudyException.conflict("mock_exam_expired", "The mock exam has expired");
    }
    if (session.status() != MockExamStatus.IN_PROGRESS) {
      throw StudyException.conflict(
          "mock_exam_not_in_progress", "The mock exam is no longer in progress");
    }
  }

  private MockExamView view(MockExamSession session, List<PublishedQuestion> questions) {
    Set<Integer> answered = new HashSet<>(repository.answeredPositions(session.id()));
    List<SnapshotQuestion> snapshot = repository.snapshot(session.id());
    if (snapshot.size() != questions.size()) {
      throw new IllegalStateException("Mock exam snapshot and question views disagree");
    }

    List<MockExamQuestionView> views = new ArrayList<>(questions.size());
    for (int position = 0; position < questions.size(); position++) {
      SnapshotQuestion item = snapshot.get(position);
      views.add(
          new MockExamQuestionView(
              position,
              new TopicId(item.topicId()),
              questions.get(position),
              answered.contains(position)));
    }

    return new MockExamView(
        session.id(),
        new PreparationTrackId(session.trackId()),
        session.status().name(),
        session.questionCount(),
        answered.size(),
        session.passingPercentage(),
        session.createdAt(),
        session.expiresAt(),
        session.closedAt(),
        views);
  }

  private List<PublishedQuestion> snapshotQuestions(MockExamSession session) {
    List<PublishedQuestion> questions = new ArrayList<>();
    for (SnapshotQuestion item : repository.snapshot(session.id())) {
      questions.add(snapshotQuestion(item.revisionId()));
    }
    return questions;
  }

  private PublishedQuestion snapshotQuestion(UUID revisionId) {
    return questionBank
        .findSnapshotQuestion(new QuestionRevisionId(revisionId))
        .orElseThrow(
            () ->
                new IllegalStateException(
                    "Snapshot revision " + revisionId + " is no longer readable"));
  }

  private RevisionEvidence evidence(UUID revisionId) {
    return questionBank
        .findRevision(new QuestionRevisionId(revisionId))
        .orElseThrow(
            () ->
                new IllegalStateException("Revision " + revisionId + " is no longer readable"));
  }

  private ResponseOutcome replay(MockExamResponse earlier, String fingerprint) {
    if (!earlier.fingerprint().equals(fingerprint)) {
      throw StudyException.conflict(
          "idempotency_key_reused", "This key was already used for a different request");
    }
    return new ResponseOutcome(receipt(earlier), true);
  }

  private ResponseOutcome resolveResponseRace(
      ActorId learner, String key, String fingerprint, UUID sessionId, int position) {
    Optional<MockExamResponse> byKey = repository.findResponseByKey(learner.value(), key);
    if (byKey.isPresent()) {
      return replay(byKey.get(), fingerprint);
    }
    if (repository.findResponse(sessionId, position).isPresent()) {
      throw StudyException.conflict("already_answered", "This question already has an answer");
    }
    throw StudyException.conflict("concurrent_submission", "Another request is in progress");
  }

  private static ResponseReceipt receipt(MockExamResponse response) {
    return new ResponseReceipt(
        response.position(),
        response.revisionId(),
        response.selectedOptions(),
        response.submittedAt());
  }

  private static List<String> normalize(List<String> requested) {
    Set<String> distinct = new HashSet<>(requested);
    if (distinct.size() != requested.size()) {
      throw StudyException.invalid("duplicate_option", "An option was selected more than once");
    }
    return distinct.stream().sorted().toList();
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
  }

  private static boolean grade(RevisionEvidence evidence, List<String> selected) {
    Set<String> correct = new HashSet<>();
    evidence.options().stream()
        .filter(RevisionEvidence.Option::correct)
        .forEach(option -> correct.add(option.key()));
    return correct.equals(new HashSet<>(selected));
  }

  private static Answer answer(RevisionEvidence evidence) {
    List<String> correctOptions =
        evidence.options().stream()
            .filter(RevisionEvidence.Option::correct)
            .map(RevisionEvidence.Option::key)
            .sorted()
            .toList();
    List<OptionAnswer> options =
        evidence.options().stream()
            .map(
                option ->
                    new OptionAnswer(
                        option.key(),
                        option.text(),
                        option.correct(),
                        option.explanation()))
            .toList();
    List<Reference> references =
        evidence.references().stream()
            .map(reference -> new Reference(reference.title(), reference.url()))
            .toList();
    return new Answer(correctOptions, evidence.explanation(), options, references);
  }

  private static int percentage(int correct, int total) {
    return total == 0 ? 0 : (correct * 100) / total;
  }

  private static void requireKey(String key) {
    if (key == null || key.isBlank()) {
      throw StudyException.invalid(
          "idempotency_key_required", "The Idempotency-Key header is required");
    }
    if (!IDEMPOTENCY_KEY.matcher(key).matches()) {
      throw StudyException.invalid(
          "idempotency_key_invalid",
          "The Idempotency-Key must be 8 to 64 letters, digits, hyphens or underscores");
    }
  }

  private static String fingerprint(UUID sessionId, int position, List<String> selected) {
    String canonical = sessionId + "|" + position + "|" + String.join(",", selected);
    try {
      byte[] hash =
          MessageDigest.getInstance("SHA-256")
              .digest(canonical.getBytes(StandardCharsets.UTF_8));
      return HexFormat.of().formatHex(hash);
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException("SHA-256 is required", e);
    }
  }

  private Instant now() {
    return clock.instant().truncatedTo(ChronoUnit.MICROS);
  }

  private static final class TopicAccumulator {
    private int total;
    private int answered;
    private int correct;
  }
}
