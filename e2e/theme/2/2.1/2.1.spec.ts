import { test, expect } from '@playwright/test';

test.describe('2.1 Core Colors defined in CSS', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('2.1.1 --bg-void is #050507', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--bg-void').trim()
        );
        expect(value).toBe('#050507');
    });

    test('2.1.2 --bg-midnight is #0a0a0f', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--bg-midnight').trim()
        );
        expect(value).toBe('#0a0a0f');
    });

    test('2.1.3 --bg-surface is #12121a', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--bg-surface').trim()
        );
        expect(value).toBe('#12121a');
    });

    test('2.1.4 --bg-elevated is #1a1a24', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--bg-elevated').trim()
        );
        expect(value).toBe('#1a1a24');
    });
});
