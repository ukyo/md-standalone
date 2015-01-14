#!/usr/bin/env node

var fs = require('fs')
var argv = require('optimist').argv
var mustache = require('mustache')
var render = require('./lib/render');
var path = require('path');
var webpack = require('webpack');


var mdpath = path.resolve(argv._[0]);
var mdbasename = path.basename(mdpath);
var mddir = path.resolve(path.dirname(mdpath));
var md = fs.readFileSync(mdpath, {encoding: 'utf-8'});


var mdtmppath = mddir + '/tmp-' + Date.now() + '-' + mdbasename + '.html';
var rendered = render(md).replace(/<img src="([^"]+)"/g, function(all, imgPath) {
  var p = path.resolve(mddir, imgPath);
  if (/^https?:\/\//.test(imgPath)) return all;
  var ext = p.split('.').pop();
  return '<img src="data:image/' + ext + ';base64,' + fs.readFileSync(p).toString('base64') + '"';
});

fs.writeFileSync(mdtmppath, rendered, {encoding: 'utf-8'})


var entryPath = __dirname + '/public/_main.jsx';
var entry = mustache.render(fs.readFileSync(__dirname + '/public/main.jsx', {encoding: 'utf-8'}), {RENDERED_PATH: mdtmppath});
fs.writeFileSync(entryPath, entry, {encoding: 'utf-8'});

var bundlePath = __dirname + '/bundle.js'
var webpackConfig = {
  entry: entryPath,
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
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
      {test: /\.html$/, loader: 'html-loader'}
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin()
  ]
};

webpack(webpackConfig, function(err) {
  var bundle = fs.readFileSync(bundlePath, {encoding: 'utf-8'});
  var template = fs.readFileSync(__dirname + '/public/index.html', {encoding: 'utf-8'});
  bundle = bundle.replace('"</script>"', '"</scr" + "ipt>"')
  bundle = bundle.replace("'</script>'", "'</scr' + 'ipt>'")

  var result = mustache.render(template, {md: md, bundle: bundle});
  console.log(result);
  
  fs.unlinkSync(mdtmppath);
  fs.unlinkSync(entryPath);
  fs.unlinkSync(bundlePath);
});
