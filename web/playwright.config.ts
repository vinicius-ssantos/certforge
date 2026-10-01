import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run the real application: the built web app served on one origin together with
 * the Spring Boot backend and PostgreSQL. Start the backend first (see web/README.md); this config
 * serves the built web app and proxies /api to the backend, as the production reverse proxy does.
 */
const WEB_PORT = 4173;

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/seed.ts",
  fullyParallel: false,
  workers: 1,
  retries: process.env["CI"] ? 1 : 0,
  reporter: process.env["CI"] ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: `npm run preview -- --port ${WEB_PORT} --strictPort`,
    url: `http://localhost:${WEB_PORT}`,
    reuseExistingServer: !process.env["CI"],
  },
});
