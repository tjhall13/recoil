var express = require('express');
var path = require('path');
require('cafescript');

var error = require('./lib/error.js');
var view = require('./lib/view.js');
var api = require('./lib/api.js');

module.exports = function(ctx) {
	var app = express();

	app.use(express.static(path.resolve(__dirname, 'theme/')));
	app.use('/api', api(ctx));
	app.use(/\/(.*)/, view(ctx));
	app.use(error(ctx));

	return app;
};
