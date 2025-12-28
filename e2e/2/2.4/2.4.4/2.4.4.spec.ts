import { test, expect } from '@playwright/test';
test('2.4.4 Has a close button in the top right', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=Options');
  // Check close button functionality
  await page.locator('.close-btn').click();
  await expect(page.getByTestId('options-modal')).not.toBeVisible();
});
