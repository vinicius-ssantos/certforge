package dev.certforge.study.internal;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.preparationcatalog.InterviewTrackView;
import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.GuidedMaterial;
import dev.certforge.questionbank.QuestionBank;
import dev.certforge.questionbank.QuestionRevisionId;
import dev.certforge.study.Confidence;
import dev.certforge.study.internal.InterviewEvidenceViews.ConceptMarkView;
import dev.certforge.study.internal.InterviewEvidenceViews.GuidedEvidenceView;
import dev.certforge.study.internal.InterviewEvidenceViews.InterviewEvidenceView;
import dev.certforge.study.internal.InterviewEvidenceViews.ObjectiveEvidenceView;
import dev.certforge.study.internal.InterviewEvidenceViews.TopicEvidenceView;
import dev.certforge.study.internal.InterviewRepository.ConceptMarkRow;
import dev.certforge.study.internal.InterviewRepository.EvidenceRow;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * What interview practice has shown, derived from the responses every time it is asked.
 *
 * <p>Nothing here is stored. #23 requires that rebuilding a projection yields the same result, and
 * the surest way to hold that is to keep nothing to drift: every number is counted from the
 * immutable responses and the learner's own marks when the question is asked.
 *
 * <p>What this deliberately does not produce: a readiness percentage, an overall score, a
 * probability of passing an interview, or anything resembling a hiring signal. The counts it does
 * produce each carry the ids behind them, so a learner can read the responses rather than trust the
 * number.
 */
@Service
class InterviewEvidenceService {

  private final InterviewRepository repository;
  private final PreparationCatalog catalog;
  private final QuestionBank questionBank;
  private final CurrentActor currentActor;

  InterviewEvidenceService(
      InterviewRepository repository,
      PreparationCatalog catalog,
      QuestionBank questionBank,
      CurrentActor currentActor) {
    this.repository = repository;
    this.catalog = catalog;
    this.questionBank = questionBank;
    this.currentActor = currentActor;
  }

  @Transactional(readOnly = true)
  InterviewEvidenceView of(String trackSlug) {
    ActorId learner = currentActor.require();
    InterviewTrackView track =
        catalog
            .activeInterviewTrack(trackSlug)
            .orElseThrow(
                () ->
                    StudyException.notFound(
                        "interview_track_not_found", "No active interview track with that slug"));
    UUID version = track.versionId().value();

    List<EvidenceRow> responses = repository.evidenceOf(learner.value(), version);
    List<ConceptMarkRow> missed = repository.conceptsMarkedMissed(learner.value(), version);

    // Grouped in encounter order, which is submission order: a topic appears where the learner
    // first
    // practised it, and two calls over the same evidence produce the same order.
    Map<UUID, List<EvidenceRow>> byTopic = new LinkedHashMap<>();
    for (EvidenceRow row : responses) {
      byTopic.computeIfAbsent(row.topicId(), ignored -> new ArrayList<>()).add(row);
    }

    List<TopicEvidenceView> topics = new ArrayList<>();
    for (Map.Entry<UUID, List<EvidenceRow>> entry : byTopic.entrySet()) {
      topics.add(topicEvidence(entry.getKey(), entry.getValue(), missed));
    }
    return new InterviewEvidenceView(version, List.copyOf(topics));
  }

  private TopicEvidenceView topicEvidence(
      UUID topicId, List<EvidenceRow> rows, List<ConceptMarkRow> missed) {
    List<EvidenceRow> objective =
        rows.stream().filter(row -> row.itemKind() == ItemKind.OBJECTIVE).toList();
    List<EvidenceRow> guided =
        rows.stream().filter(row -> row.itemKind() == ItemKind.GUIDED).toList();

    List<UUID> sureAndWrong =
        objective.stream()
            .filter(
                row -> Boolean.FALSE.equals(row.correct()) && row.confidence() == Confidence.HIGH)
            .map(EvidenceRow::responseId)
            .toList();
    List<UUID> unsureAndRight =
        objective.stream()
            .filter(row -> Boolean.TRUE.equals(row.correct()) && row.confidence() == Confidence.LOW)
            .map(EvidenceRow::responseId)
            .toList();
    int correct =
        (int) objective.stream().filter(row -> Boolean.TRUE.equals(row.correct())).count();

    ObjectiveEvidenceView objectiveView =
        new ObjectiveEvidenceView(
            objective.size(),
            correct,
            sureAndWrong,
            unsureAndRight,
            objective.stream()
                .map(EvidenceRow::submittedAt)
                .max(Comparator.naturalOrder())
                .orElse(null));

    List<UUID> guidedResponses = guided.stream().map(EvidenceRow::responseId).toList();
    GuidedEvidenceView guidedView =
        new GuidedEvidenceView(
            guided.size(),
            conceptMarks(guided, missed),
            guided.stream()
                .map(EvidenceRow::submittedAt)
                .max(Comparator.naturalOrder())
                .orElse(null));

    return new TopicEvidenceView(
        new TopicId(topicId),
        objectiveView,
        guidedView,
        signals(objectiveView, guidedView, guidedResponses));
  }

