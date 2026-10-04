import { createContext, useContext } from "react";
import { en, type Catalog } from "./en";
import { DEFAULT_LOCALE, type LocaleCode } from "./locales";

/**
 * The active catalog. English is the default value rather than something a provider has to supply,
 * so a component rendered on its own -- in a test, say -- reads real strings instead of blanks.
 */
export const TextContext = createContext<Catalog>(en);

export function useText(): Catalog {
  return useContext(TextContext);
}

/** Which locale is active, and how to change it. Only the switcher needs the second half. */
export const LocaleContext = createContext<{
  locale: LocaleCode;
  choose: (locale: LocaleCode) => void;
}>({
  locale: DEFAULT_LOCALE,
  choose: () => {
    // No provider above: nothing to change. A component rendered on its own still renders.
  },
});

export function useLocale() {
  return useContext(LocaleContext);
}
