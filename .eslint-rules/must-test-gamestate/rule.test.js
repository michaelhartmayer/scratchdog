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

ruleTester.run('must-test-gamestate', rule, {
  valid: [
    {
      code: `
        /** @mustTestDrMarioGamestate */
        test('test with getE2EState', async ({ page }) => {
          const state = getE2EState('DRMARIO_STATE');
        });
      `,
    },
    {
      code: `
        test('untagged test', async ({ page }) => {
          // no evaluation needed
        });
      `,
    },
  ],
  invalid: [
    {
      code: `
        /** @mustTestDrMarioGamestate */
        test(
          'tagged test without evaluation', async ({ page }) => {
          await page.goto('/');
        });
      `,
      errors: [{ messageId: 'mustTestGameState' }],
    },
    {
      code: `
        /** @mustTestDrMarioGamestate */
        test('tagged test with forbidden direct access', async ({ page }) => {
          const state = await page.evaluate(() => window.__DRMARIO_STATE__);
        });
      `,
      errors: [{ messageId: 'mustTestGameState' }],
    },
  ],
});
