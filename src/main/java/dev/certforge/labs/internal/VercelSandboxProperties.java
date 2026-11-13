package dev.certforge.labs.internal;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Credentials and defaults for calling the Vercel Sandbox REST API directly (ADR 0028) -- no JVM
 * SDK exists, so this project's backend is its own caller rather than a Node.js sidecar.
 *
 * <p>{@code token}/{@code teamId}/{@code projectId} name the same values the Vercel Sandbox SDK
 * itself reads from {@code VERCEL_TOKEN}/{@code VERCEL_TEAM_ID}/{@code VERCEL_PROJECT_ID} for
 * external callers, so operators who already know those names recognize these.
 */
@ConfigurationProperties("certforge.labs.vercel")
record VercelSandboxProperties(String token, String teamId, String projectId) {}
