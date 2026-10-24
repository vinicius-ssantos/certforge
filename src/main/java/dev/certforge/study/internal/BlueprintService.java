package dev.certforge.study.internal;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.preparationcatalog.InterviewTrackView;
import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.preparationcatalog.TopicView;
import dev.certforge.study.internal.BlueprintRepository.BlueprintRow;
import dev.certforge.study.internal.BlueprintRepository.MatchRow;
import dev.certforge.study.internal.BlueprintRepository.RequirementRow;
import dev.certforge.study.internal.BlueprintRepository.TopicRow;
import dev.certforge.study.internal.BlueprintViews.BlueprintTopicView;
import dev.certforge.study.internal.BlueprintViews.BlueprintView;
import dev.certforge.study.internal.BlueprintViews.MatchView;
import java.time.Clock;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Turns a job description into weighted preparation, and can say why about every weight.
 *
 * <p>The whole design follows from one line of #22: opaque AI-only weighting is deferred. So the
 * mapping is a reviewed dictionary of terms, the weight is a count of how many distinct terms of a
 * topic appear, and the terms themselves are stored with the blueprint. A learner asking why
 * Concurrency is weighted three gets three words back.
 *
 * <p>Three things this refuses to do. It does not change the canonical taxonomy — a blueprint
 * points at topics and weighs them for one learner. It does not guess at a requirement it does not
 * recognise; it says it did not recognise it. And it says nothing about the learner: no fit, no
 * readiness for the role, no probability of an offer.
 */
@Service
class BlueprintService {

  /** The scale the seeded taxonomy uses for canonical weights, so a blueprint reads beside it. */
  private static final int MAX_WEIGHT = 5;

  private final BlueprintRepository repository;
  private final PreparationCatalog catalog;
  private final JobDescriptionTerms dictionary;
  private final CurrentActor currentActor;
  private final Clock clock;

  BlueprintService(
      BlueprintRepository repository,
      PreparationCatalog catalog,
      JobDescriptionTerms dictionary,
      CurrentActor currentActor,
      Clock clock) {
    this.repository = repository;
    this.catalog = catalog;
    this.dictionary = dictionary;
    this.currentActor = currentActor;
    this.clock = clock;
  }

  @Transactional
  BlueprintView create(
      String trackSlug,
      String jobTitle,
      String sourceText,
      List<String> requirements,
      Map<UUID, Integer> learnerWeights) {
    ActorId learner = currentActor.require();
    InterviewTrackView track =
        catalog
            .activeInterviewTrack(trackSlug)
            .orElseThrow(
                () ->
                    StudyException.notFound(
                        "interview_track_not_found", "No active interview track with that slug"));

    Map<String, TopicId> topicsBySlug = new LinkedHashMap<>();
    collect(track.topics(), topicsBySlug);
    List<String> given = requirements == null ? List.of() : requirements;
    Map<UUID, Integer> edits = learnerWeights == null ? Map.of() : learnerWeights;
    for (Map.Entry<UUID, Integer> edit : edits.entrySet()) {
      if (topicsBySlug.values().stream().noneMatch(topic -> topic.value().equals(edit.getKey()))) {
        throw StudyException.invalid(
            "topic_not_in_track", "A weighted topic is not part of this interview track");
      }
      if (edit.getValue() == null || edit.getValue() < 1 || edit.getValue() > MAX_WEIGHT) {
        throw StudyException.invalid(
            "weight_out_of_range", "A weight must be between 1 and " + MAX_WEIGHT);
      }
    }

    Map<UUID, List<MatchRow>> matches = new LinkedHashMap<>();
    for (Map.Entry<String, TopicId> topic : topicsBySlug.entrySet()) {
      List<MatchRow> found = new ArrayList<>();
      for (String term : dictionary.matchesIn(topic.getKey(), sourceText)) {
        found.add(new MatchRow(term, "DESCRIPTION"));
      }
      for (String requirement : given) {
        for (String term : dictionary.matchesIn(topic.getKey(), requirement)) {
          // A term found in both inputs is recorded twice on purpose: the learner listed it *and*
          // the advert said it, and the two are different evidence for the same weight.
          found.add(new MatchRow(term, "REQUIREMENT"));
        }
      }
      if (!found.isEmpty()) {
        matches.put(topic.getValue().value(), found);
      }
    }

    List<TopicRow> topics = new ArrayList<>();
    for (Map.Entry<UUID, List<MatchRow>> entry : matches.entrySet()) {
      if (edits.containsKey(entry.getKey())) {
        continue;
      }
      topics.add(
          new TopicRow(
              entry.getKey(), weightOf(entry.getValue()), "MATCHED", distinct(entry.getValue())));
    }
    for (Map.Entry<UUID, Integer> edit : edits.entrySet()) {
      // The learner's own weight replaces the matched one and says so. It keeps the terms that were
      // found, because they are still true about the description — what changed is the weight.
      topics.add(
          new TopicRow(
              edit.getKey(),
              edit.getValue(),
              "LEARNER",
              distinct(matches.getOrDefault(edit.getKey(), List.of()))));
    }

    List<RequirementRow> requirementRows =
        given.stream()
            .map(text -> new RequirementRow(text, dictionary.recognisesAnythingIn(text)))
            .toList();

    BlueprintRow row =
        new BlueprintRow(
            UUID.randomUUID(),
            learner.value(),
            track.versionId().value(),
            jobTitle,
            sourceText,
            clock.instant().truncatedTo(ChronoUnit.MICROS));
    repository.insert(row, requirementRows, topics);
    return view(row);
  }

