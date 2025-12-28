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

ruleTester.run('no-html-buttons', rule, {
    valid: [
        {
            code: '<Button>Click me</Button>',
            filename: '/src/components/Anywhere/Anywhere.tsx',
        },
        {
            code: '<button>Native button</button>',
            filename: '/src/components/DesignSystem/Button/Button.tsx',
        },
        {
            code: '<button>Native button</button>',
            filename: '/src/components/DesignSystem/index.ts',
        },
    ],
    invalid: [
        {
            code: '<button>Click me</button>',
            filename: '/src/components/App.tsx',
            errors: [{ messageId: 'noHtmlButton' }],
        },
        {
            code: '<div><button>Click me</button></div>',
            filename: '/src/pages/Home.tsx',
            errors: [{ messageId: 'noHtmlButton' }],
        },
    ],
});
