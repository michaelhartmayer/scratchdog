#!/usr/bin/env node

import { listCommand } from './list.js';
import { tocCommand } from './toc.js';
import { specCommand } from './display.js';
import { diffCommand } from './diff.js';
import { editCommand } from './edit.js';

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

  const commands = [
    {
      name: 'list [folder]',
      desc: 'Lists all *.spec.md files in the folder (defaults to "specifications")',
    },
    {
      name: 'toc <file> [section]',
      desc: 'Displays the table of contents for a spec file',
    },
    {
      name: 'spec <file> [section]',
      desc: 'Displays the specification for a file or section',
    },
    {
      name: 'diff <file> [section]',
      desc: 'Displays changes in a spec file since the last commit',
    },
    {
      name: 'edit <file> <section> <content>',
      desc: 'Updates the content of a spec section',
    },
    {
      name: 'add <file> <section> <content>',
      desc: 'Appends a new specification item',
    },
    { name: 'help', desc: 'Displays this help message' },
  ];

  commands.forEach((cmd) => {
    console.log(`  ${cmd.name.padEnd(35)}${cmd.desc}`);
  });

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
  case 'edit':
    editCommand(
      positionalArgs[1],
      positionalArgs[2],
      positionalArgs.slice(3).join(' '),
      options,
    );
    break;
  case 'add':
    const { addCommand } = await import('./add.js');
    addCommand(
      positionalArgs[1],
      positionalArgs[2],
      positionalArgs.slice(3).join(' '),
      options,
    );
    break;
  default:
    console.error(`Error: Unknown command: ${command}`);
    displayGeneralHelp();
    process.exit(1);
}
