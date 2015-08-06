module.exports = function(markdown) {
	var headings = markdown
		.split(/(\r\n|\n)+/)
		.filter(function (line) {
			return /^#/.test(line);
		})
		.map(function (line) {
			var m = line.match(/^(#+)\s*(.+)$/);
			return {
				level: m[1].length,
				text: m[2]
			};
		});

	function findIndices(arr, fn) {
		var indices = [];
		for (var i = 0; i < arr.length; ++i) {
			if (fn(arr[i])) indices.push(i);
		}
		return indices;
	}

	function createTree(headings) {
		return findIndices(headings, function(h) {
			return h.level === headings[0].level;
		}).map(function(h, i, indices) {
			return {
				heading: headings[indices[i]],
				children: createTree(headings.slice(indices[i] + 1, indices[i + 1]))
			};
		});
	}

	return 'module.exports = ' + JSON.stringify(createTree(headings));
};