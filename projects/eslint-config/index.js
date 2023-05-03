module.exports = {
    root: true,
    globals: {},
    ignorePatterns: [
        '**/*.json',
        '**/*.md',
        '**/*.?css',
        '**/*.js',
        '**/*.conf',
        '**/*.ico',
        'Dockerfile',
        'dist',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
    },
    overrides: [
        {
            files: ['*.ts'],
            plugins: ['unused-imports'],
            extends: [
                'eslint:recommended',
                'plugin:import/recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:import/typescript',
                'prettier',
            ],
            rules: {
                'no-console': ['error', { allow: ['warn', 'error'] }],
                '@typescript-eslint/member-ordering': [
                    'error',
                    {
                        default: [
                            'signature',

                            'public-field',
                            'protected-field',
                            'private-field',

                            'constructor',

                            'public-method',
                            'protected-method',
                            'private-method',
                        ],
                    },
                ],
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        selector: 'default',
                        format: ['strictCamelCase'],
                        leadingUnderscore: 'allow',
                    },
                    {
                        selector: 'default',
                        modifiers: ['destructured'],
                        format: null,
                    },
                    {
                        selector: 'typeLike',
                        format: ['StrictPascalCase'],
                    },
                    {
                        selector: 'variable',
                        modifiers: ['const', 'global'],
                        format: ['UPPER_CASE'],
                    },
                    {
                        selector: 'variable',
                        modifiers: ['const', 'global'],
                        // Objects are functions too
                        types: ['function'],
                        format: ['UPPER_CASE', 'strictCamelCase'],
                    },
                    {
                        selector: 'enumMember',
                        format: ['StrictPascalCase'],
                    },
                    {
                        selector: ['objectLiteralProperty', 'typeProperty'],
                        format: ['strictCamelCase', 'snake_case'],
                        leadingUnderscore: 'allow',
                        trailingUnderscore: 'allow',
                    },
                    {
                        selector: [
                            'classProperty',
                            'objectLiteralProperty',
                            'typeProperty',
                            'classMethod',
                            'objectLiteralMethod',
                            'typeMethod',
                            'accessor',
                            'enumMember',
                        ],
                        modifiers: ['requiresQuotes'],
                        format: null,
                    },
                ],
                'import/no-unresolved': 'off',
                '@typescript-eslint/no-unused-vars': 'off',
                'unused-imports/no-unused-imports': 'error',
                'unused-imports/no-unused-vars': [
                    'error',
                    {
                        vars: 'all',
                        varsIgnorePattern: '^_',
                        args: 'after-used',
                        argsIgnorePattern: '^_',
                    },
                ],
            },
        },
        ...require('./configs/import-order')().overrides,
    ],
};
