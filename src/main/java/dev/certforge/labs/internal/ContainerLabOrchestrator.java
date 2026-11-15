package dev.certforge.labs.internal;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.labs.LabCatalog;
import dev.certforge.labs.LabCheckResult;
import dev.certforge.labs.LabEvaluationCheck;
import dev.certforge.labs.LabSession;
import dev.certforge.labs.LabSpec;
import dev.certforge.labs.LabVerdict;
import dev.certforge.labs.internal.DockerCliClient.ExecResult;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

/**
 * {@link dev.certforge.labs.LabOrchestrator} for the two Kubernetes labs, temporarily, over a plain
 * Docker container instead of a microVM (ADR 0030) -- {@code LabOrchestratorRouter} is the only
 * {@code LabOrchestrator} bean; this class is not one itself, so the two engines can be injected
 * into it by concrete type without Spring DI ambiguity.
 *
 * <p>Unlike {@link SandboxLabOrchestrator}, there is no vendor-hosted interactive terminal here --
 * this project's own backend is in the byte path of the learner's session, through {@code
 * LabTerminalWebSocketHandler}. It relays bytes only; {@code lab-shell}, unmodified from ADR 0029,
 * still does all of the actual enforcement, inside the container.
 */
@Component
class ContainerLabOrchestrator {

  private static final Logger log = LoggerFactory.getLogger(ContainerLabOrchestrator.class);

  static final Set<String> SUPPORTED_LAB_IDS =
      Set.of("readiness-probe-wrong-port-v1", "service-selector-mismatch-v1");

  private static final String IMAGE_TAG = "certforge-k8s-container-lab";
  private static final int PIDS_LIMIT = 2048;
  private static final String KUBECONFIG_PATH = "/home/learner/kubeconfig";
  private static final String LEARNER_USER = "learner";

  /**
   * The exact shape {@code docker run -d}'s own stdout returns (a full 64-character hex id) --
   * every caller-supplied {@code sessionId}/{@code containerId} is checked against this before it
   * can reach a {@code docker} argv this class builds, at the method boundaries below. The
   * subsequent {@code sessionsById} map lookup already rejects an id nobody started, but a static
   * analyzer's taint tracking does not model "exact match against a trusted key set" as sanitizing
   * -- this is the explicit check that does, and it is real defense in depth regardless: an
   * attacker-chosen string could otherwise reach the `docker` CLI as an argument docker itself
   * might interpret as a flag rather than a positional id, not just as a map key that simply
   * misses.
   */
  private static final Pattern CONTAINER_ID = Pattern.compile("^[0-9a-f]{64}$");

  private static final String KIND_CONFIG =
      """
      kind: Cluster
      apiVersion: kind.x-k8s.io/v1alpha4
      nodes:
        - role: control-plane
          extraMounts:
            - hostPath: /dev/null
              containerPath: /dev/kmsg
      """;

  /**
   * {@code containerId} is stored here, not just re-derived from a caller's own parameter at use --
   * {@code complete}/{@code openTerminal} pass this stored value to {@code DockerCliClient}, never
   * the raw {@code sessionId}/{@code containerId} parameter they were called with, even though the
   * two are always equal by construction (this is always put under its own {@code containerId} as
   * the map key). A static taint analysis (CodeQL's java/command-line-injection query, which
   * flagged this) does not recognize a map-lookup success as sanitizing a parameter that is then
   * forwarded unchanged; sourcing the value that actually reaches the {@code docker} CLI from this
   * record field instead -- itself only ever set from {@code docker.run()}'s own stdout at {@link
   * #start} -- breaks that taint chain for real, not only at runtime.
   */
  private record StartedSession(
      String containerId,
      String labId,
      ActorId learner,
      String terminalToken,
      ScheduledFuture<?> timeoutReaper) {}

  private final LabCatalog catalog;
  private final DockerCliClient docker;
  private final CurrentActor currentActor;
  private final ScheduledExecutorService reaper;
  private final Map<String, StartedSession> sessionsById = new ConcurrentHashMap<>();
  private final SecureRandom random = new SecureRandom();
  private volatile boolean imageBuilt = false;

