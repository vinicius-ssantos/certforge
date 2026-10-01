import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// In development the API is on another port; the proxy keeps the browser on one origin, which is
// what the production deployment does too. The session cookie is therefore same-origin and the
// application never handles an authentication token.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:8080" } },
  // The built app is served the same way for the end-to-end tests.
  preview: { proxy: { "/api": "http://localhost:8080" } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    css: false,
    include: ["src/**/*.test.{ts,tsx}"],
    testTimeout: 15_000,
  },
});
