package dev.certforge.questionbank.internal;

import static dev.certforge.preparationcatalog.TrackKind.CERTIFICATION;
import static dev.certforge.preparationcatalog.TrackKind.INTERVIEW;
import static org.assertj.core.api.Assertions.assertThat;

import dev.certforge.questionbank.Difficulty;
import dev.certforge.questionbank.QuestionType;
import dev.certforge.questionbank.Seniority;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class RevisionRulesTest {

  private static final RevisionContent.Reference REFERENCE =
      new RevisionContent.Reference("JLS 14.20", "https://docs.oracle.com/javase/specs/");

  private static RevisionContent.Option option(String key, boolean correct) {
    return new RevisionContent.Option(key, "Option " + key, correct, "Because " + key);
  }

  private static RevisionContent content(QuestionType type, List<RevisionContent.Option> options) {
    return new RevisionContent(
        type,
        UUID.randomUUID(),
        21,
        null,
        Difficulty.MEDIUM,
        "Requires knowing switch patterns",
        "What is printed?",
        "Explanation",
        options,
        List.of(REFERENCE));
  }

  @Test
  void acceptsACompleteSingleChoiceRevision() {
    var content =
        content(QuestionType.SINGLE_CHOICE, List.of(option("A", true), option("B", false)));

    assertThat(RevisionRules.violations(content, CERTIFICATION)).isEmpty();
  }

  @Test
  void acceptsACompleteMultipleChoiceRevisionWithSeveralCorrectOptions() {
    var content =
        content(
            QuestionType.MULTIPLE_CHOICE,
            List.of(option("A", true), option("B", true), option("C", false)));

    assertThat(RevisionRules.violations(content, CERTIFICATION)).isEmpty();
  }

  @Test
  void singleChoiceNeedsExactlyOneCorrectOption() {
    var none = content(QuestionType.SINGLE_CHOICE, List.of(option("A", false), option("B", false)));
    var two = content(QuestionType.SINGLE_CHOICE, List.of(option("A", true), option("B", true)));

    assertThat(RevisionRules.violations(none, CERTIFICATION))
        .containsExactly("single_choice_requires_exactly_one_correct_option");
    assertThat(RevisionRules.violations(two, CERTIFICATION))
        .containsExactly("single_choice_requires_exactly_one_correct_option");
  }

  @Test
  void multipleChoiceNeedsAtLeastOneCorrectOption() {
    var content =
        content(QuestionType.MULTIPLE_CHOICE, List.of(option("A", false), option("B", false)));

    assertThat(RevisionRules.violations(content, CERTIFICATION))
        .containsExactly("multiple_choice_requires_a_correct_option");
  }

  @Test
  void needsAtLeastTwoOptionsWithUniqueKeys() {
    var one = content(QuestionType.MULTIPLE_CHOICE, List.of(option("A", true)));
    var duplicate =
        content(QuestionType.MULTIPLE_CHOICE, List.of(option("A", true), option("A", false)));

    assertThat(RevisionRules.violations(one, CERTIFICATION)).contains("options_too_few");
    assertThat(RevisionRules.violations(duplicate, CERTIFICATION)).contains("option_key_duplicate");
  }

  @Test
  void everyOptionNeedsTextAndAnExplanation() {
    var content =
        content(
            QuestionType.SINGLE_CHOICE,
            List.of(option("A", true), new RevisionContent.Option("B", " ", false, null)));

    assertThat(RevisionRules.violations(content, CERTIFICATION))
        .contains("option_text_missing", "option_explanation_missing");
  }

  @Test
  void requiresAnAuthoritativeHttpsReference() {
    var options = List.of(option("A", true), option("B", false));
    var none =
        new RevisionContent(
            QuestionType.SINGLE_CHOICE,
            UUID.randomUUID(),
            21,
            null,
            Difficulty.EASY,
            "r",
            "p",
            "e",
            options,
            List.of());
    var insecure =
        new RevisionContent(
            QuestionType.SINGLE_CHOICE,
            UUID.randomUUID(),
            21,
            null,
            Difficulty.EASY,
            "r",
            "p",
            "e",
            options,
            List.of(new RevisionContent.Reference("Doc", "http://example.com")));

    assertThat(RevisionRules.violations(none, CERTIFICATION)).containsExactly("references_missing");
    assertThat(RevisionRules.violations(insecure, CERTIFICATION))
        .containsExactly("reference_invalid");
  }

  @Test
  void reportsEveryMissingRequiredField() {
    var empty =
        new RevisionContent(
            QuestionType.SINGLE_CHOICE,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            List.of(),
            List.of());

    assertThat(RevisionRules.violations(empty, CERTIFICATION))
        .contains(
            "prompt_missing",
            "topic_missing",
            "java_release_missing",
            "difficulty_missing",
            "difficulty_rationale_missing",
            "explanation_missing",
            "options_too_few",
            "references_missing");
  }

  // ---- the Java release, which only a certification question states (ADR 0016 decision 6) -----

  @Test
  void anInterviewQuestionNeedsNoJavaReleaseButDoesNeedASeniority() {
    RevisionContent interview = interview(Seniority.SENIOR);

    assertThat(RevisionRules.violations(interview, INTERVIEW)).isEmpty();
    // The same content for a certification track is incomplete and carries a field it may not,
    // which is the point of the rules being conditional rather than simply relaxed.
    assertThat(RevisionRules.violations(interview, CERTIFICATION))
        .containsExactlyInAnyOrder("java_release_missing", "seniority_not_applicable");
  }

  @Test
  void anInterviewQuestionIsRefusedAJavaRelease() {
    var withRelease =
        content(QuestionType.SINGLE_CHOICE, List.of(option("A", true), option("B", false)));

    assertThat(RevisionRules.violations(withRelease, INTERVIEW))
        .containsExactlyInAnyOrder("java_release_not_applicable", "seniority_missing");
  }

  // ---- seniority, which only an interview question states (ADR 0016 decision 5) ---------------

  @Test
  void anInterviewQuestionWithoutASeniorityIsIncomplete() {
    assertThat(RevisionRules.violations(interview(null), INTERVIEW))
        .containsExactly("seniority_missing");
  }

  @Test
  void eitherSeniorityIsAccepted() {
    assertThat(RevisionRules.violations(interview(Seniority.PLENO), INTERVIEW)).isEmpty();
    assertThat(RevisionRules.violations(interview(Seniority.SENIOR), INTERVIEW)).isEmpty();
  }

  @Test
  void aCertificationQuestionIsRefusedASeniority() {
    var withSeniority =
        new RevisionContent(
            QuestionType.SINGLE_CHOICE,
            UUID.randomUUID(),
            21,
            Seniority.PLENO,
            Difficulty.MEDIUM,
            "Requires knowing switch patterns",
            "What is printed?",
            "Explanation",
            List.of(option("A", true), option("B", false)),
            List.of(REFERENCE));

    // An exam objective is true or it is not; there is no level at which it is asked, so a
    // seniority here would be a claim with nothing behind it.
    assertThat(RevisionRules.violations(withSeniority, CERTIFICATION))
        .containsExactly("seniority_not_applicable");
  }

  /** A complete interview question: no Java release, and the given seniority. */
  private static RevisionContent interview(Seniority seniority) {
    return new RevisionContent(
        QuestionType.SINGLE_CHOICE,
        UUID.randomUUID(),
        null,
        seniority,
        Difficulty.MEDIUM,
        "Asked at this depth in most backend screens",
        "How would you make a consumer idempotent?",
        "Explanation",
        List.of(option("A", true), option("B", false)),
        List.of(REFERENCE));
  }

  @Test
  void acceptsACompleteGuidedResponseOnlyForInterviewTracks() {
    RevisionContent guided = guided(Seniority.SENIOR);

    assertThat(RevisionRules.violations(guided, INTERVIEW)).isEmpty();
    assertThat(RevisionRules.violations(guided, CERTIFICATION))
        .contains(
            "java_release_missing",
            "seniority_not_applicable",
            "guided_response_requires_interview_track");
  }

  @Test
  void guidedResponseNeedsReviewedCriteriaAndAtLeastOneRequiredConcept() {
    RevisionContent missing =
        new RevisionContent(
            QuestionType.GUIDED_RESPONSE,
            UUID.randomUUID(),
            null,
            Seniority.PLENO,
            Difficulty.MEDIUM,
            "Tests reasoning rather than recall",
            "Explain an idempotent consumer.",
            null,
            List.of(),
            null,
            List.of(REFERENCE));
    RevisionContent noRequired =
        new RevisionContent(
            QuestionType.GUIDED_RESPONSE,
            UUID.randomUUID(),
            null,
            Seniority.PLENO,
            Difficulty.MEDIUM,
            "Tests reasoning rather than recall",
            "Explain an idempotent consumer.",
            null,
            List.of(),
            new RevisionContent.GuidedResponse(
                "Use a stable idempotency key and durable duplicate detection.",
                List.of(new RevisionContent.ExpectedConcept("idempotency key", false, null)),
                List.of(),
                List.of()),
            List.of(REFERENCE));

    assertThat(RevisionRules.violations(missing, INTERVIEW))
        .containsExactly("guided_response_criteria_missing");
    assertThat(RevisionRules.violations(noRequired, INTERVIEW))
        .containsExactly("guided_required_concept_missing");
  }

  @Test
  void objectiveQuestionsCannotCarryGuidedCriteria() {
    RevisionContent objective =
        new RevisionContent(
            QuestionType.SINGLE_CHOICE,
            UUID.randomUUID(),
            21,
            null,
            Difficulty.MEDIUM,
            "Tests overload resolution",
            "Which overload is selected?",
            "The most specific applicable overload wins.",
            List.of(option("A", true), option("B", false)),
            new RevisionContent.GuidedResponse(
                "Not applicable",
                List.of(new RevisionContent.ExpectedConcept("not applicable", true, null)),
                List.of(),
                List.of()),
            List.of(REFERENCE));

    assertThat(RevisionRules.violations(objective, CERTIFICATION))
        .containsExactly("guided_response_criteria_not_applicable");
  }

  private static RevisionContent guided(Seniority seniority) {
    return new RevisionContent(
        QuestionType.GUIDED_RESPONSE,
        UUID.randomUUID(),
        null,
        seniority,
        Difficulty.HARD,
        "Requires connecting delivery semantics with durable state",
        "How would you make a message consumer idempotent?",
        null,
        List.of(),
        new RevisionContent.GuidedResponse(
            "Use a stable message or business key and record processed work atomically with the side effect.",
            List.of(
                new RevisionContent.ExpectedConcept(
                    "stable idempotency key", true, "Duplicates must map to the same identity."),
                new RevisionContent.ExpectedConcept(
                    "atomic durable duplicate detection",
                    true,
                    "Detection cannot be only in memory.")),
            List.of("Assuming the broker can guarantee exactly-once business effects."),
            List.of("What changes if the side effect is in another service?")),
        List.of(REFERENCE));
  }

  @Test
  void anUnknownKindIsTreatedAsCertification() {
    var complete =
        content(QuestionType.SINGLE_CHOICE, List.of(option("A", true), option("B", false)));

    // A draft with no topic yet, or one naming a topic that does not exist, reports exactly what
    // it reported before this rule existed. Nothing silently becomes acceptable.
    assertThat(RevisionRules.violations(complete, null)).isEmpty();
    assertThat(RevisionRules.violations(withoutRelease(), null))
        .containsExactly("java_release_missing");
  }

  private static RevisionContent withoutRelease() {
    return new RevisionContent(
        QuestionType.SINGLE_CHOICE,
        UUID.randomUUID(),
        null,
        null,
        Difficulty.MEDIUM,
        "Requires knowing switch patterns",
        "What is printed?",
        "Explanation",
        List.of(option("A", true), option("B", false)),
        List.of(REFERENCE));
  }
}
