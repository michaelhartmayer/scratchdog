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

ruleTester.run('no-html-headings', rule, {
    valid: [
        {
            code: '<Text variant="hero">Title</Text>',
            filename: '/src/components/Anywhere/Anywhere.tsx',
        },
        {
            code: '<h1>Design System Heading</h1>',
            filename: '/src/components/DesignSystem/Text/Text.tsx',
        },
    ],
    invalid: [
        {
            code: '<h1>Title</h1>',
            filename: '/src/components/App.tsx',
            errors: [{ message: 'HTML <h1> tags are not allowed. Use Text from DesignSystem instead.' }],
        },
        {
            code: '<h3>Subheading</h3>',
            filename: '/src/pages/Home.tsx',
            errors: [{ message: 'HTML <h3> tags are not allowed. Use Text from DesignSystem instead.' }],
        },
    ],
});
