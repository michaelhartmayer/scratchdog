import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.1.1 Lists all specification files in the <folder> folder, recursively.', () => {
  const output = execSync('node scripts/cli/index.js list specifications', {
    encoding: 'utf8',
  });
  expect(output).toContain('specifications/cli.spec.md');
});
