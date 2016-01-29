var xml2js = require('xml2js');
var fs = require('fs');

var XMLEditorController = require('../controllers/editor.js');

var _cache = { };

function XMLEditor(data) {
	var self = this;
	var builder = new xml2js.Builder({
		xmldec: { 'version': '1.0', 'encoding': 'UTF-8' },
		renderOpts: { 'pretty': true, 'indent': '\t', 'newline': '\n' }
	});
	if(!data) {
		data = {
			document: {
				introduction: [{
					purpose: [''],
					definitions: [{
						definition: []
					}],
					overview: [''],
					references: ['']
				}],
				description: [''],
				requirements: [{
					requirement: []
				}]
			}
		};
	}

	this.xml = data;

	this.save = function(filename, flags, callback) {
		if(typeof flags == 'function') {
			callback = flags;
			flags = 'w';
		}
		var text = builder.buildObject(data);
		if(filename in _cache) {
			_cache[filename].watcher.close();
			fs.writeFile(filename, text, { flags: flags }, function(err) {
				if(err) {
					delete _cache[filename];
				} else {
					_cache[filename].watcher = _watch(filename);
				}
				callback(err);
			});
		} else {
			fs.writeFile(filename, text, { flags: flags }, function(err) {
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
	this.saveSync = function(filename, flags) {
		if(!flags) {
			flags = 'w';
		}
		var text = builder.buildObject(data);
		if(filename in _cache) {
			_cache[filename].watcher.close();
			try {
				fs.writeFileSync(filename, text, { flags: flags });
				_cache[filename].watcher = _watch(filename);
			} catch(err) {
				delete _cache[filename];
				throw err;
			}
		} else {
			fs.writeFileSync(filename, text, { flags: flags });
			_cache[filename] = {
				editor: self,
				watcher: _watch(filename)
			};
		}
	};
	this.apply = XMLEditorController(data);
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

XMLEditor.remove = function(filename, callback) {
	if(filename in _cache) {
		_cache[filename].watcher.close();
		delete _cache[filename];
	}
	fs.unlink(filename, callback);
};

XMLEditor.removeSync = function(filename) {
	if(filename in _cache) {
		_cache[filename].watcher.close();
		delete _cache[filename];
	}
	fs.unlinkSync(filename);
};

XMLEditor.rename = function(oldFilename, newFilename, callback) {
	if(oldFilename in _cache) {
		_cache[oldFilename].watcher.close();
	}
	fs.rename(oldFilename, newFilename, function(err) {
		if(err) {
			callback(err);
		} else {
			if(oldFilename in _cache) {
				_cache[newFilename] = _cache[oldFilename];
				_cache[newFilename].watcher = _watch(newFilename);
				delete _cache[oldFilename];
			}
			callback(null);
		}
	});
};

XMLEditor.renameSync = function(oldFilename, newFilename) {
	if(oldFilename in _cache) {
		_cache[oldFilename].watcher.close();
	}
	fs.renameSync(oldFilename, newFilename);
	if(oldFilename in _cache) {
		_cache[newFilename] = _cache[oldFilename];
		_cache[newFilename].watcher = _watch(newFilename);
		delete _cache[oldFilename];
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
