
const nodeExternals = require('webpack-node-externals');
const WebpackSourceMapSupport = require('webpack-source-map-support');

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  devtool: 'source-map',
  node: {
    __filename: true,
    __dirname: true
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: __dirname,
      exclude: /node_modules/
    }]
  },
  output: {
    libraryTarget: 'commonjs'
  },
  plugins: [
    new WebpackSourceMapSupport()
  ]
};
