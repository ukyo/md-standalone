#!/usr/bin/env node

var fs = require('fs')
var path = require('path');
var optimist = require('optimist');
var mdst = require('./index');


var argv = optimist
.usage('Usage: mdst [options] path/to/doc.md')

.describe('s', 'Stylesheet path(css, scss or less).')
.describe('o', 'Output path(default STDOUT).')

.alias('s', 'style')
.alias('o', 'output')

.default('s', __dirname + '/style.css')

.argv


if (argv.h || argv.help || !argv._.length) {
  console.log(optimist.help());
} else {
  mdst({
    input: argv._[0],
    stylesheetPath: argv.s
  }, function(err, result) {
    if (err) return console.error(err.stack);

    var stream = process.stdout;
    if (argv.o) {
      stream = fs.createWriteStream(path.resolve(process.cwd(), argv.o), {
        encoding: 'utf8'
      });
    }
    stream.write(result);
  });  
}

