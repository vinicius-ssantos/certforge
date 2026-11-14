package dev.certforge.labs.internal;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import org.springframework.stereotype.Component;

/**
 * A thin wrapper over the local {@code docker} CLI, shelling out via {@link ProcessBuilder} --
 * never through a shell, so arguments are passed exactly as given (ADR 0030). This is this
 * project's own Docker daemon, never the host's for a learner's session (ADR 0030 decision 2):
 * every container this starts nests its own {@code dockerd} inside it.
 */
@Component
class DockerCliClient {

  private static final String DOCKER = "docker";

  /** {@code output} is stdout and stderr merged, in the order the process actually wrote them. */
  record ExecResult(int exitCode, String output) {}

  /** Starts a detached container and returns its id. */
  String run(List<String> runFlags, String image) {
    List<String> command = new ArrayList<>();
    command.add(DOCKER);
    command.add("run");
    command.add("-d");
    command.addAll(runFlags);
    command.add(image);
    ExecResult result = exec(command, Duration.ofSeconds(30), null);
    if (result.exitCode() != 0) {
      throw new DockerCommandException("docker run", result);
    }
    return result.output().trim();
  }

  /** Runs one command inside a running container and waits up to {@code timeout} for it to exit. */
  ExecResult exec(String containerId, Duration timeout, String user, List<String> command) {
    List<String> full = new ArrayList<>();
    full.add(DOCKER);
    full.add("exec");
    if (user != null) {
      full.add("-u");
      full.add(user);
    }
    full.add(containerId);
    full.addAll(command);
    return exec(full, timeout, null);
  }

  /** Writes {@code content} to {@code destPath} inside the container, as {@code root}. */
  void writeFile(String containerId, String destPath, byte[] content) {
    List<String> command =
        List.of(DOCKER, "exec", "-i", containerId, "sh", "-c", "cat > " + destPath);
    ExecResult result = exec(command, Duration.ofSeconds(30), content);
    if (result.exitCode() != 0) {
      throw new DockerCommandException("docker exec (writeFile " + destPath + ")", result);
    }
  }

  /**
   * Builds an image from a local build context. Takes longer than this class's other calls (image
   * layers, not a single command), so it gets its own generous timeout.
   */
  void build(String dockerfilePath, String buildContextDir, String tag) {
    List<String> command =
        List.of(DOCKER, "build", "-f", dockerfilePath, "-t", tag, buildContextDir);
    ExecResult result = exec(command, Duration.ofMinutes(5), null);
    if (result.exitCode() != 0) {
      throw new DockerCommandException("docker build", result);
    }
  }

  /** Whether an image with this tag already exists locally. */
  boolean imageExists(String tag) {
    ExecResult result =
        exec(List.of(DOCKER, "image", "inspect", tag), Duration.ofSeconds(10), null);
    return result.exitCode() == 0;
  }

  /**
   * Starts a raw, attached process for an interactive {@code docker exec} -- the caller owns the
   * process's stdin/stdout for as long as the learner's terminal session lasts. Never used for
   * anything this class's own callers grade or depend on the exit code of.
   */
  Process execInteractive(String containerId, String user, List<String> command) {
    List<String> full = new ArrayList<>();
    full.add(DOCKER);
    full.add("exec");
    full.add("-i");
    full.add("-t");
    if (user != null) {
      full.add("-u");
      full.add(user);
    }
    full.add(containerId);
    full.addAll(command);
    try {
      return new ProcessBuilder(full).redirectErrorStream(true).start();
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  /**
   * Force-removes a container unconditionally (ADR 0027 decision 5 / ADR 0030 decision 2) --
   * best-effort, since this is always called from a {@code finally} block or a timeout reaper and
   * must never itself throw past a session already ending.
   */
  void remove(String containerId) {
    exec(List.of(DOCKER, "rm", "-f", containerId), Duration.ofSeconds(30), null);
  }

  /**
   * stdout and stderr are merged ({@code redirectErrorStream}) and drained from a single background
   * thread before {@code waitFor} -- draining two separate streams sequentially on the calling
   * thread risks a classic deadlock (the child blocks writing to the one pipe not yet being read
   * while this thread is still draining the other), and {@code kind create cluster}'s own output is
   * large enough in practice to fill a pipe buffer and hit exactly that.
   */
  private ExecResult exec(List<String> command, Duration timeout, byte[] stdin) {
    try {
      Process process = new ProcessBuilder(command).redirectErrorStream(true).start();
      if (stdin != null) {
        try (OutputStream out = process.getOutputStream()) {
          out.write(stdin);
        }
      } else {
        process.getOutputStream().close();
      }
      Future<ByteArrayOutputStream> outputFuture =
          OUTPUT_READER.submit(() -> drain(process.getInputStream()));
      boolean exited = process.waitFor(timeout.toMillis(), TimeUnit.MILLISECONDS);
      if (!exited) {
        process.destroyForcibly();
        throw new IllegalStateException(
            "docker command timed out after " + timeout + ": " + String.join(" ", command));
      }
      String output = outputFuture.get(5, TimeUnit.SECONDS).toString(StandardCharsets.UTF_8);
      return new ExecResult(process.exitValue(), output);
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new IllegalStateException("interrupted running: " + String.join(" ", command), e);
    } catch (ExecutionException | TimeoutException e) {
      throw new IllegalStateException("failed reading output of: " + String.join(" ", command), e);
    }
  }

  private static ByteArrayOutputStream drain(InputStream in) throws IOException {
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    in.transferTo(out);
    return out;
  }

  private static final ExecutorService OUTPUT_READER = Executors.newVirtualThreadPerTaskExecutor();

  static final class DockerCommandException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    DockerCommandException(String what, ExecResult result) {
      super(what + " failed (exit " + result.exitCode() + "): " + result.output());
    }
  }
}
