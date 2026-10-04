import { LOCALES, isLocale, type LocaleCode } from "./locales";
import { useLocale, useText } from "./useText";

/**
 * Picks the interface language. A labelled `select` rather than a row of flags: a flag is a country
 * and not a language, and a select is what a screen reader and a keyboard already know how to work.
 *
 * Each option is named in its own language and carries `lang`, so "Português (Brasil)" is announced
 * in Portuguese even while the rest of the page is still English.
 */
export function LanguageSwitcher() {
  const t = useText();
  const { locale, choose } = useLocale();
  const codes = Object.keys(LOCALES) as LocaleCode[];

  return (
    <span className="language">
      <label htmlFor="language" className="visually-hidden">
        {t.language.label}
      </label>
      <select
        id="language"
        value={locale}
        onChange={(event) => {
          if (isLocale(event.target.value)) {
            choose(event.target.value);
          }
        }}
      >
        {codes.map((code) => (
          <option key={code} value={code} lang={LOCALES[code].tag}>
            {LOCALES[code].name}
          </option>
        ))}
      </select>
    </span>
  );
}
