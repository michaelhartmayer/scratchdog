import { test, expect } from '@playwright/test';

test('1 Splash Screen', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('splash-screen')).toBeVisible();
});
