var webpack = require('webpack');

module.exports = {
  entry: './main.coffee',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.coffee$/, loader: "coffee-loader"},
    {test: /\.css$/, loader: "style-loader!css-loader"},
  { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=1000000&minetype=application/font-woff" },
{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};
