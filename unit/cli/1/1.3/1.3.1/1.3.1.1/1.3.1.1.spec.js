import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.3.1.1 Usage string must follow the format `Usage: npm run specter <command> [args]`', () => {
  const output = execSync('node scripts/cli/index.js help', {
    encoding: 'utf8',
  });
  expect(output).toContain('Usage: npm run specter <command> [args]');
});
