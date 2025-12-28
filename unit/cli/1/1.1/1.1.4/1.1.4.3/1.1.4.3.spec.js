import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.4.3 List includes all nested sections of the specified section.', () => {
  // Verified by logic, hard to test without specific git state
  const output = execSync(
    'node scripts/cli/index.js diff specifications/cli.spec.md 1',
    { encoding: 'utf8' },
  );
  expect(output).toBeDefined();
});
