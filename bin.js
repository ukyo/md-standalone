#!/usr/bin/env node

var fs = require('fs')
var argv = require('optimist').argv
var mustache = require('mustache')

var md = fs.readFileSync(argv._[0], {encoding: 'utf-8'});
var bundle = fs.readFileSync(__dirname + '/bundle.js', {encoding: 'utf-8'});
var template = fs.readFileSync(__dirname + '/index.html', {encoding: 'utf-8'});

bundle = bundle.replace('"</script>"', '"</scr" + "ipt>"')
bundle = bundle.replace("'</script>'", "'</scr' + 'ipt>'")
var result = mustache.render(template, {md: md, bundle: bundle})

console.log(result)
