import { RuleTester } from 'eslint';
import rule from './rule.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-commonjs-in-eslint-rules', rule, {
  valid: [
    // ESM import is allowed
    {
      code: "import rule from './rule.js';",
      filename: '/.eslint-rules/my-rule/rule.js',
    },
    // ESM export is allowed
    {
      code: 'export default rule;',
      filename: '/.eslint-rules/my-rule/rule.js',
    },
    // CommonJS is fine outside .eslint-rules/
    {
      code: "const x = require('foo');",
      filename: '/src/utils/test.js',
    },
    {
      code: 'module.exports = {};',
      filename: '/scripts/build.js',
    },
  ],

  invalid: [
    // require() not allowed in .eslint-rules/
    {
      code: "const rule = require('./rule');",
      filename: '/.eslint-rules/my-rule/rule.test.js',
      errors: [{ messageId: 'noRequire' }],
    },
    // module.exports not allowed in .eslint-rules/
    {
      code: 'module.exports = rule;',
      filename: '/.eslint-rules/my-rule/rule.js',
      errors: [{ messageId: 'noModuleExports' }],
    },
    // exports.x not allowed in .eslint-rules/
    {
      code: 'exports.rule = rule;',
      filename: '/.eslint-rules/my-rule/rule.js',
      errors: [{ messageId: 'noModuleExports' }],
    },
    // .cjs extension not allowed
    {
      code: 'const x = 1;',
      filename: '/.eslint-rules/my-rule/rule.cjs',
      errors: [{ messageId: 'noCjsExtension' }],
    },
    // .mjs extension not allowed
    {
      code: 'const x = 1;',
      filename: '/.eslint-rules/my-rule/rule.mjs',
      errors: [{ messageId: 'noMjsExtension' }],
    },
  ],
});
