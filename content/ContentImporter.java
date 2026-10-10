import java.io.IOException;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

/**
 * Imports a content pack into a running CertForge through its editorial API.
 *
 * <p>Run with {@code java content/ContentImporter.java --email you@example.com --password ...}.
 * It signs in as the given account (which becomes the author of record), creates each question as
 * a DRAFT and submits it for technical review. It never approves or publishes anything: review and
 * publication are human decisions made by other accounts. Questions whose prompt already exists
 * are skipped, so the command is safe to run again.
 *
 * <p>Options: {@code --base-url} (default http://localhost:8080), {@code --email}, {@code
 * --password} (or the CERTFORGE_EMAIL and CERTFORGE_PASSWORD environment variables), {@code --pack}
 * (default content/java-se-21), {@code --dry-run}.
 */
public class ContentImporter {

  private static final String SNIPPET = "{{snippet}}";
  private static final Pattern PROMPT =
      Pattern.compile("\"prompt\"\\s*:\\s*\"((?:[^\"\\\\]|\\\\.)*)\"");
  private static final Pattern FIRST_REVISION_ID =
      Pattern.compile("\"revisions\"\\s*:\\s*\\[\\s*\\{\\s*\"id\"\\s*:\\s*\"([0-9a-fA-F-]{36})\"");

  private final HttpClient client =
      HttpClient.newBuilder().cookieHandler(new CookieManager(null, CookiePolicy.ACCEPT_ALL)).build();
  private final String baseUrl;
  private String csrfHeader = "X-XSRF-TOKEN";
  private String csrfToken = "";

