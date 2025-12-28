import { test, expect } from '@playwright/test';
test('3.4.2.2 Has a "Save Game" button', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Save Game' })).toBeVisible();
});
