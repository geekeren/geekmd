module.exports = {
  publicPath: '/',
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'src/main.ts',
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
