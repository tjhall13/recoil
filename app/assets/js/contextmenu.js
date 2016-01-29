function ContextMenu(summary) {
	var self = this;
	var menu = $('<ul class="context-menu"></ul>');
	var handlers = [];

	function clear() {
		menu.empty();
		handlers = [];
	}

	function populate(links) {
		links.forEach(function(link) {
			menu.append(link.html);
			if(link.handler) {
				handlers.push(link.handler);
			}
		});
	}

	if(Array.isArray(summary)) {
		populate(summary);
	}
	ContextMenu.menus.push(this);

	this.show = function(context, e) {
		ContextMenu.menus.forEach(function(menu) {
			if(menu != self) {
				menu.hide();
			}
		});
		if(typeof summary == 'function') {
			clear();
			populate(summary(e));
		}
		menu.find('li').each(function(index, li) {
			$(li).off('click');
			$(li).click(function(e) {
				e.context = context;
				handlers[index].call(this, e);
				self.hide();
			});
		});
		menu.offset({
			top: e.pageY,
			left: e.pageX
		});
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

jQuery.fn.contextmenu = function(summary) {
	var cm = new ContextMenu(summary);
	this.on('contextmenu', function(e) {
		cm.show(this, e);
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
