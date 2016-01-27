var fs = require('fs');

var express = require('express');
var parser = require('body-parser');

var HttpStatus = require('./status.js');

var XMLEditor = require('./models/editor.js');
var INode = require('./models/inode.js');

function applicator(request, result, error) {
	return function(err, model) {
		if(err) {
			if(err.code == 'ENOENT') {
				error(new HttpStatus(404));
			} else {
				error(new HttpStatus(500, err));
			}
		} else {
			if(Array.isArray(request.commit)) {
				request.commit.forEach(function(diff) {
					model.apply(diff);
				});
			} else {
				model.apply(request.commit);
			}
			model.save(request.pathname, function(err) {
				if(err) {
					error(new HttpStatus(500, err));
				} else {
					result.json({
						status: 'success',
						changes: Array.isArray(request.commit) ? request.commit.length : 1
					});
				}
			});
		}
	};
}

module.exports = function(ctx) {
	var router = express.Router();
	router.route(/\/commit\/(.+)/)
		.post(function(req, res, next) {
			var request = {
				pathname: ctx.src + '/' + req.params[0],
				commit: req.body
			};

			try {
				var stat = fs.statSync(request.pathname);
				if(stat.isFile()) {
					XMLEditor.read(request.pathname, applicator(request, res, next));
				} else if(stat.isDirectory()) {
					INode.read(request.pathname, applicator(request, res, next));
				}
			} catch(err) {
				if(err.code == 'ENOENT') {
					next(new HttpStatus(404));
				} else {
					console.error(err.stack);
					next(new HttpStatus(500, err));
				}
			}
		});
	return [
		parser.urlencoded({ extended: true }),
		parser.json(),
		router
	];
};
