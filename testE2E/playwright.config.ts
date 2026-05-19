import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  maxFailures: process.env.CI ? 3 : undefined,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["json", { outputFile: "results.json" }], ["html"]]
    : "html",
  use: {
    baseURL: process.env.BASE_URL || "http://127.0.0.1:5000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "Mobile Chrome",
      use: { ...devices["iPhone 13 Mini"] },
    },
  ],
});
