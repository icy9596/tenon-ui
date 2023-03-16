import { defineConfig } from 'father';

export default defineConfig({
  esm: {
    input: 'src',
    output: 'es',
    ignores: ['**/demo/*'],
  },
  cjs: {
    input: 'src',
    output: 'lib',
    ignores: ['**/demo/*'],
    transformer: 'babel',
  },
  umd: {
    entry: 'src',
    output: 'dist',
    externals: {
      react: 'react',
    },
  },
});
