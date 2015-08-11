var tocTree = require('./loaders/mdTocLoader!mdPath');
var _ = require('lodash');

function sanitize(text, excludeTags) {
	for (var i = 0; i < excludeTags.length; ++i) {
		text = text.replace(new RegExp('<' + excludeTags[i] + '[^<]*</' + excludeTags[i] + '>', 'g'), '');
	}
	return text;
}

function createTocTreeAsHtml(tocTree) {
	return tocTree.map(function(o) {
		return (
			'<li>' +
				'<div class="toc-title heading-'+ o.heading.level + '">' +
					(o.children.length ? '<span class="icon-folder"></span>' : '') +
					'<a class="toc-link" href="#' + encodeURIComponent(o.heading.anchor) + '">' + sanitize(o.heading.text, ['a']) + '</a>' +
				'</div>' +
				(o.children.length ? '<ul>' + createTocTreeAsHtml(o.children) + '</ul>' : '') +
			'</li>'
		);
	}).join('');
}


module.exports = {
	getTocTreeAsJson: function() {
		return _.cloneDeep(tocTree);
	},

	getTocTreeAsHtml: function() {
		return '<ul>' + createTocTreeAsHtml(tocTree) + '</ul>';
	},

	addTocModifier: function() {
		document.getElementById('toc').addEventListener('click', function(e) {
			if (e.target.classList.contains('toc-link')) {
				e.target.parentElement.classList.add('open');
			} else if (e.target.classList.contains('icon-folder')) {
				e.target.parentElement.classList.toggle('open');
			}
		});
	}
};