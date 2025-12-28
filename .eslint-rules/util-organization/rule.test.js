import { RuleTester } from 'eslint';
import rule from './rule.js';

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

ruleTester.run('util-organization', rule, {
  valid: [
    {
      code: 'export const A = 1;',
      filename: '/src/utils/myUtil/myUtil.ts',
    },
    {
      code: 'export const B = 1;',
      filename: '/src/utils/myUtil/index.ts',
    },
    {
      code: 'export const C = 1;',
      filename: '/src/other/test.ts',
    },
  ],
  invalid: [
    {
      code: 'export const A = 1;',
      filename: '/src/utils/myUtil.ts',
      errors: [
        { message: 'File myUtil.ts must be inside a folder named myUtil' },
      ],
    },
    {
      code: 'export const B = 1;',
      filename: '/src/utils/WrongFolder/myUtil.ts',
      errors: [
        { message: 'File myUtil.ts must be inside a folder named myUtil' },
      ],
    },
  ],
});
