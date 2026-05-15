import { test, expect } from "@playwright/test";

test.describe("Ionic App - E2E Tests", () => {
  test("redirects to tab1 on root path", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/tabs\/tab1/);
  });

  test("displays tab 1 content", async ({ page }) => {
    await page.goto("/tabs/tab1");
    await expect(page.getByText("Tab 1 page")).toBeVisible();
  });

  test("navigates to tab 2 via tab bar", async ({ page }) => {
    await page.goto("/tabs/tab1");
    await page.getByRole("tab", { name: "Tab 2" }).click();
    await expect(page).toHaveURL(/\/tabs\/tab2/);
    await expect(page.getByText("Tab 2 page")).toBeVisible();
  });

  test("navigates to tab 3 via tab bar", async ({ page }) => {
    await page.goto("/tabs/tab1");
    await page.getByRole("tab", { name: "Tab 3" }).click();
    await expect(page).toHaveURL(/\/tabs\/tab3/);
    await expect(page.getByText("Tab 3 page")).toBeVisible();
  });

  test("tab bar has all three tab buttons", async ({ page }) => {
    await page.goto("/tabs/tab1");
    const tabBar = page.locator("ion-tab-bar");
    await expect(tabBar).toBeVisible();
    await expect(page.getByRole("tab", { name: "Tab 1" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Tab 2" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Tab 3" })).toBeVisible();
  });

  test("explore container has external link to Ionic docs", async ({
    page,
  }) => {
    await page.goto("/tabs/tab1");
    const link = page.getByRole("link", { name: "UI Components" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", /ionicframework\.com/);
  });
});
