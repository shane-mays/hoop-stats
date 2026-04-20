// eslint.config.mjs
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default {
  files: ['./src/**/*.ts', './src/**/*.tsx'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
  },
  plugins: {
    react,
    'react-hooks': reactHooks,
    '@typescript-eslint': tsPlugin,
    prettier: prettierPlugin,
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        trailingComma: 'all',
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
            message: 'Use extensionless imports for internal modules.',
          },
        ],
      },
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
  settings: { react: { version: 'detect' } },
};
