package dev.certforge.study.internal;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

/**
 * The dictionary behind #22's blueprint. These tests are about the two properties a learner is
 * promised: that a weight can be explained by a word, and that the word was really there.
 */
class JobDescriptionTermsTest {

  private final JobDescriptionTerms terms = new JobDescriptionTerms();

  @Test
  void matchesWholeWordsOnlyAndIgnoresCase() {
    assertThat(terms.matchesIn("spring", "We use Spring Boot and Spring Security"))
        .contains("spring", "spring boot", "spring security");

    // The reason the patterns carry boundaries: a springboard is not a framework, and a
    // blueprint that weighed Spring because of it would be unexplainable to the learner.
    assertThat(terms.matchesIn("spring", "a springboard for your career")).isEmpty();
    assertThat(terms.matchesIn("persistence", "JPAX is not JPA")).containsExactly("jpa");
  }

  @Test
  void countsATermOnceHoweverOftenItAppears() {
    // A description that repeats Kafka is not more about messaging than one that says it once;
    // counting repetitions would make the weight a measure of how the advert was written.
    assertThat(terms.matchesIn("messaging", "Kafka, Kafka and more Kafka"))
        .containsExactly("kafka");
  }

  @Test
  void recordsMatchesInDictionaryOrderSoTwoBlueprintsCanBeCompared() {
    String text = "We need observability, Kubernetes and AWS";
    assertThat(terms.matchesIn("cloud-operations", text))
        .containsExactly("aws", "kubernetes", "observability")
        .isEqualTo(terms.matchesIn("cloud-operations", text));
  }

  @Test
  void knowsNothingAboutATextItDoesNotRecognise() {
    assertThat(terms.recognisesAnythingIn("We are looking for a friendly person")).isFalse();
    assertThat(terms.recognisesAnythingIn("Experience with Kafka")).isTrue();
  }

  @Test
  void coversEveryTopicOfTheSeededTaxonomy() {
    // Twelve topics (ADR 0016 decision 3). A dictionary missing one would make that topic
    // unreachable from any job description, silently.
    assertThat(terms.topicSlugs())
        .containsExactlyInAnyOrder(
            "java-language-runtime",
            "concurrency",
            "object-oriented-design",
            "data-structures-algorithms",
            "spring",
            "persistence",
            "testing",
            "domain-boundaries",
            "distributed-systems",
            "messaging",
            "cloud-operations",
            "system-design");
  }
}
