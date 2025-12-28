import { RuleTester } from 'eslint';
import rule from './rule.js';

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

ruleTester.run('hook-organization', rule, {
  valid: [
    {
      code: 'export const A = 1;',
      filename: '/src/hooks/useMyHook/useMyHook.ts',
    },
    {
      code: 'export const B = 1;',
      filename: '/src/hooks/useMyHook/index.ts',
    },
    {
      code: 'export const C = 1;',
      filename: '/src/other/test.ts',
    },
  ],
  invalid: [
    {
      code: 'export const A = 1;',
      filename: '/src/hooks/useMyHook.ts',
      errors: [
        {
          message: 'File useMyHook.ts must be inside a folder named useMyHook',
        },
      ],
    },
    {
      code: 'export const B = 1;',
      filename: '/src/hooks/WrongFolder/useMyHook.ts',
      errors: [
        {
          message: 'File useMyHook.ts must be inside a folder named useMyHook',
        },
      ],
    },
  ],
});
