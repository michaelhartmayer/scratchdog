import { RuleTester } from 'eslint';
import rule from './rule.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-direct-e2e-state', rule, {
  valid: [
    // Allowed in env-utils
    {
      code: 'window.__GAME_STATE__ = {};',
      filename: '/src/utils/env-utils/env-utils.ts',
    },
    // Regular window access is fine
    {
      code: 'window.location.href;',
      filename: '/src/components/Test.tsx',
    },
    // Non-double-underscore properties are fine
    {
      code: "window.myProperty = 'test';",
      filename: '/src/components/Test.tsx',
    },
    // Single underscore prefix is fine
    {
      code: "window._private = 'test';",
      filename: '/src/components/Test.tsx',
    },
  ],

  invalid: [
    // Direct __*__ access not allowed outside env-utils
    {
      code: 'window.__GAME_STATE__ = {};',
      filename: '/src/components/GameScreen.tsx',
      errors: [{ messageId: 'noDirectE2EState' }],
    },
    {
      code: 'const state = window.__GAME_STATE__;',
      filename: '/src/game/Engine.ts',
      errors: [{ messageId: 'noDirectE2EState' }],
    },
  ],
});
