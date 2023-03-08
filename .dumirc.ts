import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'c-ui',
  },
  resolve: {
    atomDirs: [
      { type: 'component', dir: 'packages/ui/src' },
      { type: 'component', dir: 'packages/icons/src' },
    ],
  },
  alias: {
    'c-ui': require.resolve('./packages/ui/src'),
    '@cui/icons': require.resolve('./packages/icons/src'),
  },
  publicPath: './',
  runtimePublicPath: {},
});
