jQuery.fn.box = function() {
	return {
		top: this.offset().top,
		left: this.offset().left,
		right: this.offset().left + this.width(),
		bottom: this.offset().top + this.height()
	};
};

$(function() {
	var meta = {
		application: $('head meta[name="application"]').attr('content'),
		pathname: $('head meta[name="pathname"]').attr('content')
	};
	var icons = $('main').find('.icon');

	var iconizer = $('main').iconizer(icons.toArray());
	var sidebar = $('#sidebar').sidebar();
	$('#menuButton').click(function() {
		sidebar.toggle();
	});

	$('#settingsButton').click(function() {
		$(this).closest('.settings-btn').find('.settings-menu').toggle();
	});

	function follow() {
		var ref = $(this).attr('data-href');
		window.location.assign(ref);
	}

	function open(array) {
		var ref = $(this).attr('data-href');
		console.log(window.location);
		window.open(window.location.origin + '/' + ref, ref);
	}

	function filter(e) {
		if(!e.ctrlKey) {
			iconizer.active().forEach(function(element) {
				var position = $(element).box();
				if(e.pageX < position.left || e.pageX > position.right || e.pageY < position.top || e.pageY > position.bottom) {
					iconizer.deactivate(element);
				}
			});
		}
	}

	$('main')
		.on('click', filter)
		.on('contextmenu', filter);

	icons.on('follow', follow);

	function update(type, method, reference, params) {
		return $.ajax({
			method: 'POST',
			data: JSON.stringify({
				type: type,
				method: method,
				reference: reference,
				params: params
			}),
			contentType: 'application/json',
			url: '/api/commit/' + meta.pathname
		}).error(function(xhr, type, error) {
			console.error(error);
		});
	}

	var handlers = {
		follow: follow,
		open: open
	};
	registerMenus(iconizer, handlers, update);
});
