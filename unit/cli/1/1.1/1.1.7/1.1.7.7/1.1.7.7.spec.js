import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_add_root_test');
const tempFile = path.join(tempDir, 'add_root.spec.md');

it('1.1.7.7 Use \'.\' (dot) as <section> to explicitly add the item to the root level', () => {
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir);

    const initialContent = `
# Root Test Spec
1. Existing Section
    1.1. Subitem
`;
    fs.writeFileSync(tempFile, initialContent);

    try {
        // Command: add <file> . <content>
        execSync(`node scripts/cli/index.js add ${tempFile} . "New Root Item"`, { encoding: 'utf8' });

        const content = fs.readFileSync(tempFile, 'utf8');
        // Next root number should be 2
        expect(content).toContain('2. New Root Item');

        // Add another one with digits in content ensuring no ambiguity
        execSync(`node scripts/cli/index.js add ${tempFile} . "10. Start with Number"`, { encoding: 'utf8' });
        const content2 = fs.readFileSync(tempFile, 'utf8');
        expect(content2).toContain('3. 10. Start with Number');

    } finally {
        if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    }
});
