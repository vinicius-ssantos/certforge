/**
 * Picks the right form for a count, using the browser's own CLDR data rather than a handwritten
 * rule.
 *
 * Why this exists instead of `count === 1 ? "question" : "questions"`: that branch is right for
 * English, and it is **wrong for Brazilian Portuguese at zero**. CLDR puts pt-BR's `one` category
 * at i = 0..1, so "0 questão" is the correct form and "0 questões" is not — and pt-PT disagrees
 * with pt-BR about exactly that, which is a good sign the distinction is real and not a quirk of
 * the data. A hand-rolled ternary cannot know this, and gets worse the moment a language with more
 * than two categories arrives: Russian has four and Arabic six.
 *
 * `Intl.PluralRules` is what the established libraries resolve plurals with too (i18next has been
 * built on it since v4), so this is the same mechanism without the dependency.
 */
const rules = new Map<string, Intl.PluralRules>();

function rulesFor(locale: string): Intl.PluralRules {
  let found = rules.get(locale);
  if (!found) {
    found = new Intl.PluralRules(locale);
    rules.set(locale, found);
  }
  return found;
}

/**
 * The forms a locale needs. `other` is required because every locale has it; the rest are optional
 * because which ones exist depends on the language, and a form a locale never selects would be
 * dead weight in its catalog.
 */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

export function plural(locale: string, count: number, forms: PluralForms): string {
  const category = rulesFor(locale).select(count);
  return forms[category] ?? forms.other;
}
