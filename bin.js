#!/usr/bin/env node

var fs = require('fs')
var path = require('path');
var optimist = require('optimist');
var mdst = require('./index');


var argv = optimist
	.usage('Usage: mdst [options] path/to/doc.md')

	.describe('s', 'Stylesheet path(css, scss or less).')
	.describe('o', 'Output path(default STDOUT).')
	.describe('l', 'Headings level')
	.describe('c', 'Code Theme')
	.describe('m', 'Minify')

	.alias('s', 'style')
	.alias('o', 'output')
	.alias('l', 'level')
	.alias('c', 'code')
	.alias('m', 'minify')

	.default('s', __dirname + '/lib/style/style.scss')
	.default('l', '1-6')
	.default('c', 'tomorrow-night-eighties')

	.argv;


if (argv.h || argv.help || !argv._.length) {
	console.log(optimist.help());
} else {
	var match = argv.l.match(/([1-6])-([1-6])/);
	if (match == null) {
		return console.error('Invalid headings level: "' + argv.l + '"');
	}
	var headingsLevelTop = +match[1];
	var headingsLevelBottom = +match[2];
	if (headingsLevelTop > headingsLevelBottom) {
		return console.error('Invalid headings level: "' + argv.l + '"');
	}

	mdst({
		input: path.resolve(process.cwd(), argv._[0]),
		output: argv.o,
		codeTheme: argv.c,
		styleSheetPath: argv.s,
		minify: argv.m,
		level: {
			top: headingsLevelTop,
			bottom: headingsLevelBottom
		}
	}, function (err, result) {
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
