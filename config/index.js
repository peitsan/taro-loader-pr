/* eslint-disable import/no-commonjs */
const { resolve } = require('path');

const config = {
  projectName: 'gridapp',
  date: '2022-11-26',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  globalObject: 'this',
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['taro-plugin-compiler-optimization'],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false,
    },
  },
  cache: {
    enable: true,
    type: 'filesystem',
    buildDependencies: {
      config: [resolve(__dirname, './dev.js'), __filename],
    },
  },
  mini: {
    baseLevel: 8,
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    webpackChain: chain => {
      chain.merge({
        plugin: {
          install: {
            plugin: require('terser-webpack-plugin'),
            args: [
              {
                terserOptions: {
                  compress: true,
                  keep_classnames: true,
                },
              },
            ],
          },
        },
      });
    },
  },
  h5: {
    baseLevel: 8,
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  alias: {
    '@': resolve(__dirname, '../src/'),
    '@styles': resolve(__dirname, '../src/styles'),
    '@interface': resolve(__dirname, '../src/interface'),
    '@hooks': resolve(__dirname, '../src/common/hooks'),
    '@assets': resolve(__dirname, '../src/assets'),
    '@apis': resolve(__dirname, '../src/apis'),
    '@utils': resolve(__dirname, '../src/utils'),
    '@components': resolve(__dirname, '../src/components'),
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
