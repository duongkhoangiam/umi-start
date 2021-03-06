import path from 'path';
import defaultSettings from './src/defaultSetting';

const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

// ref: https://umijs.org/config/
// theme: https://github.com/ant-design/ant-design-mobile/blob/master/components/style/themes/default.less
export default {
  sass: {},
  targets: {
    android: 5,
    ios: 10,
    chrome: 46,
    firefox: 45,
    safari: 10,
  },
  theme: {
    ...defaultSettings.theme,
  },
  proxy: {
    '/mock': {
      target: 'https://www.easy-mock.com/mock/5c34bf0190862b0b0cf503c0',
      changeOrigin: true,
    },
  },
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  hash: process.env.NODE_ENV === 'production',
  treeShaking: true,
  chainWebpack: (config, { webpack }) => {
    if (process.env.NODE_ENV === 'production') {
      config
        .plugin('html-critical')
        .use(HtmlCriticalWebpackPlugin, [
          {
            base: path.resolve(__dirname, 'dist'),
            src: 'index.html',
            dest: 'index.html',
            inline: true,
            minify: true,
            extract: true,
            width: 375,
            height: 565,
            penthouse: {
              blockJSRequests: false,
            },
          },
        ])
        .end()
        .plugin('gzip')
        .use(CompressionPlugin, [
          {
            cache: true,
          },
        ])
        .after('html-critical');
    }
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: true,
        title: 'teacher',
        dll: true,
        hd: true,
        fastClick: true,
        hardSource:
          /* isMac */ process.env.NODE_ENV === 'development'
            ? false
            : process.platform === 'darwin',
        pwa: {
          manifestOptions: {
            srcPath: 'public/manifest.json',
          },
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
            swSrc: 'src/service-worker.js',
            swDest: 'service-worker.js',
            exclude: [/\.html$/],
          },
        },
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: './components/PageLoading/index',
        },
        routes: {
          exclude: [/components/],
        },
      },
    ],
  ],
};
