package dev.certforge.identity;

import java.util.Collection;
import java.util.Map;
import java.util.UUID;

/**
 * Turns account ids into the name shown to other people, without exposing identity internals.
 *
 * <p>The name is the account's email address. It is meant for screens only editorial staff can open
 * (who wrote, reviewed or published a revision), never for anything a learner can see. An id that
 * no longer resolves is simply absent from the result.
 */
public interface AccountNames {

  /** The display name of each known account among {@code ids}. */
  Map<UUID, String> of(Collection<UUID> ids);
}
