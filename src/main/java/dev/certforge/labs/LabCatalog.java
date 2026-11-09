package dev.certforge.labs;

import java.util.List;
import java.util.Optional;

/**
 * Read contract of the lab catalog for other modules (for example a future orchestrator). Every
 * {@link LabSpec} returned here has already passed {@code LabSpecValidator} -- this catalog never
 * holds an invalid spec, by refusing to start rather than by filtering at read time.
 */
public interface LabCatalog {

  /** Every shipped lab, in no particular order. */
  List<LabSpec> all();

  /** One lab by its id, if one is shipped under that id. */
  Optional<LabSpec> findByLabId(String labId);
}
