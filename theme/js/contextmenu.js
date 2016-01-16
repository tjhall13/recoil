function ContextMenu(links) {
	var self = this;
	var menu = $('<ul class="context-menu"></ul>');
	links.forEach(function(link) {
		menu.append(link.html);
	});
	ContextMenu.menus.push(this);

	this.show = function(context, position) {
		ContextMenu.menus.forEach(function(menu) {
			if(menu != self) {
				menu.hide();
			}
		});
		menu.find('li').each(function(index, li) {
			$(li).off('click');
			$(li).click(function(e) {
				e.context = context;
				links[index].handler.call(this, e);
				self.hide();
			});
		});
		menu.offset(position);
		menu.show();
	};
	this.hide = function() {
		menu.hide();
	};
	this.attach = function(context) {
		context.append(menu);
	};
}

ContextMenu.menus = [];

jQuery.fn.contextmenu = function(links) {
	var cm = new ContextMenu(links);
	$(this).on('contextmenu', function(e) {
		cm.show(this, {
			top: e.pageY,
			left: e.pageX
		});
		e.preventDefault();
	});
	$(window).on('click', function(e) {
		cm.hide();
		e.preventDefault();
	});
	$(window).on('scroll', function() {
		cm.hide();
	});
	cm.attach(this);
};
