import { test, expect } from '@playwright/test';

test.describe('4.3 Text Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/design-system');
    });

    test('4.3.1 Text Hero variant', async ({ page }) => {
        const el = page.getByTestId('text-hero').first();
        await expect(el).toBeVisible();
    });

    test('4.3.2 Text Title variant', async ({ page }) => {
        const el = page.getByTestId('text-title').first();
        await expect(el).toBeVisible();
    });

    test('4.3.3 Text Heading variant', async ({ page }) => {
        const el = page.getByTestId('text-heading').first();
        await expect(el).toBeVisible();
    });

    test('4.3.4 Text Subheading variant', async ({ page }) => {
        const el = page.getByTestId('text-subheading').first();
        await expect(el).toBeVisible();
    });

    test('4.3.5 Text Body variant', async ({ page }) => {
        const el = page.getByTestId('text-body').first();
        await expect(el).toBeVisible();
    });

    test('4.3.6 Text Caption variant', async ({ page }) => {
        const el = page.getByTestId('text-caption').first();
        await expect(el).toBeVisible();
    });

    test('4.3.7 Text Overline variant', async ({ page }) => {
        const el = page.getByTestId('text-overline').first();
        await expect(el).toBeVisible();
    });
});
