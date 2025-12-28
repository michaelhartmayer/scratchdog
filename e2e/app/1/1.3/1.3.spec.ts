import { test, expect } from '@playwright/test';

test('1.3 Fades out to black', async ({ page }) => {
  await page.goto('/');
  // Wait for 2 seconds (fade out starts)
  // My implementation: 2s delay -> setFadingOut(true)
  const splash = page.getByTestId('splash-screen');
  await expect(splash).toHaveClass(/fade-out/, { timeout: 4000 });
});
