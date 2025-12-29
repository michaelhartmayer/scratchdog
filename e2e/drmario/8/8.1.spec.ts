import { test, expect } from '@playwright/test';

// 8.1. Pill Bottle
// 8.1.1. The play area is contained within a medicine bottle shape.
// 8.1.2. The bottle has a narrow neck opening at the top where pills enter.
// 8.1.3. The bottle is translucent with a slight glass-like appearance.
test('8.1.1-8.1.3 Pill Bottle visual verification', async ({ page }) => {
  await page.goto('/');
  await page.click('body');
  await page.click('text=New Game');

  // Check for a bottle container element
  const bottle = page.locator('#pill-bottle');
  await expect(bottle).toBeVisible();

  // Check for glass-like appearance (translucency)
  const opacity = await bottle.evaluate(
    (el) => window.getComputedStyle(el).opacity,
  );
  expect(parseFloat(opacity)).toBeLessThan(1);

  // Check for neck opening (could be a specific class or structure)
  const neck = page.locator('#bottle-neck');
  await expect(neck).toBeVisible();
});
