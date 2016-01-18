var express = require('express');
var path = require('path');

require('cafescript');
var editor = require('./views/editor.cafe');

module.exports = function(ctx) {
	var app = express();

	app.use(express.static(path.resolve(__dirname, 'theme/')));
	app.use('/',
		function(req, res, next) {
			try {
				req.recoil = {
					data: ctx.data,
					save: ctx.save
				};
				next();
			} catch(err) {
				next(err);
			}
		},
		editor.middleware
	);
	return app;
};
