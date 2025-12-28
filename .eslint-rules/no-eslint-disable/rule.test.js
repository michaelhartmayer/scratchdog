
import { RuleTester } from 'eslint';
import rule from './rule.js';

const ruleTester = new RuleTester({
    languageOptions: { ecmaVersion: 2020 },
});

ruleTester.run('no-eslint-disable', rule, {
    valid: [
        '// This is a normal comment',
        '/* This is also a normal comment */',
        'const x = 1;',
    ],
    invalid: [
        {
            code: '// eslint-disable-next-line no-console',
            errors: [{ messageId: 'noDisable' }],
        },
        {
            code: '/* eslint-disable no-console */',
            errors: [{ messageId: 'noDisable' }],
        },
        {
            code: '// eslint-disable-line no-console',
            errors: [{ messageId: 'noDisable' }],
        },
        {
            code: '/* eslint-disable-next-line no-console */',
            errors: [{ messageId: 'noDisable' }],
        },
    ],
});