  @Transactional(readOnly = true)
  BlueprintView get(UUID blueprintId) {
    return view(owned(blueprintId));
  }

  /**
   * The weights of one blueprint, for the session that uses it: topic id to weight.
   *
   * <p>Refuses a blueprint of another track version, because weighing one taxonomy with another's
   * reading would produce a session nobody asked for.
   */
  @Transactional(readOnly = true)
  Map<UUID, Integer> weightsOf(UUID blueprintId, UUID trackVersionId) {
    BlueprintRow row = owned(blueprintId);
    if (!row.trackVersionId().equals(trackVersionId)) {
      throw StudyException.invalid(
          "blueprint_of_another_track", "That blueprint was built for a different interview track");
    }
    Map<UUID, Integer> weights = new LinkedHashMap<>();
    for (TopicRow topic : repository.topics(blueprintId)) {
      weights.put(topic.topicId(), topic.weight());
    }
    return Map.copyOf(weights);
  }

  @Transactional(readOnly = true)
  List<BlueprintView> list() {
    ActorId learner = currentActor.require();
    return repository.findByLearner(learner.value()).stream().map(this::view).toList();
  }

  /**
   * The weight a set of matched terms earns: one point per distinct term, capped at the scale the
   * canonical taxonomy uses.
   *
   * <p>Deliberately the dullest rule that could work. Anything cleverer — weighting by where a term
   * appears, by how emphatic the advert is — would be a judgement the learner cannot check, and
   * #22's requirement is that they can.
   */
  private static int weightOf(List<MatchRow> matches) {
    return Math.min(MAX_WEIGHT, distinct(matches).size());
  }

  private static List<MatchRow> distinct(List<MatchRow> matches) {
    Map<String, MatchRow> byKey = new LinkedHashMap<>();
    for (MatchRow match : matches) {
      byKey.putIfAbsent(match.term() + "|" + match.foundIn(), match);
    }
    return List.copyOf(byKey.values());
  }

  private BlueprintRow owned(UUID blueprintId) {
    ActorId learner = currentActor.require();
    return repository
        .find(blueprintId)
        .filter(blueprint -> blueprint.learnerId().equals(learner.value()))
        .orElseThrow(() -> StudyException.notFound("blueprint_not_found", "Blueprint not found"));
  }

  private BlueprintView view(BlueprintRow row) {
    List<BlueprintTopicView> topics =
        repository.topics(row.id()).stream()
            .map(
                topic ->
                    new BlueprintTopicView(
                        new TopicId(topic.topicId()),
                        // Read per topic rather than through the track: a blueprint outlives the
                        // taxonomy version it was built from, and a topic that has since left it
                        // says so instead of being dropped from the learner's own blueprint.
                        catalog
                            .findTopicSlug(new TopicId(topic.topicId()))
                            .orElse("(topic no longer in the taxonomy)"),
                        topic.weight(),
                        topic.source(),
                        topic.matches().stream()
                            .map(match -> new MatchView(match.term(), match.foundIn()))
                            .toList()))
            .toList();
    List<String> unrecognised =
        repository.requirements(row.id()).stream()
            .filter(requirement -> !requirement.matched())
            .map(RequirementRow::text)
            .toList();
    return new BlueprintView(
        row.id(), row.trackVersionId(), row.jobTitle(), row.createdAt(), topics, unrecognised);
  }

  private static void collect(List<TopicView> topics, Map<String, TopicId> into) {
    for (TopicView topic : topics) {
      into.put(topic.slug(), topic.id());
      collect(topic.subtopics(), into);
    }
  }
}
