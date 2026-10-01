import { test as base, expect } from "@playwright/test";

/**
 * The same `test`, plus one guarantee on every page: the browser must not report a Content Security
 * Policy violation or an uncaught error. The release stack serves a strict policy, so a script, style
 * or font that the app starts to need from somewhere else shows up here instead of in production.
 * Failed requests that a test causes on purpose (a 401 for an anonymous visitor) are not errors of
 * the page and are not counted.
 */
export const test = base.extend<{ pageGuard: void }>({
  pageGuard: [
    async ({ page }, use) => {
      const problems: string[] = [];
      page.on("console", (message) => {
        const text = message.text();
        if (message.type() === "error" && /content security policy|refused to (load|apply|execute|connect)/i.test(text)) {
          problems.push(`CSP: ${text.slice(0, 300)}`);
        }
      });
      page.on("pageerror", (error) => problems.push(`Uncaught: ${error.message}`));
      await use();
      expect(problems, "the browser reported problems on the page").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
