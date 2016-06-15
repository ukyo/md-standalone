var tocTree = require('./loaders/mdTocLoader!mdPath');
var _ = require('lodash');

function sanitize(text, excludeTags) {
	for (var i = 0; i < excludeTags.length; ++i) {
		text = text.replace(new RegExp('<' + excludeTags[i] + '[^<]*</' + excludeTags[i] + '>', 'g'), '');
	}
	return text;
}

function normalizeAnchorLink(heading) {
    if (/^\s*<a/.test(heading.text)) {
        return heading.text.replace(/^\s*<a( [^>]*)name="([^"]+)"([^>]*)>([^<]+)<\/a>\s*$/, function(all, a, b, c, d) {
            return '<a' + a + 'href="#' + b + '"' + c + ' class="toc-link">' + d + '</a>';
        });
    } else {
        return '<a class="toc-link" href="#' + encodeURIComponent(heading.anchor) + '">' + sanitize(heading.text, ['a']) + '</a>';
    }
}

function renderTocTree(tocTree) {
	return tocTree.map(function(o) {
		return (
			'<li>' +
				'<div class="toc-title heading-'+ o.heading.level + '">' +
					(o.children.length ? '<span class="icon-folder"></span>' : '') +
                    normalizeAnchorLink(o.heading) +
				'</div>' +
				(o.children.length ? '<ul>' + renderTocTree(o.children) + '</ul>' : '') +
			'</li>'
		);
	}).join('');
}

function trimTocTree(tocTree, top, bottom) {
	function isDefined(x) {return x != null}

	function _trim(tocTree) {
		if (!tocTree.length) return [];
		return Array.prototype.concat.apply([], tocTree.map(function(o) {
			if (top > o.heading.level) {
				return _trim(o.children);
			}
			if (bottom < o.heading.level) {
				return null;
			}
			return [{
				heading: _.clone(o.heading),
				children: _trim(o.children)
			}];
		}).filter(isDefined));
	}

	return _trim(tocTree);
}


module.exports = {
	getTocTree: function() {
		return _.cloneDeep(tocTree);
	},

	renderTocTree: function(tocTree) {
		return '<ul>' + renderTocTree(tocTree) + '</ul>';
	},

	addTocBehavior: function() {
		document.getElementById('toc').addEventListener('click', function(e) {
			if (e.target.classList.contains('toc-link')) {
				e.target.parentElement.classList.add('open');
			} else if (e.target.classList.contains('icon-folder')) {
				e.target.parentElement.classList.toggle('open');
			}
		});
	},

	trimTocTree: trimTocTree
};