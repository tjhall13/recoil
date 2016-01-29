var glob = require('glob');
var fs = require('fs');

var HttpStatus = require('./status.js');
var explore = require('./explore.js');

var XMLEditor = require('./models/editor.js');
var INode = require('./models/inode.js');

module.exports = function(ctx) {
	var globber = '*.{xsrd';
	ctx.extname.forEach(function(ext) {
		globber += ',' + ext;
	});
	globber += '}';
	return function(req, res, next) {
		var structure = explore.expand(
			glob.sync('**/' + globber, {
				cwd: ctx.src
			})
		);
		var pathname = ctx.src + '/' + req.params[0];
		fs.stat(pathname, function(err, stat) {
			if(err) {
				next(new HttpStatus(404));
			} else {
				if(stat.isFile()) {
					XMLEditor.read(pathname, function(err, model) {
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
							res.render('editor', params);
						}
					});
				} else if(stat.isDirectory()) {
					if(req.params[0].length && req.params[0].slice(-1) != '/') {
						next(new HttpStatus(302, '/' + req.params[0] + '/'));
					} else {
						INode.read(pathname, function(err, model) {
							if(err) {
								if(err.code == 'ENOENT') {
									next(new HttpStatus(404));
								} else {
									next(new HttpStatus(500, err));
								}
							} else {
								var params = {
									path: req.params[0],
									directory: model,
									structure: structure
								};
								res.render('inode', params);
							}
						});
					}
				}
			}
		});
	};
};
