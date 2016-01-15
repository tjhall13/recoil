function Sidebar(dom) {
	this.toggle = function() {
		$(dom).toggleClass('open');
	};
}

jQuery.fn.sidebar = function() {
	return new Sidebar(this);
};
