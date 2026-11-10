package dev.certforge.labs;

/**
 * One read-only inspection the grader runs against a lab session's final state (for example a
 * {@code kubectl} jsonpath query) -- never something the learner's own shell can influence the
 * result of directly.
 */
public record LabEvaluationCheck(String description, String probe) {}
