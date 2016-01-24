var parser = require('body-parser');
var express = require('express');

var HttpStatus = require('./status.js');
var XMLEditor = require('./models/editor.js');

module.exports = function(ctx) {
	var router = express.Router();
	router.route(/\/commit\/(.+)/)
		.post(function(req, res, next) {
			var filename = ctx.src + '/' + req.params[0];
			var commit = req.body;
			XMLEditor.read(filename, function(err, model) {
				if(err) {
					if(err.code == 'ENOENT') {
						next(new HttpStatus(404));
					} else {
						next(new HttpStatus(500, err));
					}
				} else {
					if(Array.isArray(commit)) {
						commit.forEach(function(diff) {
							model.apply(diff);
						});
					} else {
						model.apply(commit);
					}
					model.save(filename, function(err) {
						if(err) {
							next(new HttpStatus(500, err));
						} else {
							res.send('hello world');
						}
					});
				}
			});
		});
	return [
		parser.urlencoded({ extended: true }),
		parser.json(),
		router
	];
};
