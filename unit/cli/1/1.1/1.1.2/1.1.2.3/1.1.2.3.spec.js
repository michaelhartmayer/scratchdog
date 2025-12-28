import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.2.3 List is limited to the top level sections of the level specified by <section>, and does not show any nested sections.', () => {
    const output = execSync('node scripts/cli/index.js toc specifications/cli.spec.md 1.1', { encoding: 'utf8' });
    expect(output).toContain('1.1.1.');
    expect(output).not.toContain('1.1.1.1.');
});
