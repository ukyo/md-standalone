var fs = require('fs')
var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');

module.exports = function mdst(options, callback) {
  var outJsPath = path.resolve(__dirname, '../tmp/out-' + Date.now() + '.js');
  var webpackConfig = {
    entry: './entry.js',
    output: {
      filename: outJsPath
    },
    context: __dirname,
    resolve: {
      alias: {
        mdPath: options.input,
        jsPath: options.js || './defaultRenderer.js',
        styleSheetPath: options.styleSheetPath,
        codeThemePath: 'highlight.js/styles/' + options.codeTheme + '.css',
        mdHelper: './mdHelper.js',
        tocHelper: './tocHelper.js',
        options: './options.js'
      }
    },
    module: {
      loaders: [
        {test: /\.woff(\?.*)?$/, loader: "url?mimetype=application/font-woff"},
        {test: /\.ttf(\?.*)?$/, loader: "url?mimetype=application/x-font-truetype"},
        {test: /\.eot(\?.*)?$/, loader: "url?mimetype=application/vnd.ms-fontobject"},
        {test: /\.svg(\?.*)?$/, loader: "url?mimetype=image/svg+xml"},
        {test: /\.otf(\?.*)?$/, loader: "url?mimetype=application/x-font-opentype"},
        {test: /\.gif(\?.*)?$/, loader: "url?mimetype=image/gif"},
        {test: /\.jpg(\?.*)?$/, loader: "url?mimetype=image/jpg"},
        {test: /\.png(\?.*)?$/, loader: "url?mimetype=image/png"},
        {test: /\.css$/, loader: "style!css!autoprefixer?browsers=last 2 versions"},
        {test: /\.scss$/, loader: "style!css!autoprefixer?browsers=last 2 versions!sass"},
        {test: /\.less$/, loader: "style!css!autoprefixer?browsers=last 2 versions!less"}
      ]
    },
    plugins: options.minify ? [
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin()
    ] : []
  };

  webpack(webpackConfig, function(err) {
    if (err) callback(err, null);
    var outJs = fs.readFileSync(outJsPath);
    fs.unlinkSync(outJsPath);

    var _options = {
      codeTheme: options.codeTheme,
      toc: options.toc,
      level: options.level
    };

    var outHtml = [
      '<!doctype html>' +
      '<html>' +
        '<head>' +
          '<meta charset="UTF-8">' +
          '<title></title>' +
          '<script>window.__OPTIONS__ = ' + JSON.stringify(_options) + '</script>' +
          '<script>' + outJs + '</script>' +
        '</head>' +
        '<body></body>' +
      '</html>'
    ].join('\n');
    callback(null, outHtml);
  });
};
