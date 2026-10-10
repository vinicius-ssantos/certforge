package dev.certforge.study.internal;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.QuestionBank;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.questionbank.QuestionType;
import dev.certforge.questionbank.RevisionEvidence;
import dev.certforge.study.AttemptRecorded;
import dev.certforge.study.Confidence;
import dev.certforge.study.internal.AttemptViews.Answer;
import dev.certforge.study.internal.AttemptViews.AttemptResult;
import dev.certforge.study.internal.AttemptViews.OptionAnswer;
import dev.certforge.study.internal.AttemptViews.Reference;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Answer submission.
 *
 * <p>Correctness is always computed here, on the server, against the immutable revision stored in
 * the session snapshot. The answer key and explanations leave this class only inside an {@link
 * AttemptResult} built from an accepted attempt, never before.
 *
 * <p>Idempotency contract: every submission carries an {@code Idempotency-Key}, scoped to the
 * learner. The same key with the same request returns the original result without creating another
 * attempt. The same key with a different request is rejected. A new key for a question that already
 * has an attempt is rejected, so there is one accepted attempt per session question.
 */
@Service
class AttemptService {

  private static final Pattern KEY = Pattern.compile("^[A-Za-z0-9_-]{8,64}$");

  /** The learner's answer as submitted. */
  record Submission(List<String> selectedOptions, Confidence confidence, long elapsedMillis) {}

  /** The result and whether it is a replay of an earlier identical request. */
  record Outcome(AttemptResult result, boolean replayed) {}

  private final AttemptRepository attempts;
  private final StudyService sessions;
  private final QuestionBank questionBank;
  private final CurrentActor currentActor;
  private final Clock clock;
  private final ApplicationEventPublisher events;
  private final TransactionTemplate transaction;
  private final MeterRegistry metrics;
  private final ObservationRegistry observations;

  AttemptService(
      AttemptRepository attempts,
      StudyService sessions,
      QuestionBank questionBank,
      CurrentActor currentActor,
      Clock clock,
      ApplicationEventPublisher events,
      PlatformTransactionManager transactionManager,
      MeterRegistry metrics,
      ObservationRegistry observations) {
    this.attempts = attempts;
    this.sessions = sessions;
    this.questionBank = questionBank;
    this.currentActor = currentActor;
    this.clock = clock;
    this.events = events;
    this.transaction = new TransactionTemplate(transactionManager);
    this.metrics = metrics;
    this.observations = observations;
  }

  Outcome submit(UUID sessionId, int position, String key, Submission submission) {
    return Observation.createNotStarted("certforge.attempt.submit", observations)
        .observe(() -> doSubmit(sessionId, position, key, submission));
  }

  private Outcome doSubmit(UUID sessionId, int position, String key, Submission submission) {
    ActorId learner = currentActor.require();
    requireKey(key);
    List<String> selected = normalize(submission.selectedOptions());
    String fingerprint =
        fingerprint(
            sessionId, position, selected, submission.confidence(), submission.elapsedMillis());

    // A retry is answered before anything else, even if the session has since been closed.
    Optional<Attempt> earlier = attempts.findByKey(learner.value(), key);
    if (earlier.isPresent()) {
      return replay(earlier.get(), fingerprint);
    }

    StudySession session = sessions.owned(sessionId);
    if (session.status() == SessionStatus.EXPIRED) {
      throw StudyException.conflict("session_expired", "The session has expired");
    }
    if (session.status() != SessionStatus.IN_PROGRESS) {
      throw StudyException.conflict(
          "session_not_in_progress", "The session is no longer in progress");
    }
    UUID revisionId =
        attempts
            .revisionAt(sessionId, position)
            .orElseThrow(() -> StudyException.notFound("question_not_found", "Question not found"));
    Optional<Attempt> answered = attempts.findByQuestion(sessionId, position);
    if (answered.isPresent()) {
      // An identical retry can land here if the original was committed after the key lookup above.
      if (answered.get().idempotencyKey().equals(key)) {
        return replay(answered.get(), fingerprint);
      }
      throw alreadyAnswered();
    }

    RevisionEvidence evidence = evidence(revisionId);
    validate(evidence, selected);
    Attempt attempt =
        new Attempt(
            UUID.randomUUID(),
            sessionId,
            position,
            learner.value(),
            revisionId,
            selected,
            grade(evidence, selected),
            submission.confidence(),
            submission.elapsedMillis(),
            clock.instant().truncatedTo(ChronoUnit.MICROS),
            key,
            fingerprint);
    try {
      transaction.executeWithoutResult(
          status -> {
            attempts.insert(attempt);
            events.publishEvent(
                new AttemptRecorded(
                    attempt.id(),
                    learner,
                    new TopicId(session.topicId()),
                    attempt.correct(),
                    attempt.submittedAt()));
          });
    } catch (DuplicateKeyException e) {
      return resolveRace(learner, key, fingerprint, sessionId, position);
    } catch (DataAccessException e) {
      if (e.getMessage() != null && e.getMessage().contains("not in progress")) {
        throw StudyException.conflict(
            "session_not_in_progress", "The session is no longer in progress");
      }
      throw e;
    }
    metrics
        .counter(
            "certforge.attempts.submitted", "outcome", attempt.correct() ? "correct" : "incorrect")
        .increment();
    return new Outcome(result(attempt, evidence), false);
  }

