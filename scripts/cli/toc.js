import path from 'path';
import { parseSpecFile, getTopLevelSections, getSectionsByParent } from './parser.js';

export function tocCommand(file, sectionNumber, options = {}) {
    if (options.help) {
        console.log('Usage: npm run specter toc <file> [section]');
        console.log('');
        console.log('Displays the table of contents for the specified file.');
        console.log('If [section] is provided, it shows only the top-level sub-sections of that section.');
        console.log('');
        console.log('Options:');
        console.log('  --help    Display this help message');
        return;
    }

    if (!file) {
        console.error('Error: No specification file specified.');
        return;
    }

    const filePath = path.resolve(process.cwd(), file);
    const { sections } = parseSpecFile(filePath);

    if (sections.length === 0) {
        console.log('No specification items found in file.');
        return;
    }

    const targetSections = getTopLevelSections(sections, sectionNumber);

    if (targetSections.length === 0) {
        if (options.json) {
            console.log(JSON.stringify({ error: sectionNumber ? `No sub-sections found for ${sectionNumber}.` : 'No top-level sections found.' }));
        } else {
            console.log(sectionNumber
                ? `No sub-sections found for ${sectionNumber}.`
                : 'No top-level sections found.');
        }
        return;
    }

    if (options.json) {
        const sectionsList = targetSections.map(s => {
            const allSubSections = getSectionsByParent(sections, s.number);
            return {
                number: s.number,
                name: s.text,
                total_lines: allSubSections.length
            };
        });
        console.log(JSON.stringify({ sections: sectionsList }, null, 2));
    } else {
        console.log(`Table of Contents for ${file}${sectionNumber ? ` section ${sectionNumber}` : ''}:`);
        console.log('--------------------------------------------------');

        targetSections.forEach(s => {
            const allSubSections = getSectionsByParent(sections, s.number);
            console.log(`${s.number} ${s.text} (${allSubSections.length} spec lines)`);
        });
    }
}
