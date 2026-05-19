import { test, expect } from "@playwright/test";

test.describe("Auth - Login Page", () => {
  test("displays login page at /auth/login", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  });

  test("displays email and password fields", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(
      page.locator('input[placeholder="Email address"]'),
    ).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
  });

  test("displays sign in button", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("displays continue as guest button", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(
      page.getByRole("button", { name: "Continue as Guest" }),
    ).toBeVisible();
  });

  test("navigates to register page via sign up link", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL(/\/auth\/register/);
    await expect(page.getByText("Create Account")).toBeVisible();
  });

  test("shows validation error when submitting empty form", async ({
    page,
  }) => {
    await page.goto("/auth/login");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText("Email is required")).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/auth/login");
    const emailInput = page.locator('input[placeholder="Email address"]');
    await emailInput.fill("invalid-email");
    await emailInput.blur();
    await expect(page.getByText("Please enter a valid email")).toBeVisible();
  });

  test("password field has a toggle button", async ({ page }) => {
    await page.goto("/auth/login");
    const passwordToggle = page.locator("ion-input-password-toggle");
    await expect(passwordToggle).toBeVisible();
  });
});

test.describe("Auth - Register Page", () => {
  test("displays register page at /auth/register", async ({ page }) => {
    await page.goto("/auth/register");
    await expect(page).toHaveURL(/\/auth\/register/);
    await expect(page.getByText("Create Account")).toBeVisible();
  });

  test("displays all form fields", async ({ page }) => {
    await page.goto("/auth/register");
    await expect(page.locator('input[placeholder="Username"]')).toBeVisible();
    await expect(
      page.locator('input[placeholder="Email address"]'),
    ).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    await expect(
      page.locator('input[placeholder="Confirm password"]'),
    ).toBeVisible();
  });

  test("displays sign up button", async ({ page }) => {
    await page.goto("/auth/register");
    await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
  });

  test("navigates to login page via sign in link", async ({ page }) => {
    await page.goto("/auth/register");
    await page.getByRole("link", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  });

  test("shows validation error when submitting empty form", async ({
    page,
  }) => {
    await page.goto("/auth/register");
    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(page.getByText("Username is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("shows username minlength error", async ({ page }) => {
    await page.goto("/auth/register");
    const usernameInput = page.locator('input[placeholder="Username"]');
    await usernameInput.fill("a");
    await usernameInput.blur();
    await expect(
      page.getByText("Username must be at least 2 characters"),
    ).toBeVisible();
  });

  test("shows password minlength error", async ({ page }) => {
    await page.goto("/auth/register");
    const passwordInput = page.locator('input[placeholder="Password"]').first();
    await passwordInput.fill("short");
    await passwordInput.blur();
    await expect(
      page.getByText("Password must be at least 8 characters"),
    ).toBeVisible();
  });

  test("both password fields have toggle buttons", async ({ page }) => {
    await page.goto("/auth/register");
    const toggles = page.locator("ion-input-password-toggle");
    await expect(toggles).toHaveCount(2);
  });
});
