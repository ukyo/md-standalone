var marked = require('marked');
var hljs = require('highlight.js');



function render(text) {
  var headings, renderer;
  renderer = new marked.Renderer;
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
  headings = {};
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
  marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  });
  return marked(text);
};

module.exports = render;