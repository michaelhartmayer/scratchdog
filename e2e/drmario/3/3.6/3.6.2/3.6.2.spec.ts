import { test, expect } from '@playwright/test';
import type {
    CellType,
    GameState,
} from '../../../../../src/game/DrMarioEngine';

// 3.6.2 Viruses are replaced with an "X" or starburst explosion sprite when eliminated
// Test: During clear animation, virus cells should show explosion sprite (not just disappear)
/** @mustTestDrMarioGamestate */
test('3.6.2 Viruses show explosion sprite when eliminated', async ({
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
    grid[10][7] = 'VIRUS_B';

    await page.evaluate((g) => {
        const engine = window.getE2EState('DRMARIO_ENGINE') as {
            setGrid: (grid: CellType[][]) => void;
        };
        engine.setGrid(g);
    }, grid);

    // Hard drop to trigger match
    await page.keyboard.press(' ');

    // SPEC REQUIREMENT: Viruses should show "X" or starburst during elimination
    // Check for explosion cell type during animation phase
    await page.waitForTimeout(100);

    const state = await page.evaluate(
        () => window.getE2EState('DRMARIO_STATE') as GameState,
    );

    // During clear animation, virus cells should be in EXPLOSION state
    const hasExplosionSprite = state.grid[15][0].startsWith('EXPLODE');

    expect(hasExplosionSprite).toBe(true);
});
