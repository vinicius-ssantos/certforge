package dev.certforge.questionbank.internal;

import dev.certforge.audit.AuditFact;
import dev.certforge.identity.AccountNames;
import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.TopicContext;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.RevisionStatus;
import dev.certforge.questionbank.internal.AdminQuestionViews.OptionView;
import dev.certforge.questionbank.internal.AdminQuestionViews.QuestionSummary;
import dev.certforge.questionbank.internal.AdminQuestionViews.QuestionView;
import dev.certforge.questionbank.internal.AdminQuestionViews.ReferenceView;
import dev.certforge.questionbank.internal.AdminQuestionViews.ReviewView;
import dev.certforge.questionbank.internal.AdminQuestionViews.RevisionView;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;
import java.time.Clock;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Editorial commands. Every rule that protects published content lives here (and, for immutability,
 * also in database triggers) so it holds regardless of the caller. Approval, publication,
 * replacement and deprecation emit {@link AuditFact}s as in-process events.
 */
@Service
class QuestionBankService {

  static final String ACTION_APPROVED = "QUESTION_REVISION_APPROVED";
  static final String ACTION_PUBLISHED = "QUESTION_REVISION_PUBLISHED";
  static final String ACTION_REPLACED = "QUESTION_REVISION_REPLACED";
  static final String ACTION_DEPRECATED = "QUESTION_REVISION_DEPRECATED";
  private static final String TRANSITIONS = "certforge.editorial.transitions";
  private static final String ACTION = "action";

  private final QuestionRepository repository;
  private final PreparationCatalog catalog;
  private final CurrentActor currentActor;
  private final AccountNames accountNames;
  private final Clock clock;
  private final ApplicationEventPublisher events;
  private final QuestionBankProperties properties;
  private final MeterRegistry metrics;
  private final ObservationRegistry observations;

  QuestionBankService(
      QuestionRepository repository,
      PreparationCatalog catalog,
      CurrentActor currentActor,
      AccountNames accountNames,
      Clock clock,
      ApplicationEventPublisher events,
      QuestionBankProperties properties,
      MeterRegistry metrics,
      ObservationRegistry observations) {
    this.repository = repository;
    this.catalog = catalog;
    this.currentActor = currentActor;
    this.accountNames = accountNames;
    this.clock = clock;
    this.events = events;
    this.properties = properties;
    this.metrics = metrics;
    this.observations = observations;
  }

  // ---- reads ---------------------------------------------------------------------------------

  @Transactional(readOnly = true)
  List<QuestionSummary> list(RevisionStatus status) {
    return repository.summaries(status);
  }

  @Transactional(readOnly = true)
  QuestionView get(UUID questionId) {
    UUID creator =
        repository
            .findQuestionCreator(questionId)
            .orElseThrow(() -> QuestionBankException.notFound("question_not_found", "Not found"));
    return new QuestionView(
        questionId,
        creator,
        repository.findRevisions(questionId).stream().map(this::view).toList());
  }

  // ---- authoring -----------------------------------------------------------------------------

  /** Creates a question with its first DRAFT revision. */
  @Transactional
  QuestionView create(RevisionContent content) {
    ActorId actor = currentActor.require();
    UUID questionId = UUID.randomUUID();
    repository.insertQuestion(questionId, actor.value());
    repository.insertRevision(UUID.randomUUID(), questionId, 1, actor.value(), content);
    return transitioned("created", questionId);
  }

  /** Starts a correction: a new DRAFT revision copied from the latest revision. */
  @Transactional
  QuestionView newRevision(UUID questionId) {
    ActorId actor = currentActor.require();
    if (repository.findQuestionCreator(questionId).isEmpty()) {
      throw QuestionBankException.notFound("question_not_found", "Question not found");
    }
    if (repository.hasOpenRevision(questionId)) {
      throw QuestionBankException.conflict(
          "open_revision_exists", "Finish or publish the open revision first");
    }
    int latest = repository.latestRevisionNumber(questionId);
    RevisionContent base = repository.findRevisions(questionId).get(latest - 1).content();
    repository.insertRevision(UUID.randomUUID(), questionId, latest + 1, actor.value(), base);
    return transitioned("revision_started", questionId);
  }

  @Transactional
  QuestionView edit(UUID revisionId, RevisionContent content) {
    Revision revision = revision(revisionId);
    requireAuthor(revision);
    requireStatus(revision, RevisionStatus.DRAFT, "revision_not_editable");
    repository.updateContent(revisionId, content);
    return get(revision.questionId());
  }

  /** Moves a complete DRAFT into technical review. */
  @Transactional
  QuestionView submit(UUID revisionId) {
    Revision revision = revision(revisionId);
    requireAuthor(revision);
    requireStatus(revision, RevisionStatus.DRAFT, "revision_not_draft");
    requireComplete(revision);
    repository.markSubmitted(revisionId, clock.instant());
    return transitioned("submitted", revision.questionId());
  }

  // ---- review --------------------------------------------------------------------------------

  @Transactional
  QuestionView approve(UUID revisionId, String comment, List<String> checklist) {
    List<String> ticked = ReviewChecklist.validate(checklist);
    ActorId actor = currentActor.require();
    Revision revision = revision(revisionId);
    requireStatus(revision, RevisionStatus.TECHNICAL_REVIEW, "revision_not_in_review");
    requireSeparation(actor, revision);
    Instant now = clock.instant();
    repository.insertReview(revisionId, actor.value(), "APPROVED", comment, ticked, now);
    repository.setStatus(revisionId, RevisionStatus.APPROVED);
    audit(actor, ACTION_APPROVED, revisionId, now);
    return transitioned("approved", revision.questionId());
  }

