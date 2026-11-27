import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useId, useRef, useState } from "react";
import { useText } from "../i18n/useText";

type ConnectionStatus = "connecting" | "open" | "closed" | "error";

/**
 * `interactiveUrl` is either a path on this backend (the two labs {@code ContainerLabOrchestrator}
 * temporarily runs) or a full external URL (Vercel's own controller-hosted PTY for every other
 * lab) -- both are a plain WebSocket relaying whatever the learner types to the lab's shell and
 * writing back whatever it prints, so one client handles both the same way.
 *
 * The external case is already `ws:`/`wss:`, never `http:`/`https:` -- only the relative-path
 * case needs a scheme assigned at all, from the page's own. Converting unconditionally (as an
 * earlier version of this function did) would downgrade an already-secure `wss:` URL to `ws:`,
 * which browsers refuse to open from an `https:` page as mixed content.
 */
function webSocketUrl(interactiveUrl: string, interactiveToken: string): string {
  const absolute = new URL(interactiveUrl, window.location.href);
  if (absolute.protocol === "http:") {
    absolute.protocol = "ws:";
  } else if (absolute.protocol === "https:") {
    absolute.protocol = "wss:";
  }
  absolute.searchParams.set("token", interactiveToken);
  return absolute.toString();
}

/** xterm renders to a canvas, so it cannot read a CSS custom property directly; this copies the
 * three tokens its theme needs from the page's own computed style, light or dark, whichever is
 * active right now. */
function themeFromTokens(): { background: string; foreground: string; cursor: string } {
  const page = getComputedStyle(document.documentElement);
  return {
    background: page.getPropertyValue("--surface").trim(),
    foreground: page.getPropertyValue("--text").trim(),
    cursor: page.getPropertyValue("--accent").trim(),
  };
}

export function LabTerminal({
  interactiveUrl,
  interactiveToken,
}: {
  interactiveUrl: string;
  interactiveToken: string;
}) {
  const t = useText();
  const headingId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const term = new Terminal({
      convertEol: true,
      cursorBlink: true,
      // Matches --font-code (tokens.css); xterm paints to a canvas, so it cannot read the
      // custom property itself.
      fontFamily: '"JetBrains Mono", ui-monospace, "Cascadia Mono", Consolas, monospace',
      theme: themeFromTokens(),
      // xterm's own built-in accessibility helper: a live, off-screen buffer a screen reader can
      // read, kept in step with what the sighted terminal shows. It is not a substitute for a
      // human assistive-technology walkthrough of a live interactive shell (see labs.terminalScreenReaderNote).
      screenReaderMode: true,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(node);
    fit.fit();

    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      term.options.theme = themeFromTokens();
    };
    scheme.addEventListener("change", applyTheme);

    const socket = new WebSocket(webSocketUrl(interactiveUrl, interactiveToken));
    setStatus("connecting");

    socket.onopen = () => setStatus("open");
    socket.onclose = () => setStatus("closed");
    socket.onerror = () => setStatus("error");
    socket.onmessage = (event: MessageEvent<string>) => term.write(event.data);
    const dataSubscription = term.onData((data) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(data);
      }
    });

    const resize = new ResizeObserver(() => fit.fit());
    resize.observe(node);

    return () => {
      scheme.removeEventListener("change", applyTheme);
      dataSubscription.dispose();
      resize.disconnect();
      socket.close();
      term.dispose();
    };
  }, [interactiveUrl, interactiveToken]);

  const statusText = {
    connecting: t.labs.terminalConnecting,
    open: t.labs.terminalOpen,
    closed: t.labs.terminalClosed,
    error: t.labs.terminalError,
  }[status];

  return (
    <section aria-labelledby={headingId} className="panel lab-terminal">
      <h2 id={headingId} className="eyebrow">
        {t.labs.terminal}
      </h2>
      <p role="status" className="hint">
        {statusText}
      </p>
      <p className="hint">{t.labs.terminalScreenReaderNote}</p>
      <div ref={containerRef} className="lab-terminal-surface" />
    </section>
  );
}
