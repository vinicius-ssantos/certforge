package dev.certforge.labs;

/**
 * A started lab session, handed once to whoever started it. For most labs, {@code interactiveUrl}
 * and {@code interactiveToken} are Vercel's own controller-hosted PTY credential (ADR 0029) -- this
 * project's backend does not hold the token once it is returned, and never relays that connection.
 * For the two labs ADR 0030 temporarily runs over a plain container, {@code interactiveUrl} is this
 * project's own terminal bridge path instead, and {@code interactiveToken} is a one-time credential
 * that bridge itself checks at its WebSocket handshake.
 */
public record LabSession(
    String sessionId, String labId, String interactiveUrl, String interactiveToken) {}
