require('codeThemePath');
require('styleSheetPath');
var html = require('mdPath');
var render = require('jsPath');

window.onload = function() {
  render(html, window.__OPTIONS__);
};
