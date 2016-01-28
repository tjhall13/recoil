var glob = require('glob');

var HttpStatus = require('./status.js');
var explore = require('./explore.js');

var XMLEditor = require('./models/editor.js');
var INode = require('./models/inode.js');

module.exports = function(ctx) {
	return function(req, res, next) {
		var files = glob.sync('**.xsrd', {
			cwd: ctx.src
		});
		var src = explore.resolve('/' + req.params[0], files);
		if(Array.isArray(src)) {
			var params = {
				path: req.params[0],
				directory: src
			};
			res.render('recoil', params);
		} else {
			XMLEditor.read(ctx.src + '/' + src, function(err, model) {
				if(err) {
					if(err.code == 'ENOENT') {
						next(new HttpStatus(404));
					} else {
						next(new HttpStatus(500, err));
					}
				} else {
					var params = {
						path: req.params[0],
						document: model
					};
					res.render('recoil', params);
				}
			});
		}
	};
};
