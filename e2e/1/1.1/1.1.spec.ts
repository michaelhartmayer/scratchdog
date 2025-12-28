import { test, expect } from '@playwright/test';

test('1.1 Fades in from black', async ({ page }) => {
  await page.goto('/');
  const splash = page.getByTestId('splash-screen');
  await expect(splash).toHaveClass(/fade-in/);
  // Optional: check opacity style, but class check is often enough for functionality
});
