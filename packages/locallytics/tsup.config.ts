import { defineConfig } from 'tsup';
import { rmSync } from 'fs';

// Clean up the dist directory before building
rmSync('dist', { recursive: true, force: true });

export default defineConfig([
  // Main library build
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: {
      // Generate declaration files in the dist directory
      entry: 'src/index.ts',
      resolve: true,
    },
    sourcemap: true,
    clean: false, // We're handling cleaning manually
    target: 'es2022',
    splitting: false,
    minify: false,
    outDir: 'dist',
    tsconfig: './tsconfig.json',
  },
  // CLI build
  {
    entry: ['src/cli.ts'],
    format: ['esm'],
    dts: false,
    sourcemap: true,
    clean: false,
    target: 'es2022',
    splitting: false,
    minify: false,
    outDir: 'dist',
    tsconfig: './tsconfig.json',
    shims: true,
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
