const path = require('path');

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
    compress: true,
    port: 9000,
  },
};
