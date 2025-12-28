import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_1_1_6_1');
const tempFile = path.join(tempDir, 'test.spec.md');

it('1.1.6.1 Updates the content of the specified <section> in <file> with <content>', () => {
  // Setup
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  fs.writeFileSync(
    tempFile,
    '# Test Spec\n\n1. Section One\n    1.1. Old Content\n',
  );

  // Execute
  const output = execSync(
    `node scripts/cli/index.js edit ${tempFile} 1.1 "New Content"`,
    {
      encoding: 'utf8',
    },
  );

  // Verify
  const content = fs.readFileSync(tempFile, 'utf8');
  expect(content).toContain('1.1. New Content');
  expect(content).not.toContain('1.1. Old Content');

  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });
});
