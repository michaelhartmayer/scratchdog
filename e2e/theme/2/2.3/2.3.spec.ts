import { test, expect } from '@playwright/test';

test.describe('2.3 Accent Colors', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('2.3.1 --accent-primary is #8b5cf6 (Violet)', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim()
        );
        expect(value).toBe('#8b5cf6');
    });

    test('2.3.2 --accent-secondary is #ec4899 (Pink)', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim()
        );
        expect(value).toBe('#ec4899');
    });

    test('2.3.3 --accent-tertiary is #06b6d4 (Cyan)', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--accent-tertiary').trim()
        );
        expect(value).toBe('#06b6d4');
    });

    test('2.3.4 --accent-success is #22c55e (Green)', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--accent-success').trim()
        );
        expect(value).toBe('#22c55e');
    });

    test('2.3.5 --accent-warning is #f59e0b (Amber)', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--accent-warning').trim()
        );
        expect(value).toBe('#f59e0b');
    });

    test('2.3.6 --accent-error is #ef4444 (Red)', async ({ page }) => {
        const value = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--accent-error').trim()
        );
        expect(value).toBe('#ef4444');
    });
});