  /**
   * {@code reaper} is injected, not created as a field initializer, so a test can observe the
   * timeout path actually firing (e.g. {@code verify(docker, timeout(millis)).remove(containerId)}
   * against a real short-lived executor) rather than only that {@code schedule} was called with the
   * right delay.
   */
  ContainerLabOrchestrator(
      LabCatalog catalog,
      DockerCliClient docker,
      CurrentActor currentActor,
      ScheduledExecutorService reaper) {
    this.catalog = catalog;
    this.docker = docker;
    this.currentActor = currentActor;
    this.reaper = reaper;
  }

  LabSession start(String labId) {
    LabSpec spec = requireLab(labId);
    ensureImageBuilt();
    String containerId = docker.run(runFlagsFor(spec), IMAGE_TAG);
    try {
      waitForNestedDockerDaemon(containerId);
      provisionCluster(containerId, spec);
      String token = randomToken();
      ScheduledFuture<?> timeoutReaper =
          reaper.schedule(
              () -> {
                log.info("lab session timed out labId={} sessionId={}", labId, containerId);
                docker.remove(containerId);
              },
              spec.sandbox().timeoutSeconds(),
              TimeUnit.SECONDS);
      sessionsById.put(
          containerId,
          new StartedSession(containerId, labId, currentActor.require(), token, timeoutReaper));
      log.info("lab session started labId={} sessionId={}", labId, containerId);
      return new LabSession(
          containerId, labId, "/api/labs/sessions/" + containerId + "/terminal", token);
    } catch (RuntimeException e) {
      log.warn("lab session provisioning failed labId={} sessionId={}", labId, containerId, e);
      docker.remove(containerId);
      throw e;
    }
  }

  /**
   * @throws NoSuchElementException if no session was started under that id, or it was started by a
   *     different learner -- the same outcome either way, matching {@link
   *     SandboxLabOrchestrator#complete}'s anti-enumeration property.
   */
  LabVerdict complete(String sessionId) {
    if (!CONTAINER_ID.matcher(sessionId).matches()) {
      throw noSuchSession(sessionId);
    }
    StartedSession session = sessionsById.get(sessionId);
    if (session == null || !session.learner().equals(currentActor.require())) {
      throw noSuchSession(sessionId);
    }
    sessionsById.remove(sessionId);
    session.timeoutReaper().cancel(false);
    String trustedContainerId = session.containerId();
    try {
      LabSpec spec = requireLab(session.labId());
      LabVerdict verdict = grade(trustedContainerId, spec);
      log.info(
          "lab session completed labId={} sessionId={} passed={} checksPassed={}/{}",
          session.labId(),
          trustedContainerId,
          verdict.passed(),
          verdict.checks().stream().filter(LabCheckResult::passed).count(),
          verdict.checks().size());
      return verdict;
    } finally {
      docker.remove(trustedContainerId);
    }
  }

  /**
   * Whether {@code containerId} is a live session belonging to the current actor, for the terminal
   * bridge.
   */
  boolean ownedByCurrentActor(String containerId, String token) {
    if (!CONTAINER_ID.matcher(containerId).matches()) {
      return false;
    }
    StartedSession session = sessionsById.get(containerId);
    return session != null
        && session.learner().equals(currentActor.require())
        && session.terminalToken().equals(token);
  }

  /**
   * @throws NoSuchElementException if {@code containerId} is not a live session -- the handshake
   *     interceptor already calls {@link #ownedByCurrentActor} first, so this should be unreachable
   *     in practice; looked up again here anyway, since the value this passes to {@code
   *     DockerCliClient} must come from the stored session, not the raw parameter (see {@code
   *     StartedSession}'s own javadoc for why).
   */
  Process openTerminal(String containerId) {
    if (!CONTAINER_ID.matcher(containerId).matches()) {
      throw noSuchSession(containerId);
    }
    StartedSession session = sessionsById.get(containerId);
    if (session == null) {
      throw noSuchSession(containerId);
    }
    return docker.execInteractive(session.containerId(), LEARNER_USER, List.of("lab-shell"));
  }

