package dev.certforge.labs.internal;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * Relays bytes between the learner's browser and {@code docker exec -it <container> lab-shell} (ADR
 * 0030) -- this is this project's own backend sitting in a learner's terminal byte path for the
 * first time since ADR 0029 (Vercel Sandbox's {@code openInteractive()} never needed one).
 * Deliberately narrow: this class decides nothing about what the learner types. It never inspects a
 * message's content beyond moving it between the socket and the process -- {@code lab-shell},
 * unmodified, still does the only enforcement that matters, inside the container, at `exec` time.
 */
@Component
class LabTerminalWebSocketHandler extends TextWebSocketHandler {

  private final ContainerLabOrchestrator orchestrator;
  private final Map<String, Process> processesBySessionId = new ConcurrentHashMap<>();
  private final ExecutorService readers = Executors.newVirtualThreadPerTaskExecutor();

  LabTerminalWebSocketHandler(ContainerLabOrchestrator orchestrator) {
    this.orchestrator = orchestrator;
  }

  @Override
  public void afterConnectionEstablished(WebSocketSession session) {
    String containerId =
        (String) session.getAttributes().get(LabTerminalHandshakeInterceptor.SESSION_ID_ATTRIBUTE);
    Process process = orchestrator.openTerminal(containerId);
    processesBySessionId.put(session.getId(), process);
    readers.submit(() -> relayProcessOutput(session, process));
  }

  // PMD.CloseResource: stdin is the process's own, owned for the process's whole lifetime -- it
  // must not be closed here, only written to; the process itself (and this stream with it) is
  // closed in afterConnectionClosed.
  @SuppressWarnings("PMD.CloseResource")
  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message) {
    Process process = processesBySessionId.get(session.getId());
    if (process == null || !process.isAlive()) {
      closeQuietly(session);
      return;
    }
    try {
      OutputStream stdin = process.getOutputStream();
      stdin.write(message.getPayload().getBytes(StandardCharsets.UTF_8));
      stdin.flush();
    } catch (IOException e) {
      closeQuietly(session);
    }
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
    Process process = processesBySessionId.remove(session.getId());
    if (process != null) {
      process.destroy();
    }
  }

  // PMD.EmptyCatchBlock: the process ending or the socket dropping mid-read both mean the same
  // thing here -- nothing left to relay -- and both fall through to closing the session in the
  // finally block below; there is nothing more useful to do with either than closing quietly.
  //
  // Reads through an InputStreamReader, not a raw byte buffer decoded per-chunk: a multi-byte
  // UTF-8 character split across a 4096-byte read boundary would otherwise come out garbled --
  // InputStreamReader keeps the decoder's state across calls, so a split character is completed
  // correctly on the next read instead.
  @SuppressWarnings("PMD.EmptyCatchBlock")
  private void relayProcessOutput(WebSocketSession session, Process process) {
    try (Reader stdout = new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8)) {
      char[] buffer = new char[4096];
      int read = stdout.read(buffer);
      while (read != -1) {
        if (!session.isOpen()) {
          break;
        }
        session.sendMessage(new TextMessage(new String(buffer, 0, read)));
        read = stdout.read(buffer);
      }
    } catch (IOException e) {
      // see @SuppressWarnings above
    } finally {
      closeQuietly(session);
    }
  }

  // PMD.EmptyCatchBlock: the session is going away regardless of whether this close itself
  // succeeds, so there is nothing more useful this best-effort cleanup can do with the exception.
  @SuppressWarnings("PMD.EmptyCatchBlock")
  private static void closeQuietly(WebSocketSession session) {
    try {
      if (session.isOpen()) {
        session.close();
      }
    } catch (IOException e) {
      // see @SuppressWarnings above
    }
  }
}
