var marked = require('marked');
var hljs = require('highlight.js');

var renderer = new marked.Renderer();

renderer.codespan = function(code) {
	return '<code class="md-inline-code">' + code + '</code>';
};

renderer.code = function(code, language) {
	var result;
	result = (function() {
		switch (language) {
			case void 0:
			case 'yaml':
				return hljs.highlightAuto(code).value;
			default:
				return hljs.highlight(language, code).value;
		}
	})();
	return '<pre><code class="hljs ' + language + '">' + result + '</code></pre>';
};

var headings = {};
renderer.heading = function(text, level) {
	var encoded;
	encoded = encodeURIComponent(text);
	headings[encoded] = headings[encoded] || 0;
	headings[encoded]++;
	if (headings[encoded] > 1) {
		encoded += '-' + headings[encoded];
	}
	return '<h' + level + '><a name="' + encoded + '" href="#' + encoded + '" class="anchor"></a>' + text + '</h' + level + '>';
};


var options = {
	renderer: renderer,
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: false,
	smartLists: true,
	smartypants: false
};

module.exports = function(markdown) {
	// merge params and default config
	this.cacheable();
	marked.setOptions(options);
	return marked(markdown);
};