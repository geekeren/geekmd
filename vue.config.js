const path = require('path');

module.exports = {
  publicPath: '/',
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      },
    },
  },
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
    auth: {
      entry: 'src/auth/main.js',
      template: 'public/auth/index.html',
      filename: 'auth/index.html',
      inject: true,
    },
  },
};
