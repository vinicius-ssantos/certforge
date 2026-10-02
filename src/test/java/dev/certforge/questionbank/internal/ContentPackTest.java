package dev.certforge.questionbank.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.DynamicTest.dynamicTest;

import dev.certforge.questionbank.Difficulty;
import dev.certforge.questionbank.internal.QuestionAdminController.RevisionRequest;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;
import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.StandardLocation;
import javax.tools.ToolProvider;
import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestFactory;
import org.junit.jupiter.api.io.TempDir;
import tools.jackson.databind.json.JsonMapper;

/**
 * Verifies the authorial Java content pack in {@code content/java-se-21}.
 *
 * <p>For every question it checks the domain invariants, the catalog binding and, when the question
 * has code, that the code shown to learners really compiles for Java 21 and really produces the
 * declared output (or the declared compile error). This runs only in tests, never against
 * learner-submitted code.
 */
class ContentPackTest {

  static final Path PACK = Path.of("content", "java-se-21");
  static final String SNIPPET_PLACEHOLDER = "{{snippet}}";
  static final String COMPILE_ERROR = "COMPILE_ERROR:";

  // The only three sources a reference may cite (ADR 0011). The first two are scoped by release;
  // a JEP is not, because it describes one release by definition.
  static final String API_DOCS = "https://docs.oracle.com/en/java/javase/";
  static final String SPECS = "https://docs.oracle.com/javase/specs/";
  static final String JEPS = "https://openjdk.org/jeps/";

  /** Fixed ids of the ten topics seeded by V4__seed_java_certification_catalog.sql. */
  static final Set<String> SEEDED_TOPICS = new HashSet<>();

  static {
    for (int i = 1; i <= 10; i++) {
      SEEDED_TOPICS.add(String.format("a3000000-0000-4000-8000-%012d", i));
    }
  }

  private final JsonMapper mapper = JsonMapper.builder().build();

  private static List<Path> questionDirs() throws IOException {
    try (Stream<Path> dirs = Files.list(PACK)) {
      return dirs.filter(Files::isDirectory).sorted().toList();
    }
  }

  private RevisionRequest read(Path dir) throws IOException {
    return mapper.readValue(Files.readString(dir.resolve("question.json")), RevisionRequest.class);
  }

  /** The request exactly as it is imported: the snippet, if any, is placed into the prompt. */
  private RevisionRequest withSnippet(Path dir) throws IOException {
    RevisionRequest request = read(dir);
    Path main = dir.resolve("Main.java");
    String prompt = request.prompt();
    if (prompt.contains(SNIPPET_PLACEHOLDER)) {
      assertThat(main).as("%s uses %s but has no Main.java", dir, SNIPPET_PLACEHOLDER).exists();
      prompt = prompt.replace(SNIPPET_PLACEHOLDER, Files.readString(main).strip());
    }
    return new RevisionRequest(
        request.type(),
        request.topicId(),
        request.javaRelease(),
        request.difficulty(),
        request.difficultyRationale(),
        prompt,
        request.explanation(),
        request.options(),
        request.references());
  }

  // ---- per-question checks -------------------------------------------------------------------

  @TestFactory
  Stream<DynamicTest> everyQuestionIsCompleteAndItsCodeBehavesAsDeclared(@TempDir Path work)
      throws IOException {
    return questionDirs().stream()
        .map(
            dir ->
                dynamicTest(
                    dir.getFileName().toString(),
                    () -> {
                      RevisionRequest request = withSnippet(dir);
                      assertThat(RevisionRules.violations(request.toContent()))
                          .as("completeness of %s", dir.getFileName())
                          .isEmpty();
                      assertThat(request.javaRelease()).isEqualTo(21);
                      assertThat(SEEDED_TOPICS).contains(request.topicId().toString());
                      assertThat(request.prompt()).doesNotContain(SNIPPET_PLACEHOLDER);
                      assertThat(request.options()).hasSizeBetween(4, 5);
                      request.references().forEach(ref -> referenceIsOfficial(dir, ref, request));
                      verifyCode(dir, work.resolve(dir.getFileName()));
                      answerKeyAgreesWithTheProgram(dir, request);
                    }));
  }

