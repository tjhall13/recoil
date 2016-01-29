jQuery.fn.href = function(value) {
	if(value === undefined) {
		return this.attr('href');
	} else {
		return this.attr('href', value);
	}
};

jQuery.fn.ref = function(value) {
	if(value) {
		this.href(value.attr('id'));
		return this;
	} else {
		var ref = this.href()
			.replace(/\$/g, '\\$')
			.replace(/\./g, '\\.');
		return $(ref);
	}
};

function ScrollSpy(nav, options) {
	var sections, offset;

	function refresh() {
		sections = [];
		$(nav).find('a').each(function(index, value) {
			var ref = $(value).ref();
			if(ref.length) {
				sections.push({ value: value, active: false });
			}
		});
	}

	function toggle(location) {
		sections.forEach(function(section) {
			var ref = $(section.value).ref();
			var start = ref.offset().top;
			var end = start + ref.height();
			if(start > location + offset || end < location + offset) {
				$(section.value).closest('li').removeClass('active');
			} else {
				$(section.value).closest('li').addClass('active');
			}
		});
	}

	if(options) {
		offset = options.offset ? options.offset : 0;
	}
	refresh();
	toggle($(window).scrollTop());
	$(window).scroll(function() {
		var location = $(window).scrollTop();
		toggle(location);
	});

	this.refresh = refresh;
	this.nav = function() { return nav; };
}

jQuery.fn.scrollspy = function(options) {
	if($(this).prop('tagName') == 'NAV') {
		return new ScrollSpy(this, options);
	} else {
		return null;
	}
};
