import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.1.4.1 Each file is displayed with its path and name.', () => {
    const output = execSync('node scripts/cli/index.js list', { encoding: 'utf8' });
    expect(output).toContain('specifications/cli.spec.md');
});