  /**
   * A reference must point at an official, version-correct source. ADR 0005 forbids fabricating
   * references and the content policy asks for ones "sufficient for independent verification";
   * until ADR 0011 this was checked only as far as the {@code https://} prefix, which a dead link,
   * a blog post or the Java 17 page all satisfy.
   *
   * <p>This says nothing about whether the reference supports the claim. That is the semantic step,
   * and it stays with the human reviewer.
   */
  private void referenceIsOfficial(
      Path dir, QuestionAdminController.ReferenceRequest ref, RevisionRequest request) {
    String url = ref.url();
    String release = String.valueOf(request.javaRelease());
    String where = dir.getFileName() + " reference " + ref.title();

    if (url.startsWith(API_DOCS)) {
      // https://docs.oracle.com/en/java/javase/21/... -- the segment after javase/ is the release.
      assertThat(url)
          .as("%s must cite the API documentation for Java %s, not another release", where, release)
          .startsWith(API_DOCS + release + "/");
    } else if (url.startsWith(SPECS)) {
      // https://docs.oracle.com/javase/specs/jls/se21/... -- the specification is scoped by seNN.
      assertThat(url)
          .as("%s must cite the se%s specification, not another release", where, release)
          .contains("/se" + release + "/");
    } else {
      assertThat(url)
          .as(
              "%s must be an official source: the Java SE specifications, the API documentation, or"
                  + " a JEP. Anything else cannot be a reference, however good it is",
              where)
          .startsWith(JEPS);
    }
  }

  /**
   * The answer key must agree with what the program really does. {@link #verifyCode} proves what
   * the program prints; this links that output to the option marked correct, so a question that
   * prints one thing and marks another as the answer cannot pass. Questions whose options are prose
   * rather than the literal output say nothing this can check, and are left to the human reviewer.
   */
  private void answerKeyAgreesWithTheProgram(Path dir, RevisionRequest request) throws IOException {
    Path expectedFile = dir.resolve("expected.txt");
    if (!Files.exists(expectedFile)) {
      return;
    }
    String expected = Files.readString(expectedFile).replace("\r\n", "\n").strip();
    if (expected.startsWith(COMPILE_ERROR)) {
      return;
    }
    List<QuestionAdminController.OptionRequest> printed =
        request.options().stream().filter(o -> o.text().strip().equals(expected)).toList();
    if (printed.isEmpty()) {
      return;
    }
    assertThat(printed)
        .as("%s offers the program's output as more than one option", dir.getFileName())
        .hasSize(1);
    assertThat(printed.getFirst().correct())
        .as(
            "%s prints \"%s\", so the option with that text is the answer and must be marked correct",
            dir.getFileName(), expected)
        .isTrue();
  }

