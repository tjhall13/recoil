var controller = require('../controllers/inode.js');

var _cache = { };

function INode(data) {
	this.apply = controller(data);
}

INode.read = function(pathname, callback) {
	if(pathname in _cache) {
		callback(null, _cache[pathname]);
	} else {
		
	}
};

INode.readSync = function(pathname) {
	if(pathname in _cache) {
		return _cache[pathname];
	}
};

module.exports = INode;
