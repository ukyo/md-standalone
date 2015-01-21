var fs = require('fs')
var mustache = require('mustache')
var render = require('./lib/render');
var path = require('path');
var webpack = require('webpack');


function readFile(path) {
  return fs.readFileSync(path, {encoding: 'utf-8'});
}

function writeFile(path, content) {
  return fs.writeFileSync(path, content, {encoding: 'utf-8'});
}

function removeFile(path) {
  return fs.unlinkSync(path);
}


module.exports = function mdst(options, callback) {
  var inputFile = {};
  inputFile.path = path.resolve(process.cwd(), options.input);
  inputFile.basename = path.basename(inputFile.path);
  inputFile.dir = path.resolve(path.dirname(inputFile.path));
  inputFile.content = readFile(inputFile.path);

  var mdRenderedFile = {};
  mdRenderedFile.path = inputFile.dir + '/tmp-' + inputFile.basename + '.html';
  mdRenderedFile.content = render(inputFile.content).replace(/<img src="([^"]+)"/g, function(all, imgPath) {
    var p = path.resolve(inputFile.dir, imgPath);
    if (/^https?:\/\//.test(imgPath)) return all;
    var ext = p.split('.').pop();
    return '<img src="data:image/' + ext + ';base64,' + fs.readFileSync(p).toString('base64') + '"';
  });
  writeFile(mdRenderedFile.path, mdRenderedFile.content);

  var entryFile = {};
  var headingsLevel = [];
  for (var i = options.level.top, n = options.level.bottom; i <= n; ++i) {
    headingsLevel.push('h' + i);
  }
  entryFile.path = __dirname + '/public/_main.jsx';
  entryFile.content = mustache.render(readFile(__dirname + '/public/main.jsx'), {
    RENDERED_PATH: mdRenderedFile.path,
    STYLESHEET_PATH: options.stylesheetPath,
    HEADINGS_LEVEL: headingsLevel.join()
  });
  writeFile(entryFile.path, entryFile.content);


  var bundleFile = {};
  bundleFile.path = inputFile.dir + '/tmp-bundle.js'

  var webpackConfig = {
    entry: entryFile.path,
    output: {
      filename: bundleFile.path
    },
    context: __dirname,
    module: {
      loaders: [
        {test: /\.woff(\?.*)?$/, loader: "url-loader?mimetype=application/font-woff"},
        {test: /\.ttf(\?.*)?$/, loader: "url-loader?mimetype=application/x-font-truetype"},
        {test: /\.eot(\?.*)?$/, loader: "url-loader?mimetype=application/vnd.ms-fontobject"},
        {test: /\.svg(\?.*)?$/, loader: "url-loader?mimetype=image/svg+xml"},
        {test: /\.otf(\?.*)?$/, loader: "url-loader?mimetype=application/x-font-opentype"},
        {test: /\.gif(\?.*)?$/, loader: "url-loader?mimetype=image/gif"},
        {test: /\.jpg(\?.*)?$/, loader: "url-loader?mimetype=image/jpg"},
        {test: /\.png(\?.*)?$/, loader: "url-loader?mimetype=image/png"},
        {test: /\.jsx$/, loader: 'jsx-loader?harmony'},
        {test: /\.css$/, loader: "style-loader!css-loader"},
        {test: /\.scss$/, loader: "style-loader!css-loader!sass-loader"},
        {test: /\.less$/, loader: "style-loader!css-loader!less-loader"},
        {test: /\.html$/, loader: 'html-loader'}
      ]
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin()
    ]
  };

  webpack(webpackConfig, function(err) {
    if (err) callback(err, null);
    bundleFile.content = readFile(bundleFile.path);
    var template = readFile(__dirname + '/public/index.html');
    bundleFile.content = bundleFile.content
      .replace('"</script>"', '"</scr" + "ipt>"')
      .replace("'</script>'", "'</scr' + 'ipt>'")

    var result = mustache.render(template, {bundle: bundleFile.content});

    removeFile(mdRenderedFile.path);
    removeFile(entryFile.path);
    removeFile(bundleFile.path);

    callback(null, result);
  });
};