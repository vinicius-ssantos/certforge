import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import * as axeMatchers from "vitest-axe/matchers";
import { afterEach, expect } from "vitest";

expect.extend(axeMatchers);

// Typing character by character and waiting for the UI can exceed the 1 s default when files run in
// parallel on a busy machine. This bounds how long a test waits, not how fast the app must be.
configure({ asyncUtilTimeout: 5000 });

afterEach(() => {
  cleanup();
  // Browser storage outlives a render, which is the point of it and a trap for the test after:
  // one test that remembers a preference silently changes what every later test starts from, and
  // the failure surfaces far from the cause. Each test gets a fresh browser.
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    // Storage can be unavailable; nothing to clear then.
  }
});
