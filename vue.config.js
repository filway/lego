const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isStaging = !!process.env.VUE_APP_STAGING;
const isProduction = process.env.NODE_ENV === 'production';
const isAnalyzeMode = !!process.env.ANALYZE_MODE;

module.exports = {
  devServer: {
    disableHostCheck: true,
  },
  publicPath: (isProduction && !isStaging) ? 'https://oss.imooc-lego.com/editor' : '/',
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
    if (isAnalyzeMode) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
        }),
      );
    }
  },
};
