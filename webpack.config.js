const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  output: {
    path: path.resolve('public'),
    filename: 'bundle.js',
    libraryTarget: 'var',
    library: 'EntryPoint'
  }
};
