import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_1_1_6_3');
const tempFile = path.join(tempDir, 'test.spec.md');

it('1.1.6.3 <section> must be a valid existing section', () => {
  // Setup
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  fs.writeFileSync(
    tempFile,
    '# Test Spec\n\n1. Section One\n    1.1. Subsection\n',
  );

  try {
    // Attempt to edit a non-existent section
    execSync(`node scripts/cli/index.js edit ${tempFile} 1.2 "New Content"`, {
      encoding: 'utf8',
      stdio: 'pipe', // Capture output to check for error message
    });
  } catch (error) {
    expect(error.message).toContain('Section 1.2 not found');
  }

  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });
});
