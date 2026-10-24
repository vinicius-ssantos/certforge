package dev.certforge.study.internal;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

/**
 * The reviewed dictionary that maps words in a job description to canonical interview topics.
 *
 * <p>A dictionary and not a model, because #22 defers "opaque AI-only weighting" and requires that
 * every weighted topic have an explainable source. A learner can be shown the term that reached a
 * topic; they cannot be shown an embedding. Adding a term is a pull request, reviewed like any
 * other content, and nothing here infers one at runtime.
 *
 * <p>Matching is deliberately dull: case-insensitive, on word boundaries, and once per term per
 * topic. A description that says Kafka nine times is not nine times more about messaging, and
 * counting repetitions would make the weight a measure of how the advert was written.
 */
@Component
class JobDescriptionTerms {

  private final Map<String, List<Pattern>> patternsByTopicSlug;
  private final Map<String, List<String>> termsByTopicSlug;

  JobDescriptionTerms() {
    this("interview/job-description-terms.json");
  }

  JobDescriptionTerms(String resource) {
    Map<String, List<Pattern>> patterns = new LinkedHashMap<>();
    Map<String, List<String>> terms = new LinkedHashMap<>();
    JsonNode topics = read(resource).path("topics");
    Iterator<Map.Entry<String, JsonNode>> fields = topics.fields();
    while (fields.hasNext()) {
      Map.Entry<String, JsonNode> topic = fields.next();
      List<Pattern> compiled = new ArrayList<>();
      List<String> words = new ArrayList<>();
      for (JsonNode term : topic.getValue()) {
        String word = term.asText();
        words.add(word);
        compiled.add(
            Pattern.compile(
                "(?<![\\p{L}\\p{N}])" + Pattern.quote(word) + "(?![\\p{L}\\p{N}])",
                Pattern.CASE_INSENSITIVE));
      }
      patterns.put(topic.getKey(), List.copyOf(compiled));
      terms.put(topic.getKey(), List.copyOf(words));
    }
    this.patternsByTopicSlug = Map.copyOf(patterns);
    this.termsByTopicSlug = Map.copyOf(terms);
  }

  private static JsonNode read(String resource) {
    try (InputStream stream = new ClassPathResource(resource).getInputStream()) {
      return new ObjectMapper().readTree(stream);
    } catch (IOException e) {
      throw new IllegalStateException("The job-description term dictionary is unreadable", e);
    }
  }

  /** Every topic slug the dictionary knows, in the order the file lists them. */
  List<String> topicSlugs() {
    return List.copyOf(patternsByTopicSlug.keySet());
  }

  /**
   * The terms of one topic that appear in the text, each once, in dictionary order.
   *
   * <p>Dictionary order rather than order of appearance, so two blueprints built from the same text
   * record the same matches in the same sequence and can be compared.
   */
  List<String> matchesIn(String topicSlug, String text) {
    if (text == null || text.isBlank()) {
      return List.of();
    }
    List<Pattern> patterns = patternsByTopicSlug.getOrDefault(topicSlug, List.of());
    List<String> words = termsByTopicSlug.getOrDefault(topicSlug, List.of());
    List<String> found = new ArrayList<>();
    for (int index = 0; index < patterns.size(); index++) {
      Matcher matcher = patterns.get(index).matcher(text);
      if (matcher.find()) {
        found.add(words.get(index).toLowerCase(Locale.ROOT));
      }
    }
    return List.copyOf(found);
  }

  /** Whether any topic recognises anything in the text at all. */
  boolean recognisesAnythingIn(String text) {
    return topicSlugs().stream().anyMatch(slug -> !matchesIn(slug, text).isEmpty());
  }
}
