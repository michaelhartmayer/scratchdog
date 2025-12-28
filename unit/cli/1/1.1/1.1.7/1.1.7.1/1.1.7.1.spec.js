import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_add_test_1');
const tempFile = path.join(tempDir, 'add_1.spec.md');

it('1.1.7.1 Appends a new specification item to the <section> in <file>', () => {
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const initialContent = `
# Test Spec

1. Section One
    1.1. Existing Item
`;
    fs.writeFileSync(tempFile, initialContent);

    try {
        execSync(`node scripts/cli/index.js add ${tempFile} 1 "New Item"`, { encoding: 'utf8' });

        const content = fs.readFileSync(tempFile, 'utf8');
        expect(content).toContain('    1.2. New Item');
    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});
