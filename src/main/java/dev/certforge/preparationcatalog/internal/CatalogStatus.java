package dev.certforge.preparationcatalog.internal;

/** Lifecycle of catalog content. Only {@link #ACTIVE} content is visible to learners. */
enum CatalogStatus {
  DRAFT,
  ACTIVE,
  INACTIVE
}
