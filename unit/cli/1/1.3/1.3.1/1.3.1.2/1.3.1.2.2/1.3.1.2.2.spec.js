import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

it('1.3.1.2.2 Descriptions must start aligned after the padding', () => {
    const output = execSync('node scripts/cli/index.js help', {
        encoding: 'utf8',
    });

    const lines = output.split('\n');
    const commandLines = lines.filter(line => line.trim().startsWith('list') || line.trim().startsWith('toc') || line.trim().startsWith('spec') || line.trim().startsWith('diff') || line.trim().startsWith('edit'));

    // All descriptions should start at the same index
    const indices = commandLines.map(line => {
        // Find the second sequence of spaces (separating command from desc)
        // This is a bit heuristic. Let's look for the known descriptions.
        // Or just use the same logic as 1.3.1.2.1
        return line.indexOf('  ', 2) + 2; // Find double space after initial indent? No, finding where text starts after the command block.
    });

    // A robust way:
    // "  list [folder]          Lists all..."
    // "  help                   Displays..."

    // We expect them all to start at char 37 (2 indent + 35 pad)
    commandLines.forEach(line => {
        // Get the description part
        // We know the descriptions start with Uppercase usually
        const match = line.match(/ {2,}([A-Z].*)$/);
        if (match) {
            const index = line.indexOf(match[1]);
            expect(index).toBe(37);
        }
    });
});
