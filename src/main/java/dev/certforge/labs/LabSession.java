package dev.certforge.labs;

/**
 * A started lab session, handed once to whoever started it. {@code interactiveToken} is a one-time
 * credential for the learner's own browser to connect directly to Vercel's controller-hosted PTY
 * (ADR 0029) -- this project's backend does not hold it once it is returned, and never relays the
 * connection it opens.
 */
public record LabSession(
    String sessionId, String labId, String interactiveUrl, String interactiveToken) {}