  /**
   * The concepts the learner said their answers did not cover, most often first, each with the
   * reviewer's own words for it and the responses where they said so.
   */
  private List<ConceptMarkView> conceptMarks(
      List<EvidenceRow> guided, List<ConceptMarkRow> missed) {
    List<UUID> ours = guided.stream().map(EvidenceRow::responseId).toList();
    Map<String, List<ConceptMarkRow>> grouped = new LinkedHashMap<>();
    for (ConceptMarkRow mark : missed) {
      if (!ours.contains(mark.responseId())) {
        continue;
      }
      grouped
          .computeIfAbsent(
              mark.revisionId() + "#" + mark.conceptPosition(), ignored -> new ArrayList<>())
          .add(mark);
    }
    List<ConceptMarkView> marks = new ArrayList<>();
    for (List<ConceptMarkRow> group : grouped.values()) {
      ConceptMarkRow first = group.getFirst();
      marks.add(
          new ConceptMarkView(
              first.revisionId(),
              first.conceptPosition(),
              conceptText(first.revisionId(), first.conceptPosition()),
              group.size(),
              group.stream().map(ConceptMarkRow::responseId).toList()));
    }
    // Most often marked first; ties keep encounter order, so the list is stable across calls.
    return marks.stream()
        .sorted(Comparator.comparingInt(ConceptMarkView::times).reversed())
        .toList();
  }

  /**
   * The reviewer's own words for one expected concept, or a placeholder if it has since changed.
   */
  private String conceptText(UUID revisionId, int position) {
    return questionBank
        .findGuidedMaterial(new QuestionRevisionId(revisionId))
        .map(GuidedMaterial::expectedConcepts)
        .filter(concepts -> position < concepts.size())
        .map(concepts -> concepts.get(position).text())
        .orElse("(this expected concept is no longer in the question)");
  }

  /**
   * What the evidence says, in words.
   *
   * <p>Sentences rather than a score, and only where the evidence supports one. Each is a
   * restatement of a count the caller can already see and check, never an inference about the
   * learner: "sure and wrong twice" is two responses, and the ids are in the payload.
   */
  private List<String> signals(
      ObjectiveEvidenceView objective, GuidedEvidenceView guided, List<UUID> guidedResponses) {
    List<String> signals = new ArrayList<>();
    if (!objective.sureAndWrong().isEmpty()) {
      signals.add(
          "confident and wrong on "
              + objective.sureAndWrong().size()
              + " objective question(s): worth re-reading rather than re-practising");
    }
    if (!objective.unsureAndRight().isEmpty()) {
      signals.add(
          "right but unsure on "
              + objective.unsureAndRight().size()
              + " objective question(s): the knowledge may be there without the confidence");
    }
    if (!guided.conceptsMarkedMissed().isEmpty()) {
      ConceptMarkView first = guided.conceptsMarkedMissed().getFirst();
      signals.add(
          "you marked \"" + first.text() + "\" as not covered " + first.times() + " time(s)");
    }
    if (guided.practised() > 0 && guided.conceptsMarkedMissed().isEmpty()) {
      signals.add(
          "practised "
              + guided.practised()
              + " guided question(s) and marked no concept as missed; nothing here scores those"
              + " answers, so this says what you said and no more");
    }
    if (!guidedResponses.isEmpty() && signals.isEmpty()) {
      signals.add("practised, with nothing in the evidence to single out");
    }
    return List.copyOf(signals);
  }
}
