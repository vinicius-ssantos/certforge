import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Catalog } from "./en";
import {
  catalogOf,
  preferredLocale,
  rememberLocale,
  rememberedLocale,
  type LocaleCode,
} from "./locales";
import { LocaleContext, TextContext } from "./useText";

/**
 * Holds the active locale and keeps the document's `lang` in step with it.
 *
 * `lang` matters more than it looks: it is what tells a screen reader which phonetics to use, and
 * what a browser uses to pick hyphenation and quotation rules. `index.html` ships `lang="en"`
 * because English is the fallback; this corrects it once the chosen locale is known, and that is
 * the reason a translated interface could not simply be added without touching the document.
 *
 * The locale is *derived* rather than stored: what is stored is the choice made in this session,
 * if any, and what was detected once on mount. A `fixed` prop then needs no effect to take hold,
 * which keeps this free of the synchronous setState in an effect that cascades renders.
 */
export function TextProvider({
  children,
  locale: fixed,
}: {
  children: ReactNode;
  /** Forces a locale and leaves the switcher with nothing to do. Only tests pass this. */
  locale?: LocaleCode;
}) {
  const [detected] = useState<LocaleCode>(() =>
    preferredLocale(
      rememberedLocale(),
      typeof navigator === "undefined" ? [] : navigator.languages,
    ),
  );
  const [chosen, setChosen] = useState<LocaleCode | null>(null);
  const locale = fixed ?? chosen ?? detected;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const choose = useCallback((next: LocaleCode) => {
    setChosen(next);
    rememberLocale(next);
  }, []);

  const catalog: Catalog = catalogOf(locale);
  const value = useMemo(() => ({ locale, choose }), [locale, choose]);

  return (
    <LocaleContext.Provider value={value}>
      <TextContext.Provider value={catalog}>{children}</TextContext.Provider>
    </LocaleContext.Provider>
  );
}
