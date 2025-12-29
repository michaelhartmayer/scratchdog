import { test, expect } from '@playwright/test';
import type {
    CellType,
    GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.6.1 When a match is made, matched segments flash for 16 frames (~267ms at 60fps) before being removed
// Test: After match, cells should NOT be immediately cleared - there should be a flash phase first
/** @mustTestDrMarioGamestate */
test('3.6.1 Matched segments flash for ~267ms before being removed', async ({
    page,
}) => {
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

    // Setup grid with viruses to match
    const grid: CellType[][] = Array.from({ length: 16 }, () =>
        Array.from({ length: 8 }, () => 'EMPTY' as CellType),
    );
    grid[15][0] = virusType;
    grid[15][1] = virusType;
    grid[15][2] = virusType;
    grid[15][3] = virusType;
    grid[10][7] = 'VIRUS_B'; // Extra virus to prevent VICTORY

    await page.evaluate((g) => {
        const engine = window.getE2EState('DRMARIO_ENGINE') as {
            setGrid: (grid: CellType[][]) => void;
        };
        engine.setGrid(g);
    }, grid);

    // Hard drop to trigger match
    await page.keyboard.press(' ');

    // SPEC REQUIREMENT: After match, cells should flash for ~267ms BEFORE being cleared
    // Check immediately after match - cells should STILL BE VISIBLE (flashing)
    await page.waitForTimeout(50); // Small wait for match detection

    let state = await page.evaluate(
        () => window.getE2EState('DRMARIO_STATE') as GameState,
    );

    // During flash phase (~267ms), matched cells should still be present (just flashing visually)
    // They should NOT be EMPTY yet
    const cellsStillPresent =
        state.grid[15][0] !== 'EMPTY' ||
        state.grid[15][1] !== 'EMPTY' ||
        state.grid[15][2] !== 'EMPTY';

    // This assertion enforces the spec - cells must flash before being removed
    expect(cellsStillPresent).toBe(true);

    // After 267ms flash duration, cells should then be cleared
    await page.waitForTimeout(300);

    state = await page.evaluate(
        () => window.getE2EState('DRMARIO_STATE') as GameState,
    );

    expect(state.grid[15][0]).toBe('EMPTY');
    expect(state.grid[15][1]).toBe('EMPTY');
    expect(state.grid[15][2]).toBe('EMPTY');
    expect(state.grid[15][3]).toBe('EMPTY');
});
