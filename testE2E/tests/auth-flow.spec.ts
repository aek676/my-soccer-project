import { test, expect, type Page } from '@playwright/test';
import { createEmulatorUser } from '../helpers/emulator-auth';

async function scrollToBottom(page: Page) {
  await page.evaluate(() => {
    const content = document.querySelector('ion-content');
    if (content) {
      content.scrollTo(0, content.scrollHeight);
    }
  });
}

test.describe('Auth - Registration Flow', () => {
  test('registers a new user and redirects to tabs', async ({ page }) => {
    test.slow();

    await page.goto('/auth/register');

    const uniqueEmail = `test-${Date.now()}-${Math.random()}@example.com`;

    await page.locator('input[placeholder="Username"]').fill('testuser');
    await page.locator('input[placeholder="Email address"]').fill(uniqueEmail);
    await page.locator('input[placeholder="Password"]').fill('password123');
    await page.locator('input[placeholder="Confirm password"]').fill('password123');
    await scrollToBottom(page);
    await page.getByRole('button', { name: 'Sign Up' }).click();

    await expect(page).toHaveURL(/\/tabs/, { timeout: 60000 });
  });

  test('shows error when email is already in use', async ({ page }) => {
    const existingEmail = `existing-${Date.now()}-${Math.random()}@example.com`;
    await createEmulatorUser(existingEmail, 'password123');

    await page.goto('/auth/register');

    await page.locator('input[placeholder="Username"]').fill('anotheruser');
    await page.locator('input[placeholder="Email address"]').fill(existingEmail);
    await page.locator('input[placeholder="Password"]').fill('password456');
    await page.locator('input[placeholder="Confirm password"]').fill('password456');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    const toast = page.locator('ion-toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('This email is already registered');
  });

  test('shows error for weak password', async ({ page }) => {
    await page.goto('/auth/register');

    const uniqueEmail = `weak-${Date.now()}-${Math.random()}@example.com`;

    await page.locator('input[placeholder="Username"]').fill('testuser');
    await page.locator('input[placeholder="Email address"]').fill(uniqueEmail);
    await page.locator('input[placeholder="Password"]').fill('short');
    await page.locator('input[placeholder="Confirm password"]').fill('short');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    await expect(
      page.getByText('Password must be at least 8 characters'),
    ).toBeVisible();
  });
});

test.describe('Auth - Login Flow', () => {
  test('logs in with valid credentials', async ({ page }) => {
    const loginEmail = `login-${Date.now()}-${Math.random()}@example.com`;
    await createEmulatorUser(loginEmail, 'password123', 'Login User');

    await page.goto('/auth/login');

    await page.locator('input[placeholder="Email address"]').fill(loginEmail);
    await page.locator('input[placeholder="Password"]').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/tabs/);
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    const uniqueEmail = `nonexistent-${Date.now()}-${Math.random()}@example.com`;

    await page.locator('input[placeholder="Email address"]').fill(uniqueEmail);
    await page.locator('input[placeholder="Password"]').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    const toast = page.locator('ion-toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Invalid email or password');
  });
});

test.describe('Auth - Guest Flow', () => {
  test('continues as guest without authentication', async ({ page }) => {
    await page.goto('/auth/login');

    await scrollToBottom(page);
    await page.getByRole('button', { name: 'Continue as Guest' }).click();

    await expect(page).toHaveURL(/\/tabs/);
  });
});
