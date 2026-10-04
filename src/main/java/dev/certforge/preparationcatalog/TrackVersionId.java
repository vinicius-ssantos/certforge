package dev.certforge.preparationcatalog;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Objects;
import java.util.UUID;

/**
 * Stable identity of a track version: the thing topics are mapped into and that published content
 * is bound to. For a certification track a version is an exam revision and carries the exam's
 * identity beside it; for an interview track it is a taxonomy revision with no exam at all (ADR
 * 0016).
 */
public record TrackVersionId(@JsonValue UUID value) {

  public TrackVersionId {
    Objects.requireNonNull(value, "value");
  }
}
