package dev.certforge.platform.internal;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;

/**
 * No two controller records may share a simple name.
 *
 * <p>This exists because of a defect it would have caught on the day it was introduced. The
 * interview controller declared a nested {@code record StartRequest}, and so did the study
 * controller. A schema name in OpenAPI is the simple class name, so one of the two silently
 * replaced the other: {@code POST /api/study/interviews} was published with the study session's
 * body, and the generated TypeScript client therefore could not start an interview session at all.
 * Nothing failed. The contract was regenerated, committed and merged twice in that state, and the
 * collision only surfaced when the first screen tried to call the endpoint and the compiler
 * complained that {@code trackSlug} was not a field.
 *
 * <p>So the rule is checked where it can be seen, which is in the source rather than in the
 * generated file: the generated file holds the winner and says nothing about the loser.
 */
class ContractSchemaNamesTest {

  /** A nested record declared inside a controller, which is what springdoc turns into a schema. */
  private static final Pattern RECORD =
      Pattern.compile(
          "^\\s{2}(?:public\\s+|static\\s+)*record\\s+(\\w+)\\s*\\(", Pattern.MULTILINE);

  @Test
  void noTwoControllerRecordsShareASimpleName() throws IOException {
    Map<String, List<String>> byName = new LinkedHashMap<>();
    try (Stream<Path> files = Files.walk(Path.of("src", "main", "java"))) {
      for (Path file : files.filter(ContractSchemaNamesTest::isController).toList()) {
        Matcher matcher = RECORD.matcher(Files.readString(file));
        while (matcher.find()) {
          byName
              .computeIfAbsent(matcher.group(1), key -> new ArrayList<>())
              .add(file.getFileName().toString());
        }
      }
    }

    // The map has to have been built from something: a walk that found no controllers would make
    // this test pass by finding nothing, which is the failure mode of every test like it.
    assertThat(byName).as("controller request and response records").hasSizeGreaterThan(20);

    List<String> clashes =
        byName.entrySet().stream()
            .filter(entry -> entry.getValue().size() > 1)
            .map(entry -> entry.getKey() + " in " + entry.getValue())
            .toList();
    assertThat(clashes)
        .as(
            "two records with one name become one OpenAPI schema, and the other endpoint is"
                + " published with the wrong body")
        .isEmpty();
  }

  private static boolean isController(Path file) {
    return file.getFileName().toString().endsWith("Controller.java");
  }
}
