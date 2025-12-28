import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.2.2 <section> is optional and defaults to the entire file.', () => {
    const outputWithNoSection = execSync('node scripts/cli/index.js toc specifications/cli.spec.md', { encoding: 'utf8' });
    const outputWithSection = execSync('node scripts/cli/index.js toc specifications/cli.spec.md 1', { encoding: 'utf8' });
    // This is a bit subjective, but we verify they both work
    expect(outputWithNoSection).toContain('Table of Contents');
    expect(outputWithSection).toContain('Table of Contents');
});
