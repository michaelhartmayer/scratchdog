import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.3.4 Output is formatted as a list of sections.', () => {
  const output = execSync(
    'node scripts/cli/index.js spec specifications/cli.spec.md',
    { encoding: 'utf8' },
  );
  expect(output).toContain('1. CLI');
});
