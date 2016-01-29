function Iconizer(icons) {
	var elements = icons.map(introduce);

	function activate(element) {
		element.addClass('active');
	}

	function deactivate(element) {
		element.removeClass('active');
	}

	function introduce(icon) {
		return $(icon).click(function(e) {
			activate($(this));
		}).dblclick(function() {
			$(this).trigger('follow');
		}).on('contextmenu', function() {
			activate($(this));
		});
	}

	this.add = function(icon) {
		elements.push(introduce(icon));
		return true;
	};

	this.remove = function(icon) {
		var location = -1;
		elements.forEach(function(element, index) {
			if(element[0] == icon) {
				location = index;
			}
		});
		if(location != -1) {
			elements.splice(location, 1);
			return true;
		} else {
			return false;
		}
	};

	this.all = function() {
		return elements.map(function(element) {
			return element[0];
		});
	};

	this.active = function() {
		return elements.filter(function(element) {
			return element.hasClass('active');
		}).map(function(element) {
			return element[0];
		});
	};

	this.activate = function(icon) {
		var activated = false;
		elements.forEach(function(element) {
			if(element[0] == icon) {
				activate(element);
				activated = true;
			}
		});
		return activated;
	};

	this.deactivate = function(icon) {
		var deactivated = false;
		elements.forEach(function(element) {
			if(element[0] == icon) {
				deactivate(element);
				deactivated = true;
			}
		});
		return deactivated;
	};
}

jQuery.fn.iconizer = function(icons) {
	return new Iconizer(icons);
};
