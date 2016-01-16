$(function() {
	$('#sidebar').scrollspy({
		offset: 55
	});
	var sidebar = $('#sidebar').sidebar();
	$('#menuButton').click(function() {
		sidebar.toggle();
	});

	$('#settingsButton').click(function() {
		$(this).closest('.settings-btn').find('.settings-menu').toggle();
	});

	$('.requirements-nav li.parent > a').click(function(e) {
		$(this).parent('li').toggleClass('selected');
		e.preventDefault();
	});

	var goto = function(e) {
		var $section = $($(this).attr('href'));
		console.log($section);
		$('html, body').animate({
			scrollTop: $section.offset().top - 50
		}, 500);
		e.preventDefault();
	};
	$('.requirements-nav li.parent > a').dblclick(goto);
	$('.requirements-nav li:not(.parent) > a').click(goto);

	registerMenus();
});
