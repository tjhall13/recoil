var glob = require('glob');

var HttpStatus = require('./status.js');
var explore = require('./explore.js');

var XMLEditor = require('./models/editor.js');
var recoil = require('./views/recoil.cafe');

module.exports = function(ctx) {
	return [
		// Model Access/Middleware
		function(req, res, next) {
			var files = glob.sync('**.xsrd', {
				cwd: ctx.src
			});
			var src = explore.resolve('/' + req.params[0], files);
			if(Array.isArray(src)) {
				req.recoil = {
					path: req.params[0],
					directory: src
				};
				next();
			} else {
				XMLEditor.read(ctx.src + '/' + src, function(err, model) {
					if(err) {
						if(err.code == 'ENOENT') {
							next(new HttpStatus(404));
						} else {
							next(new HttpStatus(500, err));
						}
					} else {
						req.recoil = {
							path: req.params[0],
							document: model
						};
						next();
					}
				});
			}
		},
		// Editor View/Middleware
		recoil.middleware
	];
};
