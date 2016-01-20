module.exports = function(ctx) {
	return function(err, req, res, next) {
		if(err.code) {
			switch(err.code) {
				case 301:
				case 302:
					res.redirect(err.code, err.url);
					break;
				case 404:
					res.status(404).send('Error: 404 Not Found');
					break;
// TODO:		case 500:
				default:
					res.status(err.code).send(err.msg);
					console.error(err.msg);
					break;
			}
		} else {
			console.error(err.stack);
			res.write('Error: 500');
		}
		res.end();
	};
};
