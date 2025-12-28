#!/usr/bin/env node

import { listCommand } from './list.js';
import { tocCommand } from './toc.js';
import { specCommand } from './display.js';
import { diffCommand } from './diff.js';

const args = process.argv.slice(2);
const command = args[0];

const positionalArgs = args.filter((arg) => !arg.startsWith('-'));
const options = {
  help: args.includes('--help') || args.includes('-h'),
  json: args.includes('--json'),
};

function displayGeneralHelp() {
  console.log('Specter CLI - Specification Management Tool');
  console.log('');
  console.log('Usage: npm run specter <command> [args]');
  console.log('');
  console.log('Commands:');
  console.log(
    '  list [folder]          Lists all *.spec.md files in the folder (defaults to "specifications")',
  );
  console.log(
    '  toc <file> [section]   Displays the table of contents for a spec file',
  );
  console.log(
    '  spec <file> [section]  Displays the specification for a file or section',
  );
  console.log(
    '  diff <file> [section]  Displays changes in a spec file since the last commit',
  );
  console.log('  help                   Displays this help message');
  console.log('');
  console.log(
    'Use "npm run specter <command> --help" for more information on a specific command.',
  );
}

if (!command || command === 'help' || (options.help && args.length === 1)) {
  displayGeneralHelp();
  process.exit(0);
}

switch (command) {
  case 'list':
    listCommand(positionalArgs[1], options);
    break;
  case 'toc':
    tocCommand(positionalArgs[1], positionalArgs[2], options);
    break;
  case 'spec':
    specCommand(positionalArgs[1], positionalArgs[2], options);
    break;
  case 'diff':
    diffCommand(positionalArgs[1], positionalArgs[2], options);
    break;
  default:
    console.error(`Unknown command: ${command}`);
    displayGeneralHelp();
    process.exit(1);
}