  @Transactional
  QuestionView requestChanges(UUID revisionId, String comment, List<String> checklist) {
    List<String> ticked = ReviewChecklist.validate(checklist);
    ActorId actor = currentActor.require();
    Revision revision = revision(revisionId);
    requireStatus(revision, RevisionStatus.TECHNICAL_REVIEW, "revision_not_in_review");
    requireSeparation(actor, revision);
    repository.insertReview(
        revisionId, actor.value(), "CHANGES_REQUESTED", comment, ticked, clock.instant());
    repository.setStatus(revisionId, RevisionStatus.DRAFT);
    return transitioned("changes_requested", revision.questionId());
  }

  // ---- publication ---------------------------------------------------------------------------

  /**
   * Publishes an APPROVED revision and deprecates the revision it replaces, atomically. The
   * revision is bound to the certification context of its topic at this moment.
   */
  @Transactional
  QuestionView publish(UUID revisionId) {
    return Observation.createNotStarted("certforge.editorial.publish", observations)
        .observe(() -> doPublish(revisionId));
  }

  private QuestionView doPublish(UUID revisionId) {
    ActorId actor = currentActor.require();
    Revision revision = revision(revisionId);
    requireStatus(revision, RevisionStatus.APPROVED, "revision_not_approved");
    requireComplete(revision);
    TopicContext context =
        catalog
            .findActiveTopicContext(new TopicId(revision.content().topicId()))
            .orElseThrow(
                () ->
                    QuestionBankException.conflict(
                        "topic_not_active", "The topic is not part of an active exam version"));
    if (revision.content().javaRelease() != context.javaRelease()) {
      throw QuestionBankException.conflict(
          "java_release_mismatch", "The revision targets a different Java release than the exam");
    }
    Instant now = clock.instant();
    repository
        .findPublishedForContext(revision.questionId(), context.examVersionId().value())
        .ifPresent(
            previous -> {
              repository.markDeprecated(previous.id(), now);
              audit(actor, ACTION_REPLACED, previous.id(), now);
              metrics.counter(TRANSITIONS, ACTION, "replaced").increment();
            });
    repository.markPublished(revisionId, context.examVersionId().value(), actor.value(), now);
    audit(actor, ACTION_PUBLISHED, revisionId, now);
    return transitioned("published", revision.questionId());
  }

  @Transactional
  QuestionView deprecate(UUID revisionId) {
    ActorId actor = currentActor.require();
    Revision revision = revision(revisionId);
    requireStatus(revision, RevisionStatus.PUBLISHED, "revision_not_published");
    Instant now = clock.instant();
    repository.markDeprecated(revisionId, now);
    audit(actor, ACTION_DEPRECATED, revisionId, now);
    return transitioned("deprecated", revision.questionId());
  }

  // ---- internals -----------------------------------------------------------------------------

  /** Counts an accepted transition and returns the updated editorial view. */
  private QuestionView transitioned(String action, UUID questionId) {
    metrics.counter(TRANSITIONS, ACTION, action).increment();
    return get(questionId);
  }

  private Revision revision(UUID id) {
    return repository
        .findRevision(id)
        .orElseThrow(() -> QuestionBankException.notFound("revision_not_found", "Not found"));
  }

  private void requireAuthor(Revision revision) {
    if (!revision.authorId().equals(currentActor.require().value())) {
      throw QuestionBankException.forbidden(
          "not_revision_author", "Only the author of a revision can change or submit it");
    }
  }

  private void requireSeparation(ActorId reviewer, Revision revision) {
    if (properties.requireReviewerSeparation() && revision.authorId().equals(reviewer.value())) {
      throw QuestionBankException.forbidden(
          "reviewer_must_differ_from_author", "A revision cannot be reviewed by its author");
    }
  }

  private static void requireStatus(Revision revision, RevisionStatus expected, String code) {
    if (revision.status() != expected) {
      throw QuestionBankException.conflict(
          code, "The revision is " + revision.status() + ", expected " + expected);
    }
  }

  private static void requireComplete(Revision revision) {
    List<String> violations = RevisionRules.violations(revision.content());
    if (!violations.isEmpty()) {
      throw QuestionBankException.incomplete(violations);
    }
  }

  private void audit(ActorId actor, String action, UUID revisionId, Instant at) {
    events.publishEvent(new AuditFact(actor, action, "question-revision:" + revisionId, at));
  }

  private RevisionView view(Revision r) {
    RevisionContent c = r.content();
    List<Review> reviews = repository.findReviews(r.id());
    List<UUID> people = new ArrayList<>();
    people.add(r.authorId());
    if (r.publishedBy() != null) {
      people.add(r.publishedBy());
    }
    reviews.forEach(review -> people.add(review.reviewerId()));
    Map<UUID, String> names = accountNames.of(people);
    return new RevisionView(
        r.id(),
        r.number(),
        r.status().name(),
        c.type().name(),
        c.topicId(),
        c.javaRelease(),
        c.difficulty() == null ? null : c.difficulty().name(),
        c.difficultyRationale(),
        c.prompt(),
        c.explanation(),
        c.options().stream()
            .map(o -> new OptionView(o.key(), o.text(), o.correct(), o.explanation()))
            .toList(),
        c.references().stream().map(ref -> new ReferenceView(ref.title(), ref.url())).toList(),
        r.authorId(),
        names.get(r.authorId()),
        r.examVersionId(),
        r.createdAt(),
        r.submittedAt(),
        r.publishedAt(),
        r.publishedBy(),
        r.publishedBy() == null ? null : names.get(r.publishedBy()),
        r.deprecatedAt(),
        reviews.stream()
            .map(
                review ->
                    new ReviewView(
                        review.reviewerId(),
                        names.get(review.reviewerId()),
                        review.decision(),
                        review.comment(),
                        review.checklist(),
                        review.decidedAt()))
            .toList());
  }
}
