require('codeThemePath');
require('styleSheetPath');
var html = require('html?root=true!./loaders/mdLoader!mdPath');
var render = require('jsPath');

window.onload = function() {
  render(html, window.__OPTIONS__);
};
