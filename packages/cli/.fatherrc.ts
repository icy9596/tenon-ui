import { defineConfig } from 'father';

export default defineConfig({
  platform: 'node',
  cjs: {
    input: 'src',
    output: 'lib',
  },
});