  private ContentImporter(String baseUrl) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
  }

  public static void main(String[] args) throws Exception {
    String baseUrl = "http://localhost:8080";
    String email = System.getenv("CERTFORGE_EMAIL");
    String password = System.getenv("CERTFORGE_PASSWORD");
    Path pack = Path.of("content", "java-se-21");
    boolean dryRun = false;
    for (int i = 0; i < args.length; i++) {
      switch (args[i]) {
        case "--base-url" -> baseUrl = args[++i];
        case "--email" -> email = args[++i];
        case "--password" -> password = args[++i];
        case "--pack" -> pack = Path.of(args[++i]);
        case "--dry-run" -> dryRun = true;
        default -> fail("Unknown option " + args[i]);
      }
    }
    if (!dryRun && (email == null || password == null)) {
      fail("Provide --email and --password (or CERTFORGE_EMAIL and CERTFORGE_PASSWORD)");
    }

    List<Path> dirs;
    try (Stream<Path> listing = Files.list(pack)) {
      dirs = listing.filter(Files::isDirectory).sorted().toList();
    }
    ContentImporter importer = new ContentImporter(baseUrl);
    Set<String> existing = new HashSet<>();
    if (!dryRun) {
      importer.signIn(email, password);
      existing.addAll(importer.existingPrompts());
    }

    int created = 0;
    int skipped = 0;
    for (Path dir : dirs) {
      String body = render(dir);
      String prompt = unescape(firstGroup(PROMPT, body, "prompt in " + dir));
      if (existing.contains(prompt)) {
        System.out.println("skip    " + dir.getFileName() + " (already present)");
        skipped++;
        continue;
      }
      if (dryRun) {
        System.out.println("would import " + dir.getFileName());
        created++;
        continue;
      }
      String response = importer.post("/api/admin/questions", body);
      String revisionId = firstGroup(FIRST_REVISION_ID, response, "revision id for " + dir);
      importer.post("/api/admin/question-revisions/" + revisionId + "/submit", null);
      System.out.println("import  " + dir.getFileName() + " -> review (" + revisionId + ")");
      created++;
    }
    System.out.println("created=" + created + " skipped=" + skipped + " total=" + dirs.size());
  }

  /**
   * The request body for one question: the verified snippet placed into the prompt, and the
   * evidence behind the answer attached.
   */
  static String render(Path dir) throws IOException {
    String json = Files.readString(dir.resolve("question.json"), StandardCharsets.UTF_8);
    if (json.contains(SNIPPET)) {
      Path main = dir.resolve("Main.java");
      if (!Files.exists(main)) {
        fail(dir + " uses " + SNIPPET + " but has no Main.java");
      }
      String code = Files.readString(main, StandardCharsets.UTF_8).strip();
      json = json.replace(SNIPPET, escape(code));
    }
    return withVerification(json, dir);
  }

  /**
   * Attaches the programme the build compiles and what it printed.
   *
   * <p>Every source under the question's directory, not only the file the learner reads: seven
   * questions in the Java pack are a module graph, and for those the entry point alone would say
   * the least. Sorted by path, which is the order the pack's own tooling uses, so the two agree.
   *
   * <p>A question with neither sources nor a recorded output gets nothing, because a question
   * without a programme has no evidence — which is different from evidence that is empty.
   */
  static String withVerification(String json, Path dir) throws IOException {
    List<Path> sources;
    try (Stream<Path> walk = Files.walk(dir)) {
      sources =
          walk.filter(path -> path.getFileName().toString().endsWith(".java"))
              .sorted()
              .toList();
    }
    Path expectedFile = dir.resolve("expected.txt");
    String output =
        Files.exists(expectedFile)
            ? Files.readString(expectedFile, StandardCharsets.UTF_8).stripTrailing()
            : null;
    if (sources.isEmpty() && output == null) {
      return json;
    }

    StringBuilder files = new StringBuilder();
    for (Path source : sources) {
      if (!files.isEmpty()) {
        files.append(',');
      }
      String path = dir.relativize(source).toString().replace('\\', '/');
      String body = Files.readString(source, StandardCharsets.UTF_8).stripTrailing();
      files.append("{\"path\":\"").append(escape(path)).append("\",\"body\":\"")
          .append(escape(body)).append("\"}");
    }

    StringBuilder verification = new StringBuilder(",\"verification\":{\"files\":[");
    verification.append(files).append(']');
    if (output != null) {
      verification.append(",\"output\":\"").append(escape(output)).append('"');
    }
    verification.append('}');

    int close = json.lastIndexOf('}');
    if (close < 0) {
      fail(dir + " has a question.json that is not a JSON object");
    }
    return json.substring(0, close) + verification + json.substring(close);
  }

  private void signIn(String email, String password) throws Exception {
    HttpResponse<String> csrf = send(HttpRequest.newBuilder(uri("/api/auth/csrf")).GET().build());
    ensureOk(csrf, "csrf");
    csrfHeader = firstGroup(Pattern.compile("\"headerName\"\\s*:\\s*\"([^\"]+)\""), csrf.body(), "csrf header");
    csrfToken = firstGroup(Pattern.compile("\"token\"\\s*:\\s*\"([^\"]+)\""), csrf.body(), "csrf token");
    post("/api/auth/login", "{\"email\":\"" + escape(email) + "\",\"password\":\"" + escape(password) + "\"}");
  }

  private List<String> existingPrompts() throws Exception {
    HttpResponse<String> response =
        send(HttpRequest.newBuilder(uri("/api/admin/questions")).GET().build());
    ensureOk(response, "list questions");
    List<String> prompts = new ArrayList<>();
    Matcher matcher = PROMPT.matcher(response.body());
    while (matcher.find()) {
      prompts.add(unescape(matcher.group(1)));
    }
    return prompts;
  }

  private String post(String path, String body) throws Exception {
    HttpRequest.Builder request =
        HttpRequest.newBuilder(uri(path)).header(csrfHeader, csrfToken);
    if (body == null) {
      request.POST(HttpRequest.BodyPublishers.noBody());
    } else {
      request
          .header("Content-Type", "application/json")
          .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8));
    }
    HttpResponse<String> response = send(request.build());
    ensureOk(response, "POST " + path);
    return response.body();
  }

  private HttpResponse<String> send(HttpRequest request) throws Exception {
    return client.send(request, HttpResponse.BodyHandlers.ofString());
  }

  private URI uri(String path) {
    return URI.create(baseUrl + path);
  }

  private static void ensureOk(HttpResponse<String> response, String what) {
    if (response.statusCode() / 100 != 2) {
      fail(what + " failed with HTTP " + response.statusCode() + ": " + response.body());
    }
  }

  private static String firstGroup(Pattern pattern, String text, String what) {
    Matcher matcher = pattern.matcher(text);
    if (!matcher.find()) {
      fail("Could not find " + what);
    }
    return matcher.group(1);
  }

  /** Escapes text for inclusion inside a JSON string literal. */
  static String escape(String text) {
    StringBuilder out = new StringBuilder(text.length() + 16);
    for (char c : text.toCharArray()) {
      switch (c) {
        case '"' -> out.append("\\\"");
        case '\\' -> out.append("\\\\");
        case '\n' -> out.append("\\n");
        case '\r' -> out.append("\\r");
        case '\t' -> out.append("\\t");
        default -> {
          if (c < 0x20) {
            out.append(String.format("\\u%04x", (int) c));
          } else {
            out.append(c);
          }
        }
      }
    }
    return out.toString();
  }

  /** Reverses {@link #escape} and the other standard JSON string escapes. */
  static String unescape(String text) {
    StringBuilder out = new StringBuilder(text.length());
    for (int i = 0; i < text.length(); i++) {
      char c = text.charAt(i);
      if (c != '\\') {
        out.append(c);
        continue;
      }
      char next = text.charAt(++i);
      switch (next) {
        case 'n' -> out.append('\n');
        case 'r' -> out.append('\r');
        case 't' -> out.append('\t');
        case 'b' -> out.append('\b');
        case 'f' -> out.append('\f');
        case 'u' -> {
          out.append((char) Integer.parseInt(text.substring(i + 1, i + 5), 16));
          i += 4;
        }
        default -> out.append(next);
      }
    }
    return out.toString();
  }

  private static void fail(String message) {
    System.err.println("error: " + message);
    System.exit(1);
  }
}
