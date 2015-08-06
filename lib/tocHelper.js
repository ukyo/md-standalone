var tocTree = require('./loaders/mdTocLoader!mdPath');
var _ = require('lodash');

module.exports = {
	getTocTreeAsJson: function() {
		return _.cloneDeep(tocTree);
	},

	getTocTreeAsHtml: function() {
		// TODO
		return '<div>hello toc</div>';
	}
};