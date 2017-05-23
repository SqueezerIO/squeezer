const path = require('path');
const fs   = require('fs');

const babelRC = JSON.parse(fs.readFileSync(`${__dirname}/../../.babelrc`, 'utf8'));

module.exports = {
  context   : path.join(__dirname),
  devtool   : 'eval',
  externals : {
    react       : 'React',
    'react-dom' : 'ReactDOM'
  },
  resolve   : {
    extensions : ['.js', '.jsx']
  },
  module    : {
    loaders : [
      {
        test    : /(\.js|\.jsx)$/,
        exclude : /(node_modules)/,
        loader  : 'babel-loader',
        query   : {
          presets        : babelRC.presets,
          cacheDirectory : true,
          compact        : true
        }
      },
      {
        test   : /\.json$/,
        loader : 'json-loader'
      },
      {
        test    : /\.yaml$/,
        include : path.resolve('data'),
        loader  : 'yaml'
      }
    ]
  },
  plugins   : []
};
