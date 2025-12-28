import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import localRules from './.eslint-rules/index.js';

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: [
          './tsconfig.app.json',
          './tsconfig.node.json',
          './tsconfig.e2e.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'local-rules': localRules,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'error',
        { allowConstantExport: true },
      ],
      'local-rules/one-component-per-file': 'error',
      'local-rules/component-organization': 'error',
      'local-rules/hook-organization': 'error',
      'local-rules/util-organization': 'error',
      'local-rules/no-eslint-disable': 'error',
      'local-rules/no-html-buttons': 'error',
      'local-rules/no-html-headings': 'error',
      'local-rules/no-html-p': 'error',
      'local-rules/hook-naming': 'error',
      'local-rules/no-use-effect-in-components': 'error',
      'local-rules/no-direct-e2e-state': 'error',
      'local-rules/no-commonjs-in-eslint-rules': 'error',
      'local-rules/must-test-gamestate': 'error',
    },
  },
  {
    files: [
      '.eslint-rules/**/*.js',
      'unit/**/*.js',
      'scripts/**/*.js',
      'eslint.config.js',
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.mocha, // For Vitest/Mocha style tests in unit/
      },
    },
    plugins: {
      'local-rules': localRules,
    },
    rules: {
      'local-rules/no-commonjs-in-eslint-rules': 'error',
      'no-undef': 'error',
      'no-unused-vars': 'off', // Lowered for tests/scripts as they often have many unused globals/imports
    },
  },
);
