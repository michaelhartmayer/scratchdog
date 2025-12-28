import { describe, it, expect } from 'vitest';
import fs from 'fs';

it('1.2.1 Cli will live in /scripts/cli', () => {
  expect(fs.existsSync('scripts/cli')).toBe(true);
});
