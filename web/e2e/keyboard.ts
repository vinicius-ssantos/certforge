import { expect, type Page } from "@playwright/test";

/**
 * Walking a page the way someone who never touches a mouse does.
 *
 * The browser decides what a tab stop is, and it is not simply "every control": a group of radio
 * buttons is one stop, and arrow keys move within it. These helpers encode that, so a page is only
 * reported as unreachable when it really is.
 */

const FOCUSABLE =
  'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';

/** Marks every control the browser should stop on, and returns how many stops to expect. */
async function markStops(page: Page): Promise<string[]> {
  return page.evaluate((selector) => {
    const visible = (element: Element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      // A skip link sits off-screen until focused; it is still a real stop.
      const offScreenButReachable = style.position === "absolute" && style.visibility !== "hidden";
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        (rect.width > 0 || rect.height > 0 || offScreenButReachable)
      );
    };

    const candidates = [...document.querySelectorAll(selector)].filter(
      (element) =>
        visible(element) &&
        !element.hasAttribute("disabled") &&
        element.getAttribute("aria-hidden") !== "true",
    );

    // Within a radio group the browser stops once: on the checked one, or on the first if none is.
    const groups = new Map<string, Element[]>();
    const stops: Element[] = [];
    for (const element of candidates) {
      const input = element as HTMLInputElement;
      if (input.type === "radio" && input.name) {
        const group = groups.get(input.name) ?? [];
        group.push(element);
        groups.set(input.name, group);
        continue;
      }
      stops.push(element);
    }
    for (const group of groups.values()) {
      stops.push(group.find((radio) => (radio as HTMLInputElement).checked) ?? group[0]!);
    }

    // In document order, so the expected sequence matches the browser's.
    const ordered = [...document.querySelectorAll(selector)].filter((element) =>
      stops.includes(element),
    );
    return ordered.map((element, index) => {
      element.setAttribute("data-kb", String(index));
      const label =
        element.getAttribute("aria-label") ??
        (element as HTMLElement).innerText?.trim().split("\n")[0] ??
        "";
      return `${element.tagName.toLowerCase()}#${index} ${label}`.trim();
    });
  }, FOCUSABLE);
}

/**
 * Puts the next Tab back at the top of the document. Tab continues from wherever the focus is, and
 * the app deliberately moves focus (to a heading after a navigation, to a result after an answer),
 * so a walk that did not reset would start in the middle and report everything above it as
 * unreachable. Focusing the body moves the browser's sequential navigation starting point; the
 * attribute that makes that possible is taken off again at once.
 */
export async function startFromTop(page: Page) {
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    document.body.setAttribute("tabindex", "-1");
    document.body.focus();
    document.body.removeAttribute("tabindex");
  });
}

interface Stop {
  marker: string | null;
  focusRing: boolean;
}

async function currentStop(page: Page): Promise<Stop> {
  return page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null;
    if (!active || active === document.body) {
      return { marker: null, focusRing: true };
    }
    const style = getComputedStyle(active);
    const outlined = style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
    const shadowed = style.boxShadow !== "none";
    return { marker: active.getAttribute("data-kb"), focusRing: outlined || shadowed };
  });
}

/**
 * Tabs from the top of the page and reports which stops were reached, in order. It stops when focus
 * leaves the page (the browser's own chrome) or when every expected stop has been seen, so a page
 * that trapped focus would be caught by the bound rather than hanging.
 */
export async function tabThrough(page: Page, expected: number) {
  await startFromTop(page);

  const reached: string[] = [];
  const withoutRing: string[] = [];
  for (let press = 0; press < expected + 5; press += 1) {
    await page.keyboard.press("Tab");
    const stop = await currentStop(page);
    if (stop.marker === null) {
      break; // focus has left the page: there is no trap
    }
    if (!reached.includes(stop.marker)) {
      reached.push(stop.marker);
      if (!stop.focusRing) {
        withoutRing.push(stop.marker);
      }
    } else if (stop.marker === reached[0] && reached.length === expected) {
      break; // wrapped around after visiting everything
    }
  }
  return { reached, withoutRing };
}

/** Every control is reachable by keyboard, and each one shows where the focus is. */
export async function expectKeyboardReachable(page: Page, where: string) {
  const stops = await markStops(page);
  const { reached, withoutRing } = await tabThrough(page, stops.length);

  const missed = stops.filter((_, index) => !reached.includes(String(index)));
  expect(missed, `controls Tab never reaches on ${where}`).toEqual([]);
  expect(
    withoutRing.map((index) => stops[Number(index)]),
    `controls with no visible focus ring on ${where}`,
  ).toEqual([]);
}
