var xml2js = require('xml2js');
var fs = require('fs');

function XMLEditor(data) {
	var builder = xml2js.Builder();
	this.xml = data;
	this.build = function() {
		return builder.buildObject(data);
	};
}

var editor = {
	async: function(data, callback) {
		var parser = xml2js.Parser();
		parser.parseString(data, function(err, data) {
			if(!err) {
				var output = new XMLEditor(data);
				callback(null, output);
			} else {
				callback(err, null);
			}
		});
	},
	sync: function(data) {
		var parser = xml2js.Parser();
		var output, error;
		parser.parseString(data, function(err, data) {
			if(err) {
				error = err;
			} else {
				output = new XMLEditor(data);
			}
		});
		if(error) {
			throw error;
		} else {
			return output;
		}
	}
};

module.exports = {
	readFileSync: function(filename) {
		var data = fs.readFileSync(filename, 'utf8');
		return editor.sync(data);
	},
	readFile: function(filename, callback) {
		fs.readFile(filename, 'utf8', function(err, data) {
			if(err) {
				callback(err, null);
			} else {
				editor.async(data, callback);
			}
		});
	}
};
