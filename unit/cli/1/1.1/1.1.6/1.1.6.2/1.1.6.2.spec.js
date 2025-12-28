import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_1_1_6_2');
const tempFile = path.join(tempDir, 'test.spec.md');

it('1.1.6.2 <content> replaces the existing specification text', () => {
  // Setup
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  fs.writeFileSync(
    tempFile,
    '# Test Spec\n\n1. Section One\n    1.1. Original Text that is quite long\n',
  );

  // Execute
  execSync(`node scripts/cli/index.js edit ${tempFile} 1.1 "Replaced Text"`, {
    encoding: 'utf8',
  });

  // Verify
  const content = fs.readFileSync(tempFile, 'utf8');
  // Ensure exact replacement structure
  expect(content).toMatch(/1\.1\. Replaced Text$/m);

  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });
});
