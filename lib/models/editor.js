var xml2js = require('xml2js');
var fs = require('fs');

var controller = require('../controllers/editor.js');

var _cache = { };

function XMLEditor(data) {
	var self = this;
	var builder = new xml2js.Builder({
		xmldec: { 'version': '1.0', 'encoding': 'UTF-8' },
		renderOpts: { 'pretty': true, 'indent': '\t', 'newline': '\n' }
	});
	this.xml = data;

	this.save = function(filename, callback) {
		var text = builder.buildObject(data);
		if(filename in _cache) {
			_cache[filename].watcher.close();
			fs.writeFile(filename, text, function(err) {
				if(err) {
					delete _cache[filename];
				} else {
					_cache[filename].watcher = _watch(filename);
				}
				callback(err);
			});
		} else {
			fs.writeFile(filename, text, function(err) {
				if(!err) {
					_cache[filename] = {
						editor: self,
						watcher: _watch(filename)
					};
				}
				callback(err);
			});
		}
	};
	this.saveSync = function(filename) {
		var text = builder.buildObject(data);
		if(filename in _cache) {
			_cache[filename].watcher.close();
			try {
				fs.writeFileSync(filename, text);
				_cache[filename].watcher = _watch(filename);
			} catch(err) {
				delete _cache[filename];
				throw err;
			}
		} else {
			fs.writeFileSync(filename, text);
			_cache[filename] = {
				editor: self,
				watcher: _watch(filename)
			};
		}
	};
	this.apply = controller(data);
}

var Parser = {
	async: function(data, callback) {
		var parser = new xml2js.Parser();
		parser.parseString(data, callback);
	},
	sync: function(data) {
		var parser = new xml2js.Parser();
		var output, error;
		parser.parseString(data, function(err, data) {
			if(err) {
				error = err;
			} else {
				output = data;
			}
		});
		if(error) {
			throw error;
		} else {
			return output;
		}
	}
};

XMLEditor.read = function(filename, callback) {
	if(filename in _cache) {
		callback(null, _cache[filename].editor);
	} else {
		fs.readFile(filename, function(err, data) {
			if(err) {
				callback(err, null);
			} else {
				Parser.async(data, function(err, model) {
					if(err) {
						callback(err, null);
					} else {
						var editor = new XMLEditor(model);
						_cache[filename] = {
							editor: editor,
							watcher: _watch(filename)
						};
						callback(null, editor);
					}
				});
			}
		});
	}
};

XMLEditor.readSync = function(filename) {
	if(filename in _cache) {
		return _cache[filename].editor;
	} else {
		var data = fs.readFileSync(filename);
		var model = Parser.sync(data);
		var editor = new XMLEditor(model);
		_cache[filename] = {
			editor: editor,
			watcher: _watch(filename)
		};
		return editor;
	}
};

function _watch(filename) {
	return fs.watch(filename, function(event) {
		if(event == 'change') {
			delete _cache[filename];
			XMLEditor.read(filename, function(err) {
				if(err) {
					console.error(err);
				}
			});
		}
	});
}

module.exports = XMLEditor;
