import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  publicPath: '/tenon-ui/',
  base: '/tenon-ui/',
  themeConfig: {
    name: 'tenon-ui',
  },
  resolve: {
    atomDirs: [
      { type: 'component', dir: 'packages/components/src' },
      { type: 'component', dir: 'packages/icons/src' },
    ],
  },
  alias: {
    '@tenon-ui/components': require.resolve('./packages/components/src'),
    '@tenon-ui/icons': require.resolve('./packages/icons/src'),
  },
});
