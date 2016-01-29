var util = require('util');
var path = require('path');
var fs = require('fs');

var XMLEditor = require('./editor.js');

var INodeController = require('../controllers/inode.js');

var _cache = { };

function INode(dirname) {
	this.mkdir = function(pathname) {
		pathname = path.resolve(dirname, pathname);
		fs.mkdirSync(pathname);
		return INode.readSync(pathname);
	};
	this.mkdoc = function(pathname) {
		var model = new XMLEditor();
		pathname = path.resolve(dirname, pathname);
		model.saveSync(pathname, 'wx');
		return model;
	};
	this.rm = function(pathname) {
		pathname = path.resolve(dirname, pathname);
		try {
			var stat = fs.statSync(pathname);
			if(stat.isDirectory()) {
				fs.rmdirSync(pathname);
			} else if(stat.isFile()) {
				return XMLEditor.removeSync(pathname);
			} else {
				throw new Error('Undefined stat result: ' + util.inspect(stat));
			}
		} catch(err) {
			if(err.code == 'ENOTEMPTY') {
				throw new Error('Non-Empty Directory: ' + pathname);
			} else {
				throw new Error('Undefined Reference: ' +  pathname);
			}
		}
	};
	this.rename = function(pathname, name) {
		pathname = path.resolve(dirname, pathname);
		name = path.resolve(dirname, name);
		try {
			var stat = fs.statSync(pathname);
			if(stat.isDirectory()) {
				fs.renameSync(pathname, name);
			} else if(stat.isFile()) {
				return XMLEditor.renameSync(pathname, name);
			} else {
				throw new Error('Undefined stat result: ' + util.inspect(stat));
			}
		} catch(err) {
			throw new Error('Undefined Reference: ' +  pathname);
		}
	};
	this.children = function() {
		var files = fs.readdirSync(dirname);
		return files.map(function(file) {
			var stat = fs.statSync(path.resolve(dirname, file));
			return {
				file: stat.isFile(),
				path: file
			};
		});
	};

	this.apply = INodeController(this);
	this.save = function(_, callback) {
		callback(null);
	};
	this.saveSync = function() { };
}

INode.read = function(dirname, callback) {
	if(dirname in _cache) {
		callback(null, _cache[dirname]);
	} else {
		var model = new INode(dirname);
		_cache[dirname] = model;
		callback(null, model);
	}
};

INode.readSync = function(dirname) {
	if(dirname in _cache) {
		return _cache[dirname];
	} else {
		var model = new INode(dirname);
		_cache[dirname] = model;
		return model;
	}
};

module.exports = INode;
