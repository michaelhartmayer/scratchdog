import { test, expect } from '@playwright/test';
test('3.2.1 At the top in white debug text it should say "HUD TBD"', async ({
  page,
}) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');
  await expect(page.getByText('HUD TBD')).toBeVisible();
});
