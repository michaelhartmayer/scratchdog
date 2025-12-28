import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.1.8.4 --help flag displays the help message for the create command', () => {
  const output = execSync('node scripts/cli/index.js create --help', {
    encoding: 'utf8',
  });
  expect(output).toContain(
    'Usage: npm run specter create <folder> <filename> <title>',
  );
  expect(output).toContain('Creates a new specification file');
});
