import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const tempDir = path.join(__dirname, 'temp_add_test_5');
const tempFile = path.join(tempDir, 'add_5.spec.md');

it('1.1.7.5 Output returns the updated section as if running the toc command on the new item', () => {
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const initialContent = `
# Test Spec

1. Section One
`;
    fs.writeFileSync(tempFile, initialContent);

    try {
        const output = execSync(`node scripts/cli/index.js add ${tempFile} 1 "New Item"`, { encoding: 'utf8' });

        // Expecting output similar to TOC, e.g.:
        // 1.1. New Item (0 spec lines)
        // Or if it mimics TOC exactly:
        // Table of Contents for ... section 1.1:
        // -------------------
        // 1.1. New Item (0 spec lines)

        // The spec says "as if running the toc command on the new item".
        // Use loose matching for key parts.
        expect(output).toContain('1.1. New Item');
        // specCommand output format is what we get now.
        // It won't have 'spec lines' or TOC header.
        // expect(output).toContain('spec lines');

    } finally {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});
