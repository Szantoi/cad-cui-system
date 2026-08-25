import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const sourceFiles = [
  'src/**/*.{ts,tsx}',
  'test/**/*.{ts,tsx}',
  'demo/src/**/*.{ts,tsx}',
  'scripts/**/*.{js,mjs}',
  'vite.config.ts',
  'demo/vite.config.ts',
  'eslint.config.js'
];

export default [
  {
    ignores: ['dist/**', 'demo/dist/**', 'coverage/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    files: sourceFiles,
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        varsIgnorePattern: '^React$'
      }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error'
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
    }
  }
];
