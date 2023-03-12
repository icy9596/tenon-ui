import { defineConfig } from 'father';

const buildType = process.env.BUILD_TYPE;

const getConfig = (type) => {
  if (buildType === 'components') {
    return {
      esm: {
        input: 'packages/ui/src',
        output: 'packages/ui/es',
        ignores: ['**/demo/*'],
        transformer: 'babel',
      },
      cjs: {
        input: 'packages/ui/src',
        output: 'packages/ui/lib',
        ignores: ['**/demo/*'],
        transformer: 'babel',
      },
      umd: {
        entry: 'packages/ui/src',
        output: 'packages/ui/dist',
        externals: {
          react: 'react',
        },
        name: 'cui',
      },
    };
  } else {
    return {
      esm: {
        input: 'packages/icons/src',
        output: 'packages/icons/es',
        ignores: ['**/demo/*'],
      },
      cjs: {
        input: 'packages/icons/src',
        output: 'packages/icons/lib',
        ignores: ['**/demo/*'],
      },
      umd: {
        entry: 'packages/icons/src',
        output: 'packages/icons/dist',
        externals: {
          react: 'react',
        },
        name: 'cuiIcons',
        chainWebpack(memo) {
          // console.log('------------------', memo)
          memo.output.filename = 'cui-icons.min.js';
          return memo;
        },
      },
    };
  }
};

const config = getConfig(buildType);

export default defineConfig(config);
