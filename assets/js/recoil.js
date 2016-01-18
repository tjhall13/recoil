$(function() {
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
	registerMenus(spy, handlers);
});
