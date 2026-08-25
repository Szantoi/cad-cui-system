import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';

const sourceFiles = [
  'src/**/*.{js,jsx}',
  'test/**/*.{js,jsx}',
  'demo/src/**/*.{js,jsx}',
  'vite.config.js',
  'demo/vite.config.js',
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
      'react-hooks': reactHooks
    },
    rules: {
      'no-unused-vars': ['error', {
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
