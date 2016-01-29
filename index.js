var express = require('express');
var path = require('path');

var cafescript = require('cafescript');

var error = require('./app/error.js');
var view = require('./app/view.js');
var api = require('./app/api.js');

module.exports = function(ctx) {
	var app = express();
	app.engine('cafe', cafescript.render);

	app.set('views', './app/views/');
	app.set('view engine', 'cafe');

	app.use(express.static(path.resolve(__dirname, 'theme/')));
	app.use('/api', api(ctx));
	app.use(/\/(.*)/, view(ctx));
	app.use(error(ctx));

	return app;
};
