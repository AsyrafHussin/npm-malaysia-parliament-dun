import { defineConfig } from 'tsup';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

const banner = `/*!
 *
 *   malaysia-parliament-dun v${packageJson.version} (https://github.com/AsyrafHussin/npm-malaysia-parliament-dun)
 *   Copyright 2026 Asyraf Hussin
 *   Licensed under ISC (https://github.com/AsyrafHussin/npm-malaysia-parliament-dun/blob/main/LICENSE)
 *
 */`;

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    outDir: 'dist',
    banner: {
      js: banner
    },
    outExtension({ format }) {
      return {
        js: format === 'cjs' ? '.cjs' : '.js'
      };
    }
  },
  {
    entry: { 'malaysia-parliament-dun': 'src/index.ts' },
    format: ['iife'],
    globalName: 'malaysiaParliamentDun',
    outDir: 'dist',
    banner: {
      js: banner
    },
    minify: false,
    clean: false,
    outExtension() {
      return {
        js: '.js'
      };
    }
  },
  {
    entry: { 'malaysia-parliament-dun.min': 'src/index.ts' },
    format: ['iife'],
    globalName: 'malaysiaParliamentDun',
    outDir: 'dist',
    banner: {
      js: banner
    },
    minify: true,
    clean: false,
    outExtension() {
      return {
        js: '.js'
      };
    }
  }
]);
