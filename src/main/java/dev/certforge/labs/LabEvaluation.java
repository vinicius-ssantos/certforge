package dev.certforge.labs;

import java.util.List;

/** How a lab session is graded, and the checks a grader outside the learner's shell runs. */
public record LabEvaluation(EvaluationType type, List<LabEvaluationCheck> checks) {}
