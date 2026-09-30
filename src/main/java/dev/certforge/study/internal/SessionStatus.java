package dev.certforge.study.internal;

/** Lifecycle of a study session. Everything except IN_PROGRESS is terminal. */
enum SessionStatus {
  IN_PROGRESS,
  COMPLETED,
  ABANDONED,
  EXPIRED
}
