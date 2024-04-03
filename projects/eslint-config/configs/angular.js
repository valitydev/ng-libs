const path = require('path');

const TS = '*.ts';
const HTML = '*.html';

module.exports = (prefix = 'app', dir) => ({
    overrides: [
        {
            files: [dir ? path.join(dir, TS) : TS],
            extends: [
                'plugin:@angular-eslint/recommended',
                'plugin:@angular-eslint/template/process-inline-templates',
            ],
            rules: {
                '@angular-eslint/directive-selector': [
                    'error',
                    {
                        type: 'attribute',
                        prefix,
                        style: 'camelCase',
                    },
                ],
                '@angular-eslint/component-selector': [
                    'error',
                    {
                        type: 'element',
                        prefix,
                        style: 'kebab-case',
                    },
                ],
            },
        },
        {
            files: [dir ? path.join(dir, HTML) : HTML],
            extends: ['plugin:@angular-eslint/template/recommended'],
            rules: {
                '@angular-eslint/template/no-negated-async': 'off',
            },
        },
    ],
});
