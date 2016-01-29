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

	function goto(e) {
		var node = $(this).closest('li');
		var ref = '';
		while(!node.hasClass('heading')) {
			ref = node.children('a').attr('href') + ref;
			node = node.parent().closest('li');
		}
		ref = '/' + ref;
		window.location.assign(ref);
		e.preventDefault();
	}
	function expand(e) {
		$(this).parent('li').toggleClass('selected');
		e.preventDefault();
	}
	function follow() {
		var ref = $(this).attr('data-href');
		window.location.assign('/' + meta.pathname + ref);
	}
	function open(array) {
		var ref = $(this).attr('data-href');
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

	$('.nav-tree li.parent > a').click(expand);
	$('.nav-tree li.parent > a').dblclick(goto);
	$('.nav-tree li:not(.parent) > a').click(goto);

	$('main')
		.on('click', filter)
		.on('contextmenu', filter);

	icons.on('follow', follow);

	function update(type, method, reference, params) {
		var data;
		if(Array.isArray(type)) {
			data = type;
		} else {
			data = {
				type: type,
				method: method,
				reference: reference,
				params: params
			};
		}
		return $.ajax({
			method: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: '/api/commit/' + meta.pathname
		}).error(function(xhr, type, error) {
			console.error(error);
		});
	}

	var handlers = {
		goto: goto,
		expand: expand,
		follow: follow,
		open: open
	};
	registerMenus(iconizer, handlers, update);
});
