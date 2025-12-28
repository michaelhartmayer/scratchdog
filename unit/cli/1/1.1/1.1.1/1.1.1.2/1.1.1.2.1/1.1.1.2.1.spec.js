import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.1.2.1 Specification files are identified as *.spec.md', () => {
    const output = execSync('node scripts/cli/index.js list', { encoding: 'utf8' });
    // This item is a bit descriptive, but we check if *.spec.md files are listed
    expect(output).toContain('.spec.md');
});
