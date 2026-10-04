import { createContext, useContext } from "react";
import { en, type Catalog } from "./en";

/**
 * The active catalog. English is the default value rather than something a provider has to supply,
 * so a component rendered on its own -- in a test, say -- reads real strings instead of blanks.
 *
 * There is only one locale today (#74 step 1 extracted the strings; step 2 adds pt-BR, the
 * provider and the switcher). Components read through this hook already, so that step adds a
 * provider and does not touch the components again.
 */
export const TextContext = createContext<Catalog>(en);

export function useText(): Catalog {
  return useContext(TextContext);
}
