import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  { ignores: ['dist/', '.astro/', 'node_modules/', 'public/', '.claude/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      'max-lines':['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['warn', { max: 40, skipBlankLines: true, skipComments: true, IIFEs: true }]
    }
  },
  {
    files: ['**/*.glsl.ts'],
    rules: { 'max-lines-per-function': 'off' }
  }
);
