package dev.certforge.questionbank.internal;

import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.PublishedOption;
import dev.certforge.questionbank.PublishedQuestion;
import dev.certforge.questionbank.QuestionBank;
import dev.certforge.questionbank.QuestionId;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.questionbank.QuestionType;
import dev.certforge.questionbank.RevisionEvidence;
import dev.certforge.questionbank.RevisionStatus;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Cross-module reads. Learner-safe projections are built here so answer data cannot leak. */
@Service
@Transactional(readOnly = true)
class QuestionBankReadService implements QuestionBank {

  private final QuestionRepository repository;
  private final PreparationCatalog catalog;

  QuestionBankReadService(QuestionRepository repository, PreparationCatalog catalog) {
    this.repository = repository;
    this.catalog = catalog;
  }

  @Override
  public List<PublishedQuestion> eligibleForTopic(TopicId topicId) {
    return catalog
        .findActiveTopicContext(topicId)
        .map(
            context ->
                repository
                    .findPublishedByTopic(topicId.value(), context.trackVersionId().value())
                    .stream()
                    // Guided-response revisions are publishable reviewed content, but the current
                    // Study/Review/Mock flows only know objective answer semantics. #21 will add a
                    // separate interview-session contract rather than letting an empty option set
                    // fall through objective grading.
                    .filter(revision -> revision.content().type() != QuestionType.GUIDED_RESPONSE)
                    .map(QuestionBankReadService::learnerView)
                    .toList())
        .orElse(List.of());
  }

  @Override
  public Optional<PublishedQuestion> findSnapshotQuestion(QuestionRevisionId revisionId) {
    return repository
        .findRevision(revisionId.value())
        .filter(
            revision ->
                revision.status() == RevisionStatus.PUBLISHED
                    || revision.status() == RevisionStatus.DEPRECATED)
        .filter(revision -> revision.publishedAt() != null)
        .filter(QuestionBankReadService::objective)
        .map(QuestionBankReadService::learnerView);
  }

  @Override
  public Optional<PublishedQuestion> findPublished(QuestionRevisionId revisionId) {
    return repository
        .findRevision(revisionId.value())
        .filter(revision -> revision.status() == RevisionStatus.PUBLISHED)
        .filter(QuestionBankReadService::objective)
        .map(QuestionBankReadService::learnerView);
  }

  @Override
  public Optional<RevisionEvidence> findRevision(QuestionRevisionId revisionId) {
    return repository
        .findRevision(revisionId.value())
        .filter(QuestionBankReadService::objective)
        .map(QuestionBankReadService::evidence);
  }

  @Override
  public Map<QuestionRevisionId, RevisionEvidence> findRevisions(
      Set<QuestionRevisionId> revisionIds) {
    if (revisionIds.isEmpty()) {
      return Map.of();
    }
    List<UUID> ids = revisionIds.stream().map(QuestionRevisionId::value).toList();
    Map<QuestionRevisionId, RevisionEvidence> found = new HashMap<>();
    for (Revision revision : repository.findRevisionsByIds(ids)) {
      if (objective(revision)) {
        RevisionEvidence evidence = evidence(revision);
        found.put(evidence.revisionId(), evidence);
      }
    }
    return Map.copyOf(found);
  }

  private static boolean objective(Revision revision) {
    return revision.content().type() != QuestionType.GUIDED_RESPONSE;
  }

  private static PublishedQuestion learnerView(Revision revision) {
    RevisionContent content = revision.content();
    return new PublishedQuestion(
        new QuestionId(revision.questionId()),
        new QuestionRevisionId(revision.id()),
        revision.number(),
        content.type(),
        new TopicId(content.topicId()),
        content.javaRelease(),
        content.difficulty(),
        content.prompt(),
        content.options().stream().map(o -> new PublishedOption(o.key(), o.text())).toList());
  }

  private static RevisionEvidence evidence(Revision revision) {
    RevisionContent content = revision.content();
    return new RevisionEvidence(
        new QuestionId(revision.questionId()),
        new QuestionRevisionId(revision.id()),
        revision.number(),
        revision.status(),
        content.type(),
        content.topicId() == null ? null : new TopicId(content.topicId()),
        content.javaRelease() == null ? 0 : content.javaRelease(),
        content.prompt(),
        content.explanation(),
        content.options().stream()
            .map(o -> new RevisionEvidence.Option(o.key(), o.text(), o.correct(), o.explanation()))
            .toList(),
        content.references().stream()
            .map(r -> new RevisionEvidence.Reference(r.title(), r.url()))
            .toList());
  }
}
