import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.3.3 List includes all nested sections of the specified section.', () => {
  const output = execSync(
    'node scripts/cli/index.js spec specifications/cli.spec.md 1.1.1',
    { encoding: 'utf8' },
  );
  expect(output).toContain('1.1.1. list <folder>');
  expect(output).toContain('1.1.1.1. Lists all');
});
