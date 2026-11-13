package dev.certforge.labs;

/**
 * Hard caps the Vercel Sandbox platform enforces on a lab's microVM (ADR 0028), the primary
 * isolation boundary -- in-guest cgroups are defense in depth only. Every field is required: there
 * is no implicit default that widens access.
 *
 * <p>{@code vcpus} must be {@code 1} or an even number up to the plan ceiling; memory is fixed at
 * 2 GiB per vCPU by the platform and is not a separate field here. There is no platform-level
 * quota for disk below its 64 GB/session ceiling, and no process-count cap at all -- a lab
 * needing either bound must check it itself, as a grader probe, not as a {@code LabSpec} field.
 *
 * <p>{@code persistent} must be {@code false}, written out rather than left to default, the same
 * way every other field here is explicit: a session is never resumed and never reused across
 * learners or across attempts (ADR 0028 decision 2). This record exists specifically so the
 * orchestrator can refuse a spec that gets this wrong, rather than trusting the platform's own
 * default (which is {@code true}).
 */
public record LabSandbox(Integer vcpus, Integer timeoutSeconds, Boolean persistent) {}
