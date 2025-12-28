import { test, expect } from '@playwright/test';
test('2.4.6.1 Has a section called "Audio"', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=Options');
  await expect(page.getByRole('heading', { name: 'Audio' })).toBeVisible();
});
