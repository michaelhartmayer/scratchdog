import { RuleTester } from 'eslint';
import rule from './rule.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-use-effect-in-components', rule, {
  valid: [
    {
      code: 'import { useEffect } from "react"; const useMyHook = () => { useEffect(() => {}, []); };',
      filename: '/src/hooks/useMyHook.ts',
    },
    {
      code: 'import { useEffect } from "react"; function useAnotherHook() { useEffect(() => {}, []); }',
      filename: '/src/hooks/useAnotherHook.ts',
    },
  ],
  invalid: [
    {
      code: 'import { useEffect } from "react"; const MyComponent = () => { useEffect(() => {}, []); return null; };',
      filename: '/src/components/MyComponent.tsx',
      errors: [{ messageId: 'noUseEffectInComponent' }],
    },
    {
      code: 'useEffect(() => {}, []);',
      filename: '/src/App.tsx',
      errors: [{ messageId: 'noUseEffectInComponent' }],
    },
  ],
});
