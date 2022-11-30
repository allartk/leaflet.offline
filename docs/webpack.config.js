const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: path.join(__dirname, 'src', 'index.js'),
    list: path.join(__dirname, 'src', 'list.js'),
    apilayer: path.join(__dirname, 'src', 'apilayer.js'),
  },
  output: {
    publicPath: '/dist/',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '_site'),
    },
    devMiddleware: {
      writeToDisk: true,
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'dist/bundle.js',
          to: 'leaflet.offline.bundle.js',
          context: 'node_modules/leaflet.offline/',
        },
      ],
    }),
  ],
};
