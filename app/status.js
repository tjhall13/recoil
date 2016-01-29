var util = require('util');

function HttpStatus(code, data) {
	this.code = code;
	switch(code) {
		case 301:
		case 302:
			this.url = data;
			break;
		default:
			this.msg = 'Error';
	}
}
util.inherits(HttpStatus, Error);

module.exports = HttpStatus;
