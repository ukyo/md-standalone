require('../fontello/css/font-icon-embedded.css');
var html = require('mdHelper').getHtml();
var tocHelper = require('tocHelper');
var options = require('./options');

module.exports = function() {
  document.body.innerHTML = '<div id="md">' +html + '</div>';
  document.title = document.querySelector('h1,h2,h3,h4,h5,h6').textContent;

  if (!options.toc) return;
  var tocTree = tocHelper.trimTocTree(tocHelper.getTocTree(), options.level.top, options.level.bottom);
  var tocEl = document.createElement('div');
  tocEl.id = 'toc';
  tocEl.innerHTML = tocHelper.renderTocTree(tocTree);
  document.body.appendChild(tocEl);
  tocHelper.addTocModifier();
};
