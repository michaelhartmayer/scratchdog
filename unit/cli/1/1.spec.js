import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1 CLI that can be used with npm run specter <command> <args>', () => {
  const output = execSync('node scripts/cli/index.js help', {
    encoding: 'utf8',
  });
  expect(output).toContain('Usage: npm run specter <command> [args]');
});
