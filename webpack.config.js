const path = require('path');

module.exports = {
  entry: './src/js/i18n.js',  // Your main entry point
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '_site/js'),  // Output directory
  },
  mode: 'production',  // or 'development' for unminified output
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
};
