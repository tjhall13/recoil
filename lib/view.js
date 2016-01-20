var glob = require('glob');

var HttpStatus = require('./status.js');
var XMLEditor = require('./models/editor.js');
var recoil = require('./views/recoil.cafe');

module.exports = function(ctx) {
	return [
		// Model Access/Middleware
		function(req, res, next) {
			var filename = req.params[0];
			var pathname = ctx.src + '/' + filename;

			var files = glob.sync(pathname);
			if(files.length) {
				req.recoil = {
					filename: filename,
					model: XMLEditor.readSync(pathname)
				};
				next();
			} else {
				next(new HttpStatus(404))
			}
		},
		// Editor View/Middleware
		recoil.middleware
	];
};
