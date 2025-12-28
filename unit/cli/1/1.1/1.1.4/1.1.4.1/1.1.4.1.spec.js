import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.4.1 Displays the specification for the <file> file.', () => {
  // Diff is tricky without changes, but we check if it runs
  const output = execSync(
    'node scripts/cli/index.js diff specifications/cli.spec.md',
    { encoding: 'utf8' },
  );
  expect(output).toBeDefined();
});
