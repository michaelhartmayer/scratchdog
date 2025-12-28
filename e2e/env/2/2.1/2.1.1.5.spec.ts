import { test, expect } from '@playwright/test';

test.describe('2.1.1.5 Components are not allowed to use html buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('body'); // Skip splash screen
  });

  test('2.1.1.5.1 Main Menu buttons use DesignSystem Button', async ({
    page,
  }) => {
    const buttons = page.locator('.main-menu button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toHaveClass(/ds-button/);
    }
  });

  test('2.1.1.5.2 Options Modal buttons use DesignSystem Button', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Options' }).click();
    const modal = page.getByTestId('options-modal');
    await expect(modal).toBeVisible();

    const buttons = modal.locator('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toHaveClass(/ds-button/);
    }
  });

  test('2.1.1.5.3 Pause Menu buttons use DesignSystem Button', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'New Game' }).click();
    await expect(page.getByTestId('game-screen')).toBeVisible();

    await page.keyboard.press('Escape');
    const pauseMenu = page.getByTestId('pause-menu');
    await expect(pauseMenu).toBeVisible();

    const buttons = pauseMenu.locator('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toHaveClass(/ds-button/);
    }
  });
});
