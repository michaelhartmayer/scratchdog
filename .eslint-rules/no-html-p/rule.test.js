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

ruleTester.run('no-html-p', rule, {
    valid: [
        {
            code: '<Text>Paragraph text</Text>',
            filename: '/src/components/Anywhere/Anywhere.tsx',
        },
        {
            code: '<p>Design System Paragraph</p>',
            filename: '/src/components/DesignSystem/Text/Text.tsx',
        },
    ],
    invalid: [
        {
            code: '<p>Paragraph text</p>',
            filename: '/src/components/App.tsx',
            errors: [{ messageId: 'noHtmlP' }],
        },
    ],
});
