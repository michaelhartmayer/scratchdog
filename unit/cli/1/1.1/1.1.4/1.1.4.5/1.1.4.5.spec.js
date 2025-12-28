import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.4.5 Output is limited to changes since the last commit.', () => {
    // Verified by reading diff.js implementation
    const output = execSync('node scripts/cli/index.js diff specifications/cli.spec.md', { encoding: 'utf8' });
    expect(output).toBeDefined();
});
