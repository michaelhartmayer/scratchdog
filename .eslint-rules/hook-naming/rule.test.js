import { RuleTester } from 'eslint';
import rule from './rule.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('hook-naming', rule, {
  valid: [
    {
      code: 'export const useCustomHook = () => {};',
      filename: '/src/hooks/useCustomHook.ts',
    },
    {
      code: 'export function useAnotherHook() {}',
      filename: '/src/hooks/useAnotherHook.ts',
    },
    {
      code: 'export default function useDefaultHook() {}',
      filename: '/src/hooks/useDefaultHook.ts',
    },
    {
      code: 'export const notAHook = () => {};',
      filename: '/src/utils/notAHook.ts',
    },
  ],
  invalid: [
    {
      code: 'export const customHook = () => {};',
      filename: '/src/hooks/customHook.ts',
      errors: [{ messageId: 'hookNaming', data: { name: 'customHook' } }],
    },
    {
      code: 'export function anotherHook() {}',
      filename: '/src/hooks/anotherHook.ts',
      errors: [{ messageId: 'hookNaming', data: { name: 'anotherHook' } }],
    },
    {
      code: 'export default function defaultHook() {}',
      filename: '/src/hooks/defaultHook.ts',
      errors: [{ messageId: 'hookNaming', data: { name: 'defaultHook' } }],
    },
  ],
});