  private LabVerdict grade(String containerId, LabSpec spec) {
    List<LabCheckResult> results = new ArrayList<>();
    Duration timeout = Duration.ofSeconds(spec.sandbox().timeoutSeconds());
    for (LabEvaluationCheck check : spec.evaluation().checks()) {
      ExecResult result =
          docker.exec(containerId, timeout, null, List.of("sh", "-c", check.probe()));
      results.add(new LabCheckResult(check.description(), result.exitCode() == 0));
    }
    boolean passed = results.stream().allMatch(LabCheckResult::passed);
    return new LabVerdict(passed, List.copyOf(results));
  }

  private void provisionCluster(String containerId, LabSpec spec) {
    docker.writeFile(
        containerId, "/tmp/kind-config.yaml", KIND_CONFIG.getBytes(StandardCharsets.UTF_8));
    runRoot(
        containerId,
        // Observed taking well over 3 minutes under heavy host contention (many unrelated
        // containers already running on the same Docker daemon) -- 5 minutes gives real headroom
        // without masking a genuine hang (kindest/node's own image pull plus control-plane
        // bring-up has never needed anywhere near this long when the host is otherwise idle).
        Duration.ofMinutes(5),
        "kind",
        "create",
        "cluster",
        "--name",
        "lab",
        "--config",
        "/tmp/kind-config.yaml");
    runRoot(
        containerId,
        Duration.ofSeconds(30),
        "sh",
        "-c",
        "kind get kubeconfig --name lab > "
            + KUBECONFIG_PATH
            + " && chown "
            + LEARNER_USER
            + ":"
            + LEARNER_USER
            + " "
            + KUBECONFIG_PATH);
    runRoot(
        containerId,
        Duration.ofMinutes(1),
        "sh",
        "-c",
        "tar -C /opt/web-lab-rootfs -cf - . | docker import --change 'CMD [\"httpd\",\"-f\",\"-p\",\"8080\",\"-h\",\"/www\"]' - web:lab"
            + " && docker tag web:lab web-backend:lab"
            + " && kind load docker-image web:lab --name lab"
            + " && kind load docker-image web-backend:lab --name lab");
    runRoot(
        containerId,
        Duration.ofSeconds(30),
        "kubectl",
        "apply",
        "-f",
        "/opt/fixtures/" + spec.fixture().path() + "/",
        "--validate=false");
  }

  private void runRoot(String containerId, Duration timeout, String... command) {
    ExecResult result = docker.exec(containerId, timeout, null, List.of(command));
    if (result.exitCode() != 0) {
      throw new IllegalStateException(
          "provisioning step failed (" + String.join(" ", command) + "): " + result.output());
    }
  }

