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
			try {
				var status;
				if(Array.isArray(request.commit)) {
					status = [];
					request.commit.forEach(function(diff) {
						try {
							model.apply(diff);
							status.push({ status: 'success' });
						} catch(e) {
							status.push({ status: 'error', error: e.message });
						}
					});
				} else {
					try {
						model.apply(request.commit);
						status = { status: 'success' };
					} catch(e) {
						status = { status: 'error', error: e.message };
					}
				}
				model.save(request.pathname, function(err) {
					if(err) {
						error(new HttpStatus(500, err));
					} else {
						result.header('Content-Type', 'application/json');
						result.json(status);
					}
				});
			} catch(e) {
				error(new HttpStatus(500), e);
			}
		}
	};
}

module.exports = function(ctx) {
	var router = express.Router();
	router.route(/\/commit\/(.*)/)
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
