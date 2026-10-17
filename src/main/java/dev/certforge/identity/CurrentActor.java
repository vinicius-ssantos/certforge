package dev.certforge.identity;

import java.util.Optional;

/** Resolves the authenticated actor of the current request without exposing identity internals. */
public interface CurrentActor {

  /** The authenticated actor, or empty for anonymous requests. */
  Optional<ActorId> find();

  /**
   * Whether the current request carries a permission. The default refuses, so a stand-in that has
   * not thought about it denies rather than grants.
   */
  default boolean has(Permission permission) {
    return false;
  }

  /** The authenticated actor; fails if the request is anonymous. */
  default ActorId require() {
    return find().orElseThrow(() -> new IllegalStateException("No authenticated actor"));
  }
}
