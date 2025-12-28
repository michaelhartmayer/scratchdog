import fs from 'fs';
import path from 'path';
import { parseSpecFile, countSpecLines } from './parser.js';

export function listCommand(folder = 'specifications', options = {}) {
  if (options.help) {
    console.log('Usage: npm run specter list [folder]');
    console.log('');
    console.log(
      'Lists all specification files in the specified folder, recursively.',
    );
    console.log(
      'If no folder is provided, it defaults to the "specifications" directory.',
    );
    console.log('');
    console.log('Options:');
    console.log('  --help    Display this help message');
    console.log('  --json    Display the list as a JSON object');
    return;
  }

  const searchDir = path.resolve(process.cwd(), folder);
  if (!fs.existsSync(searchDir)) {
    if (options.json) {
      console.log(JSON.stringify({ error: `Directory ${folder} not found.` }));
    } else {
      console.error(`Error: Directory ${folder} not found.`);
    }
    return;
  }

  const specFiles = [];

  function findSpecs(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findSpecs(fullPath);
      } else if (file.endsWith('.spec.md')) {
        specFiles.push(fullPath);
      }
    }
  }

  findSpecs(searchDir);

  if (specFiles.length === 0) {
    if (options.json) {
      console.log(JSON.stringify({ files: [] }));
    } else {
      console.log('No specification files found.');
    }
    return;
  }

  if (options.json) {
    const fileList = specFiles.sort().map((filePath) => {
      const relativePath = path.relative(process.cwd(), filePath);
      const { sections } = parseSpecFile(filePath);
      return {
        path: relativePath,
        name: path.basename(relativePath),
        total_lines: countSpecLines(sections),
      };
    });
    console.log(JSON.stringify({ files: fileList }, null, 2));
  } else {
    console.log('Specification Files:');
    console.log('--------------------');

    specFiles.sort().forEach((filePath) => {
      const relativePath = path.relative(process.cwd(), filePath);
      const { sections } = parseSpecFile(filePath);
      const lineCount = countSpecLines(sections);

      const dir = path.dirname(relativePath);
      const name = path.basename(relativePath);

      console.log(
        `${dir === '.' ? '' : dir + '/'}${name} (${lineCount} spec lines)`,
      );
    });
  }
}
