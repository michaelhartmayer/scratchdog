import { test, expect } from '@playwright/test';

// 8.4. Pills
// 8.4.1. Pills are capsule-shaped with two colored halves.
// 8.4.2. Each half is a solid color (R/Y/B).
// 8.4.3. Pills have a slight 3D shading/highlight effect.
test('8.4.1-8.4.3 Pill visual verification', async ({ page }) => {
    await page.goto('/');
    await page.click('body');
    await page.click('text=New Game');

    // Check for pill segments and their styling
    const pillSegments = page.locator('.pill-segment');

    // They should exist
    await expect(pillSegments.first()).toBeVisible();

    // Check for capsule shape (border-radius)
    const borderRadius = await pillSegments.first().evaluate((el) => window.getComputedStyle(el).borderRadius);
    expect(borderRadius).not.toBe('0px');

    // Check for 3D shading effect (likely box-shadow or linear-gradient)
    const boxShadow = await pillSegments.first().evaluate((el) => window.getComputedStyle(el).boxShadow);
    const backgroundImage = await pillSegments.first().evaluate((el) => window.getComputedStyle(el).backgroundImage);

    const hasShading = boxShadow !== 'none' || backgroundImage.includes('gradient');
    expect(hasShading).toBe(true);
});
