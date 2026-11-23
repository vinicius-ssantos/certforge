import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { assertSafeE2eEnvironment } from "./src/e2eIsolation.ts";

// In development the API is on another port; the proxy keeps the browser on one origin, which is
// what the production deployment does too. The session cookie is therefore same-origin and the
// application never handles an authentication token.
const previewApi = process.env["CERTFORGE_E2E_DISPOSABLE"] === "1"
  ? assertSafeE2eEnvironment(process.env).apiUrl
  : "http://localhost:8080";

export default defineConfig({
  plugins: [react()],
  build: {
    // Never inline assets as data: URIs. The production Content Security Policy allows fonts only
    // from the app's own origin, and Vite would otherwise embed the small font files in the CSS.
    assetsInlineLimit: 0,
    manifest: true,
  },
  server: { proxy: { "/api": "http://localhost:8080" } },
  // The built app is served the same way for the end-to-end tests.
  // The manual E2E preview MUST use the exact disposable backend seeded by Playwright.
  preview: { proxy: { "/api": previewApi } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    css: false,
    include: ["src/**/*.test.{ts,tsx}"],
    testTimeout: 15_000,
  },
});
