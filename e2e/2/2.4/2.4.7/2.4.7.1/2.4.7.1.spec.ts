import { test, expect } from '@playwright/test';
test('2.4.7.1 Has a "Back" button', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=Options');
  await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
});
