import { defineConfig } from '@rsbuild/core';
import path from 'node:path';

const dirName = path.basename(process.cwd());

export default defineConfig({
  source: {
    entry: {
      index: './src/main.ts',
    },
    define: {
      __DIRNAME__: JSON.stringify(dirName),
    },
  },
  html: {
    template: './public/index.html',
    title: dirName,
  },
});
