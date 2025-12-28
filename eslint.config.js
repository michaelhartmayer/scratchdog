import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import localRules from './.eslint-rules/index.js';

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'local-rules': localRules,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'local-rules/one-component-per-file': 'warn',
      'local-rules/component-organization': 'warn',
      'local-rules/hook-organization': 'warn',
      'local-rules/util-organization': 'warn',
      'local-rules/no-eslint-disable': 'error',
      'local-rules/no-html-buttons': 'error',
      'local-rules/no-html-headings': 'error',
      'local-rules/no-html-p': 'error',
      'local-rules/hook-naming': 'error',
      'local-rules/no-use-effect-in-components': 'error',

    },
  },
);
