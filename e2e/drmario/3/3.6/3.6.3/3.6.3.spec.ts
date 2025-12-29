import { test, expect } from '@playwright/test';
import type {
    CellType,
    GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.6.3 Capsule segments flash and disappear along with any viruses in the match
/** @mustTestDrMarioGamestate */
test('3.6.3 Capsule and virus segments both clear in match', async ({
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

    // Setup grid with 2 viruses + 1 matching pill already placed
    const grid: CellType[][] = Array.from({ length: 16 }, () =>
        Array.from({ length: 8 }, () => 'EMPTY' as CellType),
    );
    grid[15][0] = virusType;
    grid[15][1] = virusType;
    grid[15][2] = virusType;
    grid[15][3] = virusType;
    grid[10][7] = 'VIRUS_B';

    await page.evaluate((g) => {
        const engine = window.getE2EState('DRMARIO_ENGINE') as {
            setGrid: (grid: CellType[][]) => void;
        };
        engine.setGrid(g);
    }, grid);

    // Move pill to the right and hard drop - completing match at 0,1,2,3
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press(' ');
    await page.waitForTimeout(800);

    // Both viruses AND pill segment should be cleared
    const state = await page.evaluate(
        () => window.getE2EState('DRMARIO_STATE') as GameState,
    );

    // All cells in the match should be EMPTY
    expect(state.grid[15][0]).toBe('EMPTY');
    expect(state.grid[15][1]).toBe('EMPTY');
    expect(state.grid[15][2]).toBe('EMPTY');
    expect(state.grid[15][3]).toBe('EMPTY');
});
