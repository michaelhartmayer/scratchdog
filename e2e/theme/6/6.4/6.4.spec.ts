import { test, expect } from '@playwright/test';

test.describe('6.4 Disabled States', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/design-system');
    });

    test('6.4.1 Disabled button has opacity ~0.4', async ({ page }) => {
        const btn = page.getByTestId('button-disabled');
        const opacity = await btn.evaluate((el) => getComputedStyle(el).opacity);
        expect(Number(opacity)).toBeLessThanOrEqual(0.5);
    });

    test('6.4.2 Disabled button has cursor not-allowed', async ({ page }) => {
        const btn = page.getByTestId('button-disabled');
        const cursor = await btn.evaluate((el) => getComputedStyle(el).cursor);
        expect(cursor).toBe('not-allowed');
    });
});
