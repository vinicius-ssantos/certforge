package dev.certforge.preparationcatalog;

/**
 * Kind of preparation target. {@link #INTERVIEW} is reserved by ADR 0007: it adds no fields,
 * persistence or behavior in v0.1.0 and cannot be created or exposed to learners.
 */
public enum TrackKind {
  CERTIFICATION,
  INTERVIEW
}
