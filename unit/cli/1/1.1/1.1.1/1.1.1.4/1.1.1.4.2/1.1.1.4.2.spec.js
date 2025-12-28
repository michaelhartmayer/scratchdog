import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.1.4.2 Each file is displayed with its number of total specification lines.', () => {
    const output = execSync('node scripts/cli/index.js list', { encoding: 'utf8' });
    expect(output).toMatch(/\(\d+ spec lines\)/);
});
