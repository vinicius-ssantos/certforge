import { en, type Catalog } from "./en";
import { ptBR } from "./pt-BR";

/** The locales the interface has. English is canonical and is the fallback for everything. */
export const LOCALES = {
  en: { tag: "en", catalog: en, name: "English" },
  "pt-BR": { tag: "pt-BR", catalog: ptBR, name: "Português (Brasil)" },
} as const;

export type LocaleCode = keyof typeof LOCALES;

export const DEFAULT_LOCALE: LocaleCode = "en";

/** Where the chosen locale is remembered. A choice is per browser; there is no account setting. */
export const STORAGE_KEY = "certforge.locale";

export function isLocale(value: unknown): value is LocaleCode {
  return typeof value === "string" && Object.hasOwn(LOCALES, value);
}

export function catalogOf(locale: LocaleCode): Catalog {
  return LOCALES[locale].catalog;
}

/**
 * The locale to start in: an explicit earlier choice first, then the languages the browser asks
 * for, then English.
 *
 * Matching is by primary subtag, so a browser asking for `pt`, `pt-PT` or `pt-BR` all get
 * Portuguese. That is deliberate: a European Portuguese reader is far better served by pt-BR than
 * by English, and pretending otherwise would be a worse default than the small differences in
 * wording. An exact tag still wins over a primary-subtag match.
 */
export function preferredLocale(
  remembered: string | null,
  requested: readonly string[],
): LocaleCode {
  if (isLocale(remembered)) {
    return remembered;
  }
  for (const tag of requested) {
    if (isLocale(tag)) {
      return tag;
    }
    const primary = tag.split("-")[0]?.toLowerCase();
    const match = (Object.keys(LOCALES) as LocaleCode[]).find(
      (code) => code.split("-")[0]?.toLowerCase() === primary,
    );
    if (match) {
      return match;
    }
  }
  return DEFAULT_LOCALE;
}

/** Reads the remembered choice. Storage can throw or be empty, so this never assumes it worked. */
export function rememberedLocale(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function rememberLocale(locale: LocaleCode): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // A private window or blocked site data: the choice holds for this page and is not remembered,
    // which is better than failing the click.
  }
}