  /**
   * {@code docker:dind}'s own entrypoint starts {@code dockerd} as the container's main process
   * (ADR 0030) -- this polls for it to actually be reachable rather than assuming it is the instant
   * the container reports running.
   */
  private void waitForNestedDockerDaemon(String containerId) {
    Duration budget = Duration.ofSeconds(30);
    long deadline = System.nanoTime() + budget.toNanos();
    while (System.nanoTime() < deadline) {
      ExecResult result =
          docker.exec(containerId, Duration.ofSeconds(5), null, List.of("docker", "info"));
      if (result.exitCode() == 0) {
        return;
      }
      try {
        Thread.sleep(500);
      } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
        throw new IllegalStateException("interrupted waiting for nested dockerd", e);
      }
    }
    throw new IllegalStateException("nested dockerd never became reachable in " + budget);
  }

  /**
   * Resource limits enforced by this project's own code (ADR 0030 decision 2) -- there is no
   * platform doing it automatically this time. {@code vcpus}/memory follow the same convention
   * {@code VercelSandboxClient} uses (2 GiB per vCPU); {@code pidsLimit} has no {@code LabSpec}
   * field (ADR 0028 removed it as a schema concept) and is this orchestrator's own fixed choice,
   * confirmed sufficient for a full kind cluster by direct testing.
   */
  private static final List<String> CAPABILITIES =
      List.of("SYS_ADMIN", "NET_ADMIN", "SYS_RESOURCE", "SYS_PTRACE");

  private List<String> runFlagsFor(LabSpec spec) {
    int vcpus = spec.sandbox().vcpus();
    List<String> flags = new ArrayList<>();
    flags.add("--cgroupns=host");
    flags.add("-v");
    flags.add("/sys/fs/cgroup:/sys/fs/cgroup:rw");
    for (String capability : CAPABILITIES) {
      flags.add("--cap-add");
      flags.add(capability);
    }
    flags.addAll(
        List.of(
            "--security-opt",
            "seccomp=unconfined",
            "--security-opt",
            "apparmor=unconfined",
            "--sysctl",
            "net.ipv6.conf.all.forwarding=1",
            "--sysctl",
            "net.ipv6.conf.default.forwarding=1",
            "--memory",
            (vcpus * 2) + "g",
            "--cpus",
            String.valueOf(vcpus),
            "--pids-limit",
            String.valueOf(PIDS_LIMIT),
            "-e",
            "DOCKER_TLS_CERTDIR="));
    return flags;
  }

  /**
   * Builds the shared image once per application instance, lazily on first use -- there is no
   * separate startup hook for this, and nothing else needs the image built before a session for one
   * of these two labs is actually started.
   */
  private synchronized void ensureImageBuilt() {
    if (imageBuilt || docker.imageExists(IMAGE_TAG)) {
      imageBuilt = true;
      return;
    }
    Path buildContext = extractBuildContext();
    docker.build(
        buildContext.resolve("image/k8s-container-lab/Dockerfile").toString(),
        buildContext.toString(),
        IMAGE_TAG);
    imageBuilt = true;
  }

  /**
   * {@code docker build} needs a real directory on disk; the Dockerfile and the fixtures it bakes
   * in live as classpath resources once this module runs from a packaged jar, not as plain files --
   * this copies exactly the files that Dockerfile's {@code COPY} instructions need, laid out at the
   * same relative paths, into a temporary build context.
   */
  private Path extractBuildContext() {
    try {
      Path dir = Files.createTempDirectory("certforge-k8s-lab-build");
      copyResource(
          "labs/image/k8s-container-lab/Dockerfile",
          dir.resolve("image/k8s-container-lab/Dockerfile"));
      copyResource(
          "labs/image/docker-multistage-bloat-v1/lab-shell",
          dir.resolve("image/docker-multistage-bloat-v1/lab-shell"));
      copyResource(
          "labs/fixtures/readiness-probe-wrong-port-v1/deployment.yaml",
          dir.resolve("fixtures/readiness-probe-wrong-port-v1/deployment.yaml"));
      copyResource(
          "labs/fixtures/service-selector-mismatch-v1/deployment.yaml",
          dir.resolve("fixtures/service-selector-mismatch-v1/deployment.yaml"));
      copyResource(
          "labs/fixtures/service-selector-mismatch-v1/service.yaml",
          dir.resolve("fixtures/service-selector-mismatch-v1/service.yaml"));
      return dir;
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  private static void copyResource(String classpathPath, Path dest) throws IOException {
    Files.createDirectories(dest.getParent());
    try (InputStream in = new ClassPathResource(classpathPath).getInputStream()) {
      Files.copy(in, dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
    }
  }

  private String randomToken() {
    byte[] bytes = new byte[24];
    random.nextBytes(bytes);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
  }

  private static NoSuchElementException noSuchSession(String id) {
    return new NoSuchElementException("no session " + id);
  }

  private LabSpec requireLab(String labId) {
    return catalog
        .findByLabId(labId)
        .orElseThrow(() -> new NoSuchElementException("no lab named " + labId));
  }
}
