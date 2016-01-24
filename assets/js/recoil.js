$(function() {
	var meta = {
		application: $('head meta[name="application"]').attr('content'),
		pathname: $('head meta[name="pathname"]').attr('content')
	};

	var spy = $('#sidebar').scrollspy({
		offset: 55
	});
	var sidebar = $('#sidebar').sidebar();
	$('#menuButton').click(function() {
		sidebar.toggle();
	});

	$('#settingsButton').click(function() {
		$(this).closest('.settings-btn').find('.settings-menu').toggle();
	});

	function goto(e) {
		var $section = $(this).ref();
		$('html, body').animate({
			scrollTop: $section.offset().top - 50
		}, 500);
		e.preventDefault();
	}
	function expand(e) {
		$(this).parent('li').toggleClass('selected');
		e.preventDefault();
	}

	$('.requirements-nav li.parent > a').click(expand);
	$('.requirements-nav li.parent > a').dblclick(goto);
	$('.requirements-nav li:not(.parent) > a').click(goto);

	var handlers = { 
		goto: goto,
		expand: expand
	};

	var diff = [];
	function update(type, method, reference, params) {
		if(diff.length === 0) {
			$('head > title').text(meta.application + ' | *' + meta.pathname);
		}
		diff.push({
			type: type,
			method: method,
			reference: reference,
			params: params
		});
	}
	function save() {
		var overlay = $('#overlay');
		overlay.show();
		$.ajax({
			method: 'POST',
			data: JSON.stringify(diff),
			contentType: 'application/json',
			url: '/api/commit/' + meta.pathname
		}).success(function() {
			diff = [];
			overlay.hide();
			$('head > title').text(meta.application + ' | ' + meta.pathname);
		}).fail(function(data) {
			overlay.hide();
			console.error(data);
		});
	}

	registerMenus(spy, handlers, update);

	$('.action-list li[data-action="save"]').click(save);
	$(window).keydown(function(e) {
		if(e.ctrlKey || e.metaKey) {
			switch (String.fromCharCode(e.which).toLowerCase()) {
				case 's':
					save();
					e.preventDefault();
			}
		}
	});
});
