package dev.certforge.labs;

import java.util.List;

/**
 * The grader's recorded verdict for one completed session: {@code passed} is true only when every
 * check is.
 */
public record LabVerdict(boolean passed, List<LabCheckResult> checks) {}
