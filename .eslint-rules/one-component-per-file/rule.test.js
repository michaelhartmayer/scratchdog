import { RuleTester } from 'eslint';
import rule from './rule.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run('one-component-per-file', rule, {
  valid: [
    'const a = 1;',
    'function ComponentOne() { return <div />; }',
    'const ComponentTwo = () => <div />;',
  ],
  invalid: [
    {
      code: `
function ComponentOne() { return <div />; }
function ComponentTwo() { return <div />; }
`,
      errors: [{ message: 'Only one React component per file is allowed.' }],
    },
    {
      code: `
const ComponentOne = () => <div />;
const ComponentTwo = () => <div />;
`,
      errors: [{ message: 'Only one React component per file is allowed.' }],
    },
  ],
});
