import { defineConfig, devices } from "@playwright/test";

const port = 4321;
const baseURL = process.env.UI_AUDIT_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "tools",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  webServer: process.env.UI_AUDIT_BASE_URL
    ? undefined
    : {
        command: `npm run preview -- --host 127.0.0.1 --port ${port}`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 30_000,
      },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 13"],
        browserName: "chromium",
      },
    },
  ],
});
