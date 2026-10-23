package dev.certforge.study.internal;

/**
 * What kind of item a learner is answering in an interview session.
 *
 * <p>It is derived from the question's own type and never taken from a request: a client cannot
 * declare a guided question objective and have its answer graded, or declare an objective question
 * guided and skip the grading.
 */
enum ItemKind {
  /** Options, one or more correct, graded exactly as a study attempt is. */
  OBJECTIVE,
  /** A free-form answer, which nothing scores (ADR 0019). */
  GUIDED
}
