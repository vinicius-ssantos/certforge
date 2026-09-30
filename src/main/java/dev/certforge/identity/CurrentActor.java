package dev.certforge.identity;

import java.util.Optional;

/** Resolves the authenticated actor of the current request without exposing identity internals. */
public interface CurrentActor {

  /** The authenticated actor, or empty for anonymous requests. */
  Optional<ActorId> find();

  /** The authenticated actor; fails if the request is anonymous. */
  default ActorId require() {
    return find().orElseThrow(() -> new IllegalStateException("No authenticated actor"));
  }
}
