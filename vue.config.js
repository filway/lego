const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const isStaging = !!process.env.VUE_APP_STAGING;
const isProduction = process.env.NODE_ENV === 'production';
const isAnalyzeMode = !!process.env.ANALYZE_MODE;

module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  publicPath: (isProduction && !isStaging) ? 'https://oss.filway.cn/editor' : '/',
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#3E7FFF',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  configureWebpack: (config) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    );
    if (isProduction) {
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: /\.js$|\.html$|\.json$|\.css/,
          threshold: 10240,
        }),
      );
    }
    if (isAnalyzeMode) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
        }),
      );
    }
    config.optimization.splitChunks = {
      maxInitialRequests: Infinity,
      minSize: 300 * 1024,
      chunks: 'all',
      cacheGroups: {
        antVendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name.
            // node_modules/packageName/sub/path
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    };
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '慕课乐高';
      args[0].desc = '一键生成 H5 海报';
      return args;
    });
  },
};