  private void verifyCode(Path dir, Path out) throws Exception {
    Path expectedFile = dir.resolve("expected.txt");
    List<Path> sources;
    try (Stream<Path> files = Files.list(dir)) {
      sources = files.filter(f -> f.toString().endsWith(".java")).sorted().toList();
    }
    if (sources.isEmpty()) {
      assertThat(expectedFile).as("expected.txt without code in %s", dir).doesNotExist();
      return;
    }
    assertThat(expectedFile).as("code in %s needs expected.txt", dir).exists();
    String expected = Files.readString(expectedFile).replace("\r\n", "\n").strip();
    Files.createDirectories(out);

    JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
    DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();
    boolean compiled;
    try (StandardJavaFileManager files =
        compiler.getStandardFileManager(diagnostics, Locale.ENGLISH, StandardCharsets.UTF_8)) {
      files.setLocationFromPaths(StandardLocation.CLASS_OUTPUT, List.of(out));
      compiled =
          Boolean.TRUE.equals(
              compiler
                  .getTask(
                      null,
                      files,
                      diagnostics,
                      List.of("--release", "21", "-Xlint:-options"),
                      null,
                      files.getJavaFileObjectsFromPaths(sources))
                  .call());
    }

    if (expected.startsWith(COMPILE_ERROR)) {
      String code = expected.substring(COMPILE_ERROR.length()).strip();
      assertThat(compiled).as("%s is expected not to compile", dir.getFileName()).isFalse();
      List<String> errors =
          diagnostics.getDiagnostics().stream()
              .filter(d -> d.getKind() == Diagnostic.Kind.ERROR)
              .map(Diagnostic::getCode)
              .toList();
      assertThat(errors).anyMatch(c -> c.contains(code));
      return;
    }

    assertThat(compiled)
        .as("%s must compile for Java 21: %s", dir.getFileName(), diagnostics.getDiagnostics())
        .isTrue();
    assertThat(run(out)).isEqualTo(expected);
  }

  private static String run(Path classes) throws Exception {
    Path java = Path.of(System.getProperty("java.home"), "bin", "java");
    Process process =
        new ProcessBuilder(java.toString(), "-cp", classes.toString(), "Main")
            .redirectErrorStream(true)
            .start();
    byte[] output = process.getInputStream().readAllBytes();
    assertThat(process.waitFor(30, TimeUnit.SECONDS)).as("program finished in time").isTrue();
    String text = new String(output, StandardCharsets.UTF_8).replace("\r\n", "\n").strip();
    assertThat(process.exitValue()).as("exit code, output was: %s", text).isZero();
    return text;
  }

  // ---- pack-level checks ---------------------------------------------------------------------

  @Test
  void packCoversEveryTopicWithMixedTypesAndDifficulties() throws IOException {
    Map<String, Integer> perTopic = new TreeMap<>();
    Set<Difficulty> difficulties = EnumSet.noneOf(Difficulty.class);
    Set<String> types = new HashSet<>();
    for (Path dir : questionDirs()) {
      RevisionRequest request = read(dir);
      perTopic.merge(request.topicId().toString(), 1, Integer::sum);
      difficulties.add(request.difficulty());
      types.add(request.type().name());
    }

    assertThat(perTopic.keySet()).isEqualTo(SEEDED_TOPICS);
    assertThat(perTopic.values()).allSatisfy(count -> assertThat(count).isGreaterThanOrEqualTo(2));
    assertThat(difficulties).containsExactlyInAnyOrder(Difficulty.values());
    assertThat(types).containsExactlyInAnyOrder("SINGLE_CHOICE", "MULTIPLE_CHOICE");
  }

  @Test
  void questionsAreUniqueAndDoNotClaimToBeRealExamItems() throws IOException {
    List<String> prompts = new ArrayList<>();
    for (Path dir : questionDirs()) {
      RevisionRequest request = withSnippet(dir);
      prompts.add(request.prompt());
      String text =
          (request.prompt() + " " + request.explanation() + " " + request.difficultyRationale())
              .toLowerCase(Locale.ROOT);
      assertThat(text)
          .as("%s must not present itself as real exam content", dir.getFileName())
          .doesNotContain("real exam")
          .doesNotContain("actual exam")
          .doesNotContain("exam dump")
          .doesNotContain("appeared in the exam")
          .doesNotContain("you will see this");
    }

    assertThat(prompts).doesNotHaveDuplicates();
  }

  @Test
  void directoryNamesAreUniqueStableIdentifiers() throws IOException {
    List<String> names = questionDirs().stream().map(d -> d.getFileName().toString()).toList();

    assertThat(names)
        .doesNotHaveDuplicates()
        .allSatisfy(n -> assertThat(n).matches("^t\\d{2}-[a-z0-9-]+$"));
  }
}
