import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_add_test_2');
const tempFile = path.join(tempDir, 'add_2.spec.md');

it('1.1.7.2 The new item is numbered sequentially after the last existing child of <section>', () => {
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const initialContent = `
# Test Spec

1. Section One
    1.1. Existing Item
    1.2. Second Item
`;
    fs.writeFileSync(tempFile, initialContent);

    try {
        execSync(`node scripts/cli/index.js add ${tempFile} 1 "Third Item"`, { encoding: 'utf8' });

        const content = fs.readFileSync(tempFile, 'utf8');
        expect(content).toContain('    1.3. Third Item');

        // Add another one to be sure
        execSync(`node scripts/cli/index.js add ${tempFile} 1 "Fourth Item"`, { encoding: 'utf8' });
        const content2 = fs.readFileSync(tempFile, 'utf8');
        expect(content2).toContain('    1.4. Fourth Item');

    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});
