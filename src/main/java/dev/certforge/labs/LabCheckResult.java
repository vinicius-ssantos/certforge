package dev.certforge.labs;

/**
 * One {@link LabEvaluationCheck}'s outcome, as the grader -- never the learner's shell -- found it
 * (ADR 0027 decision 4).
 */
public record LabCheckResult(String description, boolean passed) {}
