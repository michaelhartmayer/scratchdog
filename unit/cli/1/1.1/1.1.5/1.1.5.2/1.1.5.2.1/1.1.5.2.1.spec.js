import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.5.2.1 Each command is displayed with its name and description.', () => {
    const output = execSync('node scripts/cli/index.js help', { encoding: 'utf8' });
    expect(output).toMatch(/\s+list\s+.*\s+Lists all/);
});
