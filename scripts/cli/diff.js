import path from 'path';
import { execSync } from 'child_process';
import { parseSpecFile, getSectionsByParent } from './parser.js';

export async function diffCommand(file, sectionNumber, options = {}) {
  if (options.help) {
    console.log('Usage: npm run specter diff <file> [section]');
    console.log('');
    console.log(
      'Displays changed specifications for the specified file since the last commit.',
    );
    console.log('Output is limited to changes since the last commit.');
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
  if (!path.relative(process.cwd(), filePath).endsWith('.spec.md')) {
    console.error('Error: Only .spec.md files are supported.');
    return;
  }

  const { lines, sections } = parseSpecFile(filePath);

  // Get changed lines using git diff
  let diffOutput = '';
  try {
    diffOutput = execSync(`git diff HEAD --unified=0 "${filePath}"`, {
      encoding: 'utf8',
    });
  } catch (e) {
    console.error('Error running git diff. Is this a git repository?');
    return;
  }

  const changedLineNumbers = new Set();
  const hunkHeaderRegex = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm;
  let match;
  while ((match = hunkHeaderRegex.exec(diffOutput)) !== null) {
    const startLine = parseInt(match[1]);
    const count = match[2] ? parseInt(match[2]) : 1;
    for (let i = 0; i < count; i++) {
      changedLineNumbers.add(startLine + i - 1); // 0-indexed
    }
  }

  if (changedLineNumbers.size === 0) {
    if (options.json) {
      console.log(JSON.stringify({ sections: [] }));
    } else {
      console.log('No changes found since last commit.');
    }
    return;
  }

  const targetSections = getSectionsByParent(sections, sectionNumber);
  const changedSections = targetSections.filter((s) =>
    changedLineNumbers.has(s.lineIndex),
  );

  if (changedSections.length === 0) {
    if (options.json) {
      console.log(JSON.stringify({ sections: [] }));
    } else {
      console.log(
        'No changed specification items found in the specified scope.',
      );
    }
    return;
  }

  if (options.json) {
    const { buildSectionTree } = await import('./parser.js');
    const sectionsTree = buildSectionTree(changedSections);
    console.log(JSON.stringify({ sections: sectionsTree }, null, 2));
  } else {
    console.log(
      `Changes in ${file}${sectionNumber ? ` section ${sectionNumber}` : ''}:`,
    );
    console.log('--------------------------------------------------');

    changedSections.forEach((s) => {
      console.log(s.fullLine);
    });
  }
}
