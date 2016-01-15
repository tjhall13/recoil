function ScrollSpy(nav, options) {
	var ranges = [];
	var offset = 0;

	function toggle(location) {
		ranges.forEach(function(section) {
			if(section.start > location + offset || section.end < location + offset) {
				// Deactivate section
				if(section.active) {
					$(section.value).closest('li').removeClass('active');
					section.active = false;
				}
			} else {
				// Activate section
				if(!section.active) {
					$(section.value).closest('li').addClass('active');
					section.active = true;
				}
			}
		});
	}

	if(options) {
		offset = options.offset ? options.offset : 0;
	}
	$(nav).find('a').each(function(index, value) {
		var ref = $(value).attr('href');
		var object = $(ref);
		if(object.length) {
			var top = object.offset().top;
			var bottom = object.height() + top;
			ranges.push({ start: top, end: bottom, value: value, active: false });
		}
	});
	ranges.sort(function(a, b) {
		return a.start - b.start;
	});

	toggle($(window).scrollTop());
	$(window).scroll(function() {
		var location = $(window).scrollTop();
		toggle(location);
	});
}

jQuery.fn.scrollspy = function(options) {
	if($(this).prop('tagName') == 'NAV') {
		return new ScrollSpy(this, options);
	} else {
		return null;
	}
};