  /** The accepted attempt of a question, with the answer. Not found until one is accepted. */
  AttemptResult get(UUID sessionId, int position) {
    sessions.owned(sessionId);
    Attempt attempt =
        attempts
            .findByQuestion(sessionId, position)
            .orElseThrow(() -> StudyException.notFound("attempt_not_found", "No answer yet"));
    return result(attempt, evidence(attempt.revisionId()));
  }

  // ---- idempotency ---------------------------------------------------------------------------

  private Outcome replay(Attempt earlier, String fingerprint) {
    if (!earlier.fingerprint().equals(fingerprint)) {
      throw StudyException.conflict(
          "idempotency_key_reused", "This key was already used for a different request");
    }
    metrics.counter("certforge.attempts.replayed").increment();
    return new Outcome(result(earlier, evidence(earlier.revisionId())), true);
  }

  /** A concurrent request took the same key or the same question slot; answer accordingly. */
  private Outcome resolveRace(
      ActorId learner, String key, String fingerprint, UUID sessionId, int position) {
    Optional<Attempt> byKey = attempts.findByKey(learner.value(), key);
    if (byKey.isPresent()) {
      return replay(byKey.get(), fingerprint);
    }
    if (attempts.findByQuestion(sessionId, position).isPresent()) {
      throw alreadyAnswered();
    }
    throw StudyException.conflict("concurrent_submission", "Another request is in progress");
  }

  private static StudyException alreadyAnswered() {
    return StudyException.conflict("already_answered", "This question already has an answer");
  }

  private static void requireKey(String key) {
    if (key == null || key.isBlank()) {
      throw StudyException.invalid(
          "idempotency_key_required", "The Idempotency-Key header is required");
    }
    if (!KEY.matcher(key).matches()) {
      throw StudyException.invalid(
          "idempotency_key_invalid",
          "The Idempotency-Key must be 8 to 64 letters, digits, hyphens or underscores");
    }
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

  // ---- validation and grading ----------------------------------------------------------------

  /** Sorted, distinct option keys; rejects a request that repeats a key. */
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

  /** Exact match of the selected set against the correct set. There is no partial credit. */
  private static boolean grade(RevisionEvidence evidence, List<String> selected) {
    Set<String> correct = new HashSet<>();
    evidence.options().stream()
        .filter(RevisionEvidence.Option::correct)
        .forEach(option -> correct.add(option.key()));
    return correct.equals(new HashSet<>(selected));
  }

  private RevisionEvidence evidence(UUID revisionId) {
    return questionBank
        .findRevision(new QuestionRevisionId(revisionId))
        .orElseThrow(
            () -> new IllegalStateException("Revision " + revisionId + " is no longer readable"));
  }

  private static AttemptResult result(Attempt attempt, RevisionEvidence evidence) {
    List<String> correctOptions =
        evidence.options().stream()
            .filter(RevisionEvidence.Option::correct)
            .map(RevisionEvidence.Option::key)
            .sorted()
            .toList();
    List<OptionAnswer> options =
        evidence.options().stream()
            .map(o -> new OptionAnswer(o.key(), o.text(), o.correct(), o.explanation()))
            .toList();
    List<Reference> references =
        evidence.references().stream().map(r -> new Reference(r.title(), r.url())).toList();
    return new AttemptResult(
        attempt.position(),
        attempt.revisionId(),
        attempt.selectedOptions(),
        attempt.correct(),
        attempt.confidence().name(),
        attempt.elapsedMillis(),
        attempt.submittedAt(),
        new Answer(
            correctOptions, evidence.explanation(), options, references, verificationOf(evidence)));
  }

  /**
   * The evidence behind the answer, mapped for the view. Reached only from here, which is a path
   * that has already established the learner may see answer material.
   */
  private static AttemptViews.Verification verificationOf(RevisionEvidence evidence) {
    if (evidence.verification() == null) {
      return null;
    }
    return new AttemptViews.Verification(
        evidence.verification().files().stream()
            .map(file -> new AttemptViews.SourceFile(file.path(), file.body()))
            .toList(),
        evidence.verification().output());
  }
}
