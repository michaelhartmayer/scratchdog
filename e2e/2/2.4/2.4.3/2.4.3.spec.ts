import { test, expect } from '@playwright/test';
test('2.4.3 Vertically and horizontally centered', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=Options');
  // Flex center check
  const scrim = page.locator('.modal-scrim');
  await expect(scrim).toHaveCSS('display', 'flex');
  await expect(scrim).toHaveCSS('justify-content', 'center');
  await expect(scrim).toHaveCSS('align-items', 'center');
});
