var path = require('path');

function levels(str, current) {
	if(!current) {
		current = [];
	}
	if(str == '.') {
		return current;
	} else if(str == '/') {
		current.push('/');
		return current;
	} else {
		var base = path.basename(str);
		var dir = path.dirname(str);
		current.push(base);
		return levels(dir, current);
	}
}

function nest(arr, obj, val) {
	if(!obj) {
		obj = { };
	}
	var dir = arr.pop();
	if(arr.length) {
		obj[dir] = nest(arr, obj[dir], val);
	} else {
		obj[dir] = val;
	}
	return obj;
}

function expand(paths) {
	var struct = { };
	paths.forEach(function(str) {
		var arr = levels('/' + str);
		struct = nest(arr, struct, str);
	});
	return struct;
}

function resolve(filename, structure) {
	var base = path.basename(filename);
	var dir = path.dirname(filename);
	if(base === '') {
		return Object.keys(structure[dir]);
	} else {
		if(dir == '.') {
			return structure[base];
		} else {
			return resolve(base, structure[dir]);
		}
	}
}

module.exports = {
	resolve: function(filename, paths) {
		var structure = expand(paths);
		return resolve(filename, structure);
	},
	expand: expand
};
