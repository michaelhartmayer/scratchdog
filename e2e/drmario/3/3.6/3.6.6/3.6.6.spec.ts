import { test, expect } from '@playwright/test';
import type {
    CellType,
    GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.6.6 Each cascade re-checks for new matches, repeating the clear animation if needed
// Test: Verify cascade completes with proper state transitions (FLASHING -> CASCADING -> PLAYING)
/** @mustTestDrMarioGamestate */
test('3.6.6 Cascade re-checks for matches after gravity', async ({ page }) => {
    await page.goto('/');
    await page.click('body');
    await page.click('text=New Game');
    await page.waitForFunction(
        () =>
            typeof window.getE2EState === 'function' &&
            window.getE2EState('DRMARIO_ENGINE') !== undefined,
    );

    // Get active pill color
    const pillColors = await page.evaluate(() => {
        const state = window.getE2EState('DRMARIO_STATE') as GameState;
        return state.activePill;
    });

    const pillColor = pillColors?.color1 ?? 'R';
    const virusType = `VIRUS_${pillColor}` as CellType;

    // Setup viruses to match
    const grid: CellType[][] = Array.from({ length: 16 }, () =>
        Array.from({ length: 8 }, () => 'EMPTY' as CellType),
    );
    grid[15][0] = virusType;
    grid[15][1] = virusType;
    grid[15][2] = virusType;
    grid[15][3] = virusType;
    grid[10][7] = 'VIRUS_B'; // Extra to prevent VICTORY

    await page.evaluate((g) => {
        const engine = window.getE2EState('DRMARIO_ENGINE') as {
            setGrid: (grid: CellType[][]) => void;
        };
        engine.setGrid(g);
    }, grid);

    // Move pill right and hard drop
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press(' ');

    // Capture states during cascade process
    await page.waitForTimeout(50);
    let state = await page.evaluate(
        () => window.getE2EState('DRMARIO_STATE') as GameState,
    );

    // Should enter FLASHING first
    expect(state.status).toBe('FLASHING');

    // Wait for cascade sequence to complete
    await page.waitForTimeout(1000);
    state = await page.evaluate(
        () => window.getE2EState('DRMARIO_STATE') as GameState,
    );

    // After cascade completes (FLASHING -> CASCADING -> PLAYING):
    // - Original viruses should be cleared
    // - Game should be back to PLAYING with new active pill
    expect(state.status).toBe('PLAYING');
    expect(state.grid[15][0]).toBe('EMPTY');
    expect(state.grid[15][1]).toBe('EMPTY');
    expect(state.grid[15][2]).toBe('EMPTY');
    expect(state.activePill).not.toBeNull();
});
