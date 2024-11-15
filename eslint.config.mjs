import drizzle from 'eslint-plugin-drizzle';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      'eslint.config.mjs',
      'next.config.mjs',
      'lint-staged.config.cjs',
      'postcss.config.js',
      'prettier.config.cjs',
      '.next',
    ],
  },
  ...compat.extends('plugin:drizzle/recommended', 'next/core-web-vitals'),
  {
    plugins: {
      drizzle,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: './tsconfig.json',
      },
    },

    rules: {
      'drizzle/enforce-delete-with-where': [
        'error',
        {
          drizzleObjectName: ['db'],
        },
      ],
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];
