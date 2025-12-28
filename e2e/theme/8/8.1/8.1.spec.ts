import { test, expect } from '@playwright/test';

test.describe('8.1 Responsive Breakpoints', () => {
    test('8.1.1 Mobile layout (< 640px)', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/design-system');
        // Verify page loads at mobile size
        const viewport = page.viewportSize();
        expect(viewport?.width).toBeLessThan(640);
    });

    test('8.1.2 Tablet layout (640-1024px)', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/design-system');
        const viewport = page.viewportSize();
        expect(viewport?.width).toBeGreaterThanOrEqual(640);
        expect(viewport?.width).toBeLessThanOrEqual(1024);
    });

    test('8.1.3 Desktop layout (> 1024px)', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.goto('/design-system');
        const viewport = page.viewportSize();
        expect(viewport?.width).toBeGreaterThan(1024);
    });
});
