import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.2.4 Output is formatted as a list of sections.', () => {
  const output = execSync(
    'node scripts/cli/index.js toc specifications/cli.spec.md',
    { encoding: 'utf8' },
  );
  expect(output).toContain('Table of Contents');
});
