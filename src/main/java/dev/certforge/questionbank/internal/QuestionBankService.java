package dev.certforge.questionbank.internal;

import dev.certforge.audit.AuditFact;
import dev.certforge.identity.AccountNames;
import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.identity.Permission;
import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.TopicContext;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.preparationcatalog.TopicView;
import dev.certforge.preparationcatalog.TrackKind;
import dev.certforge.questionbank.RevisionStatus;
import dev.certforge.questionbank.internal.AdminQuestionViews.ExpectedConceptView;
import dev.certforge.questionbank.internal.AdminQuestionViews.GuidedResponseView;
import dev.certforge.questionbank.internal.AdminQuestionViews.OptionView;
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
import java.util.Objects;
import java.util.Set;
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
  static final String ACTION_AI_APPROVED = "QUESTION_REVISION_AI_APPROVED";
  static final String ACTION_AI_REVIEW_CONFIRMED = "QUESTION_REVISION_AI_REVIEW_CONFIRMED";
  static final String ACTION_PUBLISHED = "QUESTION_REVISION_PUBLISHED";
  static final String ACTION_REPLACED = "QUESTION_REVISION_REPLACED";
  static final String ACTION_DEPRECATED = "QUESTION_REVISION_DEPRECATED";
  private static final String TRANSITIONS = "certforge.editorial.transitions";
  private static final String ACTION = "action";

  private final QuestionRepository repository;
  private final PreparationCatalog catalog;
  private final QuestionBankReadService readService;
  private final CurrentActor currentActor;
  private final AccountNames accountNames;
  private final Clock clock;
  private final ApplicationEventPublisher events;
  private final MeterRegistry metrics;
  private final ObservationRegistry observations;
  private final QuestionBankProperties properties;

  QuestionBankService(
      QuestionRepository repository,
      PreparationCatalog catalog,
      QuestionBankReadService readService,
      CurrentActor currentActor,
      AccountNames accountNames,
      Clock clock,
      ApplicationEventPublisher events,
      MeterRegistry metrics,
      ObservationRegistry observations,
      QuestionBankProperties properties) {
    this.repository = repository;
    this.catalog = catalog;
    this.readService = readService;
    this.currentActor = currentActor;
    this.accountNames = accountNames;
    this.clock = clock;
    this.events = events;
    this.metrics = metrics;
    this.observations = observations;
    this.properties = properties;
  }

  // ---- reads ---------------------------------------------------------------------------------

  @Transactional(readOnly = true)
  /**
   * One page of the queue plus the counts its tabs show. Both come from the same request, so the
   * tabs cannot disagree with the list beneath them, and neither costs the browser the whole bank.
   */
  AdminQuestionViews.QuestionPage list(RevisionStatus status, String search, int page, int size) {
    String trimmed = search == null || search.isBlank() ? null : search.trim();
    return new AdminQuestionViews.QuestionPage(
        repository.statusCounts(trimmed),
        repository.summaries(status, trimmed, page, size),
        page,
        size,
        repository.countSummaries(status, trimmed));
  }

  /**
   * How ready each topic is, for a reviewer deciding what to read first. A topic with two published
   * questions is further from a startable mock than one with five, and the queue's own order knows
   * nothing about that: it is alphabetical, which is an order about names.
   *
   * <p>`published` is counted by asking {@code eligibleForTopic}, the method the mock planner asks.
   * Counting published revisions here with a second query would be the same number until the day
   * one of them learned a rule the other did not — the guided-response exclusion is already such a
   * rule.
   */
  @Transactional(readOnly = true)
  List<AdminQuestionViews.TopicCoverage> coverage() {
    Map<UUID, Integer> waiting = repository.waitingByTopic();
    return catalog.activeTracks().stream()
        .flatMap(track -> track.topics().stream())
        .map(TopicView::id)
        .distinct()
        .map(
            topic ->
                new AdminQuestionViews.TopicCoverage(
                    topic.value(),
                    readService.eligibleForTopic(topic).size(),
                    waiting.getOrDefault(topic.value(), 0)))
        .toList();
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

  /**
   * The AI-reviewer fast lane (ADR 0022, widened to every tier by ADR 0024): approves a revision
   * and publishes it in the same step, recorded as {@code AI_APPROVED} rather than {@code APPROVED}
   * so nothing downstream can read it as an independent human decision. {@code checklist} is the
   * same policy checklist {@link #approve} records, because a Verified-tier approval now asks the
   * AI reviewer for exactly the judgement a compiler cannot supply (ADR 0024 decision 2); it was
   * not needed while the fast lane only reached Asserted content. {@link #confirmAiReview} is how a
   * {@code CONTENT_REVIEW} account makes it permanent within the window; until then, {@link
   * QuestionBankReadService} derives its lapse from this one review, with no stored deadline.
   */
  @Transactional
  QuestionView aiApprove(UUID revisionId, String comment, List<String> checklist) {
    List<String> ticked = ReviewChecklist.validate(checklist);
    ActorId actor = currentActor.require();
    Revision revision = revision(revisionId);
    requireStatus(revision, RevisionStatus.TECHNICAL_REVIEW, "revision_not_in_review");
    requireSeparation(actor, revision);
    Instant now = clock.instant();
    repository.insertReview(revisionId, actor.value(), "AI_APPROVED", comment, ticked, now);
    repository.setStatus(revisionId, RevisionStatus.APPROVED);
    audit(actor, ACTION_AI_APPROVED, revisionId, now);
    doPublish(revisionId);
    return transitioned("ai_approved", revision.questionId());
  }

  /**
   * Records the independent human check that turns an {@code AI_APPROVED} publication permanent
   * (ADR 0022). The revision stays {@code PUBLISHED}; this adds a review, it does not change
   * status. Confirming after the window has already lapsed the revision out of new selection is
   * still accepted: the content did not change, only whether it was being offered to a new learner.
   */
  @Transactional
  QuestionView confirmAiReview(UUID revisionId, String comment, List<String> checklist) {
    List<String> ticked = ReviewChecklist.validate(checklist);
    ActorId actor = currentActor.require();
    Revision revision = revision(revisionId);
    requireStatus(revision, RevisionStatus.PUBLISHED, "revision_not_published");
    requireSeparation(actor, revision);
    if (!AiReview.pending(repository.findReviews(revisionId))) {
      throw QuestionBankException.conflict(
          "no_pending_ai_review", "This revision has no unconfirmed AI approval to confirm");
    }
    Instant now = clock.instant();
    repository.insertReview(revisionId, actor.value(), "AI_REVIEW_CONFIRMED", comment, ticked, now);
    audit(actor, ACTION_AI_REVIEW_CONFIRMED, revisionId, now);
    return transitioned("ai_review_confirmed", revision.questionId());
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
                        "topic_not_active", "The topic is not part of an active track version"));
    // Only a certification context has a release to agree with. An interview version has no exam,
    // so there is nothing to match and the revision carries no release to match it with.
    Integer required = context.javaRelease().orElse(null);
    if (!Objects.equals(revision.content().javaRelease(), required)) {
      throw QuestionBankException.conflict(
          "java_release_mismatch", "The revision targets a different Java release than the exam");
    }
    // A claimed objective becomes a claim to a learner here, so here is where it has to be true.
    // The keys are free text while the question is a draft — the exam's objectives may not have
    // been read yet, and often the topic is not even mapped — and publishing is the first moment
    // the exam is known. A key the verified snapshot does not list is refused rather than
    // published: a question claiming an objective nobody has read is the claim ADR 0017 forbids.
    List<String> claimed = revision.content().objectiveKeys();
    if (!claimed.isEmpty()) {
      Set<String> verified = catalog.verifiedObjectiveKeys(context.trackVersionId());
      List<String> unknown =
          claimed.stream().filter(key -> !verified.contains(key)).sorted().toList();
      if (!unknown.isEmpty()) {
        throw QuestionBankException.conflict(
            "objective_not_verified",
            "The exam has no verified objective "
                + String.join(", ", unknown)
                + (verified.isEmpty() ? "; nobody has read its objectives page yet" : ""));
      }
    }
    Instant now = clock.instant();
    repository
        .findPublishedForContext(revision.questionId(), context.trackVersionId().value())
        .ifPresent(
            previous -> {
              repository.markDeprecated(previous.id(), now);
              audit(actor, ACTION_REPLACED, previous.id(), now);
              metrics.counter(TRANSITIONS, ACTION, "replaced").increment();
            });
    repository.markPublished(revisionId, context.trackVersionId().value(), actor.value(), now);
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

  /**
   * Who may decide on a revision they wrote. Everyone needs someone else to check their work,
   * except the account that holds {@link Permission#CONTENT_SELF_REVIEW} — the one whose judgement
   * is final because there is nobody above it. That is a narrower rule than the deployment-wide
   * switch it replaces, which let *any* author approve their own work; an author added to this
   * project still cannot.
   *
   * <p>A self-review is accepted, never disguised: the decision records the reviewer, and a
   * reviewer equal to the author is what the editorial desk reads to call it a self-review. Nothing
   * here claims a second pair of eyes that was not there (ADR 0005).
   */
  private void requireSeparation(ActorId reviewer, Revision revision) {
    if (revision.authorId().equals(reviewer.value())
        && !currentActor.has(Permission.CONTENT_SELF_REVIEW)) {
      throw QuestionBankException.forbidden(
          "reviewer_must_differ_from_author",
          "A revision has to be reviewed by someone other than its author");
    }
  }

  private static void requireStatus(Revision revision, RevisionStatus expected, String code) {
    if (revision.status() != expected) {
      throw QuestionBankException.conflict(
          code, "The revision is " + revision.status() + ", expected " + expected);
    }
  }

  private void requireComplete(Revision revision) {
    List<String> violations = RevisionRules.violations(revision.content(), kindOf(revision));
    if (!violations.isEmpty()) {
      throw QuestionBankException.incomplete(violations);
    }
  }

  /**
   * The kind of preparation the revision's topic belongs to, or null when there is no topic yet or
   * it names one that does not exist. Null is reported as a missing topic by the rules themselves,
   * so it needs no separate error here.
   */
  private TrackKind kindOf(Revision revision) {
    UUID topicId = revision.content().topicId();
    return topicId == null ? null : catalog.findTrackKindOfTopic(new TopicId(topicId)).orElse(null);
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
        c.seniority() == null ? null : c.seniority().name(),
        c.difficulty() == null ? null : c.difficulty().name(),
        c.difficultyRationale(),
        c.prompt(),
        c.explanation(),
        c.options().stream()
            .map(o -> new OptionView(o.key(), o.text(), o.correct(), o.explanation()))
            .toList(),
        c.guidedResponse() == null
            ? null
            : new GuidedResponseView(
                c.guidedResponse().referenceAnswer(),
                c.guidedResponse().expectedConcepts().stream()
                    .map(
                        concept ->
                            new ExpectedConceptView(
                                concept.text(), concept.required(), concept.explanation()))
                    .toList(),
                c.guidedResponse().commonMistakes(),
                c.guidedResponse().followUps()),
        c.references().stream().map(ref -> new ReferenceView(ref.title(), ref.url())).toList(),
        c.objectiveKeys(),
        r.authorId(),
        names.get(r.authorId()),
        r.trackVersionId(),
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
            .toList(),
        AiReview.confirmBy(reviews, properties.aiReviewConfirmationWindow()).orElse(null));
  }
}
