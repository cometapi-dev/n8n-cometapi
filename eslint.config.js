import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        module: 'readonly',
        exports: 'readonly',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
      'no-dupe-keys': 'error',
    },
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/*.js',
      '.eslintrc.js',
      '.prettierrc.js',
      'gulpfile.js',
      '**/*.json',
    ],
  },
];
