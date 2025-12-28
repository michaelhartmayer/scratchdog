import fs from 'fs';
import path from 'path';

export function createCommand(folder, filename, initialTitle, options = {}) {
  // Combine title if it was split across multiple arguments
  // Arguments: folder, filename, title...
  // In index.js, we will pass (args[1], args[2], args.slice(3).join(' '))
  // So initialTitle here will be the full title string already.
  let title = initialTitle;

  if (options.help) {
    console.log('Usage: npm run specter create <folder> <filename> <title>');
    console.log('');
    console.log('Creates a new specification file.');
    console.log('');
    console.log('Arguments:');
    console.log('  <folder>    The directory where the file should be created');
    console.log(
      '  <filename>  The name of the file (extension .spec.md is optional)',
    );
    console.log(
      '  <title>     The main title of the specification (quoted or unquoted)',
    );
    console.log('');
    console.log('Options:');
    console.log('  --help      Display this help message');
    console.log('  --json      Display the created file info as a JSON object');
    return;
  }

  if (!folder || !filename || !title) {
    console.error('Error: valid folder, filename and title are required.');
    console.log('Usage: npm run specter create <folder> <filename> <title>');
    process.exit(1);
  }

  const fullFolderPath = path.resolve(process.cwd(), folder);

  if (!fs.existsSync(fullFolderPath)) {
    fs.mkdirSync(fullFolderPath, { recursive: true });
  }

  let finalFilename = filename;
  if (!finalFilename.endsWith('.spec.md')) {
    finalFilename += '.spec.md';
  }

  const fullFilePath = path.join(fullFolderPath, finalFilename);

  if (fs.existsSync(fullFilePath)) {
    console.error(`Error: File ${fullFilePath} already exists.`);
    process.exit(1);
  }

  const content = `# ${title}\n\n`;
  fs.writeFileSync(fullFilePath, content, 'utf8');

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          created: true,
          file: fullFilePath,
          title: title,
        },
        null,
        2,
      ),
    );
  } else {
    console.log(`Created new specification file at ${fullFilePath}`);
  }
}
