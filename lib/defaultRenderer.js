require('codeThemePath');
require('../fontello/css/font-icon-embedded.css');
require('styleSheetPath');
var html = require('mdHelper').getHtml();
var tocHelper = require('tocHelper');

module.exports = function() {
  document.body.innerHTML = '<div id="md">' +html + '</div>';
  document.title = document.querySelector('h1,h2,h3,h4,h5,h6').textContent;

  if (!__OPTIONS__.toc) return;
  var tocEl = document.createElement('div');
  tocEl.id = 'toc';
  tocEl.innerHTML = tocHelper.getTocTreeAsHtml();
  document.body.appendChild(tocEl);
  tocHelper.addTocModifier();
};
