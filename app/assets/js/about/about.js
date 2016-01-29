$(function() {
	$('.action-list li[data-href]').click(function() {
		var href = $(this).attr('data-href');
		window.location.assign(href);
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

	$('.nav-tree li.parent > a').click(expand);
	$('.nav-tree li.parent > a').dblclick(goto);
	$('.nav-tree li:not(.parent) > a').click(goto);
});
