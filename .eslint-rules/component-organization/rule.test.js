import { RuleTester } from 'eslint';
import rule from './rule.js';

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

ruleTester.run('component-organization', rule, {
  valid: [
    {
      code: 'export const A = 1;',
      filename: '/src/components/MyComp/MyComp.tsx',
    },
    {
      code: 'export const B = 1;',
      filename: '/src/providers/MyProvider/MyProvider.tsx',
    },
    {
      code: 'export const C = 1;',
      filename: '/src/other/test.ts', // Outside specific folders
    },
    {
      code: 'export const D = 1;',
      filename: '/src/components/MyComp/index.ts',
    },
  ],
  invalid: [
    {
      code: 'export const A = 1;',
      filename: '/src/components/MyComp.tsx',
      errors: [
        { message: 'File MyComp.tsx must be inside a folder named MyComp' },
      ],
    },
    {
      code: 'export const B = 1;',
      filename: '/src/providers/WrongFolder/MyProvider.tsx',
      errors: [
        {
          message:
            'File MyProvider.tsx must be inside a folder named MyProvider',
        },
      ],
    },
  ],
});
