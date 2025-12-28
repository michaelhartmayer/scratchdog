import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_create_test_2');

it('1.1.8.2 <filename> must end with .spec.md (is appended if missing)', () => {
  if (fs.existsSync(tempDir))
    fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir);

  const folder = path.join(tempDir, 'specifications');
  const filenameNoExt = 'my_spec';
  const title = 'Spec Without Extension';

  try {
    execSync(
      `node scripts/cli/index.js create ${folder} ${filenameNoExt} "${title}"`,
      { encoding: 'utf8' },
    );

    // Should have created my_spec.spec.md
    const expectedPath = path.join(folder, 'my_spec.spec.md');
    expect(fs.existsSync(expectedPath)).toBe(true);

    const folder2 = path.join(tempDir, 'specifications_2');
    const filenameWithExt = 'another.spec.md';
    execSync(
      `node scripts/cli/index.js create ${folder2} ${filenameWithExt} "${title}"`,
      { encoding: 'utf8' },
    );

    // Should NOT append another .spec.md
    const expectedPath2 = path.join(folder2, 'another.spec.md');
    expect(fs.existsSync(expectedPath2)).toBe(true);
    expect(fs.existsSync(path.join(folder2, 'another.spec.md.spec.md'))).toBe(
      false,
    );
  } finally {
    if (fs.existsSync(tempDir))
      fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
