import { describe, expect, it } from "vitest";
import { formatDateTime } from "../history/format";
import { en } from "./en";
import { LOCALES, preferredLocale, type LocaleCode } from "./locales";
import { plural } from "./plural";
import { ptBR } from "./pt-BR";

const codes = Object.keys(LOCALES) as LocaleCode[];

/**
 * The type checker already proves every locale has every key. These cover what it cannot see: that
 * no value was left as the English original by accident, that the counts read CLDR rather than a
 * handwritten rule, and that the locale a visitor lands in is the one they asked for.
 */
describe("the catalogs", () => {
  it("has every locale registered with a catalog and a name in its own language", () => {
    expect(codes).toEqual(["en", "pt-BR"]);
    for (const code of codes) {
      expect(LOCALES[code].catalog).toBeTypeOf("object");
      expect(LOCALES[code].name.trim().length).toBeGreaterThan(0);
      expect(LOCALES[code].tag).toBe(code);
    }
  });

  // Walks both trees together. A value that is identical in both is usually a string that was
  // copied and not translated -- but some genuinely are the same, so those are named here rather
  // than allowed by a loose rule.
  it("translates every string, or says why one is identical", () => {
    const sameOnPurpose = new Set([
      "layout.brand", // A product name is not translated.
      "layout.editorial", // "Editorial" is the same word in Portuguese.
      "editorial.catalogTrack.number", // "#"
      "progress.noValue", // "–", punctuation rather than a word
      "editorial.diff.closeBracket", // "]"
    ]);

    const identical: string[] = [];
    const walk = (a: unknown, b: unknown, path: string) => {
      if (typeof a === "string" && typeof b === "string") {
        if (a === b && !sameOnPurpose.has(path)) {
          identical.push(path);
        }
        return;
      }
      if (typeof a === "function" || typeof b === "function") {
        return; // Compared by behaviour in the cases below, not by source text.
      }
      if (a && b && typeof a === "object" && typeof b === "object") {
        for (const key of Object.keys(a)) {
          walk((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key], path ? `${path}.${key}` : key);
        }
      }
    };
    walk(en, ptBR, "");

    expect(identical).toEqual([]);
  });

  it("keeps the product name and translates the page-title suffix shape", () => {
    expect(en.documentTitle.suffix("Progress")).toBe("Progress · CertForge");
    expect(ptBR.documentTitle.suffix("Progresso")).toBe("Progresso · CertForge");
  });
});

/**
 * The case that made this worth a helper. CLDR puts Brazilian Portuguese's `one` category at
 * i = 0..1, so zero takes the singular -- and European Portuguese does not agree, which is why a
 * handwritten `count === 1` is wrong rather than merely unidiomatic.
 */
describe("plural", () => {
  it("follows CLDR, which puts zero in the singular for pt-BR but not for English", () => {
    expect(plural("pt-BR", 0, { one: "questão", other: "questões" })).toBe("questão");
    expect(plural("pt-BR", 1, { one: "questão", other: "questões" })).toBe("questão");
    expect(plural("pt-BR", 2, { one: "questão", other: "questões" })).toBe("questões");

    expect(plural("en", 0, { one: "question", other: "questions" })).toBe("questions");
    expect(plural("en", 1, { one: "question", other: "questions" })).toBe("question");
  });

  it("falls back to other for a category a locale does not define", () => {
    expect(plural("ru", 2, { other: "вопросов" })).toBe("вопросов");
  });

  it("is what the catalogs use, so a count agrees with its noun in both languages", () => {
    expect(en.tracks.topicCount(1)).toBe("1 topic");
    expect(en.tracks.topicCount(10)).toBe("10 topics");
    expect(ptBR.tracks.topicCount(1)).toBe("1 tópico");
    expect(ptBR.tracks.topicCount(10)).toBe("10 tópicos");

    // Zero: English plural, Portuguese singular.
    expect(en.tracks.topicCount(0)).toBe("0 topics");
    expect(ptBR.tracks.topicCount(0)).toBe("0 tópico");
  });

  it("agrees the verb too, not only the noun", () => {
    expect(en.review.dueNow(1)).toBe("1 question is worth revisiting");
    expect(en.review.dueNow(4)).toBe("4 questions are worth revisiting");
    expect(ptBR.review.dueNow(1)).toBe("1 questão vale revisitar");
    expect(ptBR.review.dueNow(4)).toBe("4 questões valem revisitar");
  });
});

/**
 * ADR 0012 counts date and number formatting as part of the interface, so these follow the chosen
 * locale rather than the browser's. Asserted on the parts rather than the whole string, because
 * the exact punctuation CLDR uses is not something this repository should pin.
 */
describe("formatDateTime", () => {
  const iso = "2026-10-04T14:30:00Z";

  it("formats in the locale it is given, not in the environment's", () => {
    const english = formatDateTime(iso, "en-US");
    const portuguese = formatDateTime(iso, "pt-BR");

    expect(english).not.toBe(portuguese);
    expect(english).toContain("2026");
    expect(portuguese).toContain("2026");
    // "out." is the Portuguese abbreviation for October; "Oct" is the English one.
    expect(portuguese.toLowerCase()).toContain("out");
    expect(english).toContain("Oct");
  });

  it("gives the same answer for the same locale, so the cache is not a behaviour change", () => {
    expect(formatDateTime(iso, "pt-BR")).toBe(formatDateTime(iso, "pt-BR"));
  });
});

describe("preferredLocale", () => {
  it("honours a remembered choice above anything the browser asks for", () => {
    expect(preferredLocale("pt-BR", ["en-US", "en"])).toBe("pt-BR");
    expect(preferredLocale("en", ["pt-BR"])).toBe("en");
  });

  it("ignores a remembered value that is not a locale we have", () => {
    expect(preferredLocale("klingon", ["pt-BR"])).toBe("pt-BR");
    expect(preferredLocale("", [])).toBe("en");
  });

  it("matches on the primary subtag, so pt and pt-PT both reach Portuguese", () => {
    expect(preferredLocale(null, ["pt"])).toBe("pt-BR");
    expect(preferredLocale(null, ["pt-PT", "en"])).toBe("pt-BR");
    expect(preferredLocale(null, ["PT-pt"])).toBe("pt-BR");
  });

  it("prefers an exact tag over a primary-subtag match earlier in the list", () => {
    expect(preferredLocale(null, ["en-GB", "pt-BR"])).toBe("en");
  });

  it("falls back to English when nothing matches", () => {
    expect(preferredLocale(null, ["ja", "ko"])).toBe("en");
    expect(preferredLocale(null, [])).toBe("en");
  });
});
