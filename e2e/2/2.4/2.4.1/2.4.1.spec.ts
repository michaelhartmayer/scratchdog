import { test, expect } from '@playwright/test';

test('2.4.1 Opens a modal called "Options"', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.getByRole('button', { name: 'Options' }).click();
  await expect(page.getByTestId('options-modal')).toBeVisible();
  await expect(page.locator('.modal-title')).toHaveText('Options');
});
