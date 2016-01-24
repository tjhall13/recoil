jQuery.fn.swap = function(element) {
	$(this).after(element);
	$(this).detach();
	return this;
};

function registerMenus(spy, handlers, update) {
	function editSection() {
		var section = $(this);
		var text, ok, cancel;
		var p = section.find('p');
		var edit = $('<div class="edit edit-block edit-text">')
			.append(
				text = $('<textarea class="p">' + p.text() + '</textarea>'),
				cancel = $('<input type="button" value="Cancel">'),
				ok = $('<input type="button" value="OK">')
			);

		p.swap(edit);
		cancel.click(function() {
			edit.swap(p).remove();
		});
		ok.click(function() {
			update('section', 'edit', section.attr('id'), {
				text: text.val()
			});

			p.text(text.val());
			edit.swap(p).remove();
		});
	}

	function newDefinition() {
		var edit, word, definition, cancel, ok;
		var ul = $(this);

		edit = $('<div class="edit edit-inline edit-text">')
			.append(
				word = $('<input type="text" class="p flex-wt-1">'),
				definition = $('<input type="text" class="p flex-wt-11">'),
				cancel = $('<input type="button" value="Cancel">'),
				ok = $('<input type="button" value="Add">')
			);
		ul.append(edit);

		cancel.click(function() {
			edit.remove();
		});
		ok.click(function() {
			update('definition', 'add', 'definition[' + edit.index() + ']', {
				word: word.val(),
				definition: definition.val()
			});

			var li = $('<li>')
				.append(
					$('<span data-role="word">').text(word.val()),
					': ',
					$('<span data-role="definition">').text(definition.val())
				);
			li.contextmenu(definitionContext());

			edit.remove();
			ul.append(li);
		});
	}

	function editDefinition() {
		var word, definition, ok, cancel;
		var li = $(this);
		var edit = $('<div class="edit edit-inline edit-text">')
			.append(
				word = $('<input type="text" class="p flex-wt-1" value="' + li.find('span[data-role="word"]').text() + '">'),
				definition = $('<input type="text" class="p flex-wt-11" value="' + li.find('span[data-role="definition"]').text() + '">'),
				cancel = $('<input type="button" value="Cancel">'),
				ok = $('<input type="button" value="OK">')
			);

		li.swap(edit);
		cancel.click(function() {
			edit.swap(li).remove();
		});
		ok.click(function() {
			update('definition', 'edit', 'definition[' + edit.index() + ']', {
				word: word.val(),
				definition: definition.val()
			});

			li.find('span[data-role="word"]').text(word.val());
			li.find('span[data-role="definition"]').text(definition.val());
			edit.swap(li).remove();
		});
	}

	function deleteDefinition() {
		var container, cancel, remove;
		var li = $(this);

		var edit = $('<div class="edit edit-block">')
			.append(
				container = $('<div class="row">'),
				cancel = $('<input type="button" value="Cancel">'),
				remove = $('<input type="button" value="Remove">')
			);

		li.swap(edit);
		container.append(li);
		cancel.click(function() {
			li.detach();
			edit.swap(li).remove();
		});
		remove.click(function() {
			update('definition', 'remove', 'definition[' + edit.index() + ']');
			edit.remove();
		});
	}

	var reqCounter = 0;
	function path(node) {
		var current = '';
		while(node.attr('id') != 'requirements') {
			current = '[' + (node.index()-1) + ']' + current;
			node = node.parent('.requirement, #requirements');
		}
		current = 'requirement' + current;
		return current;
	}
	function insertRequirement(method) {
		var title, body, cancel, add;
		var req = $(this).closest('.requirement, #requirements');
		var header = req
			.find('div[data-role="requirement"], .header')
			.find(':header')
			.prop('tagName').toLowerCase();
		if(method == 'append') {
			header = +header.substr(1) + 1;
			header = header > 6 ? 'h6' : 'h' + header;
		}

		var edit = $('<div class="edit edit-block edit-text">')
			.append(
				$('<div class="row">').append(
					title = $('<input type="text" class="' + header + '">')
				),
				$('<div class="row">').append(
					body = $('<textarea class="p">')
				),
				$('<div class="row">').append(
					cancel = $('<input type="button" value="Cancel">'),
					add = $('<input type="button" value="Add">')
				)
			);

		req[method].call(req, edit);
		cancel.click(function() {
			edit.remove();
		});
		add.click(function() {
			update('requirement', 'add', path(edit), {
				title: title.val(),
				body: body.val()
			});

			var div, a, id = 'req-$' + reqCounter++;
			var value = $('<div class="requirement">').append(
				div = $('<div data-role="requirement">').append(
					$('<' + header + '>').text(title.val()),
					$('<p>').text(body.val())
				)
			).attr('id', id);
			var link = $('<li>').append(
				a = $('<a href="#' + id + '">').text(title.val()),
				$('<ul>')
			);

			div.contextmenu(requirementContext());
			a.click(handlers.goto);

			var parent = $(spy.nav())
				.find('a[href="#' + req.attr('id') + '"]')
				.closest('li');
			if(method == 'append') {
				parent.addClass('parent');
				parent.find('a')
					.off('click')
					.click(handlers.expand)
					.dblclick(handlers.goto);
				parent = parent.find('ul');
			}

			edit.swap(value).remove();
			parent[method].call(parent, link);
			spy.refresh();
		});
	}

	function editRequirement() {
		var title, body, cancel, ok;
		var node = $(this);
		var req = node.closest('.requirement, #requirements');
		var id = req.attr('id');

		var header = node.find(':header');

		var edit = $('<div class="edit edit-block edit-text">')
			.append(
				$('<div class="row">').append(
					title = $('<input type="text" class="' + header.prop('tagName').toLowerCase() + '" value="' + header.text() + '">')
				),
				$('<div class="row">').append(
					body = $('<textarea class="p">' + node.find('p').text() + '</textarea>')
				),
				$('<div class="row">').append(
					cancel = $('<input type="button" value="Cancel">'),
					ok = $('<input type="button" value="OK">')
				)
			);

		node.swap(edit);
		cancel.click(function() {
			edit.swap(node);
		});
		ok.click(function() {
			update('requirement', 'edit', path(req), {
				title: title.val(),
				body: body.val()
			});

			var link = $(spy.nav())
				.find('a[href="#' + id + '"]');

			link.text(title.val());
			node.find(':header').text(title.val());
			node.find('p').text(body.val());
			edit.swap(node);
		});
	}

	function deleteRequirement() {
		var container, cancel, remove;
		var req = $(this).closest('.requirement');

		var edit = $('<div class="edit edit-block">')
			.append(
				container = $('<div class="row">'),
				$('<div class="row">').append(
					cancel = $('<input type="button" value="Cancel">'),
					remove = $('<input type="button" value="Remove">')
				)
			);

		req.swap(edit);
		container.append(req);
		cancel.click(function() {
			req.detach();
			edit.swap(req);
		});
		remove.click(function() {
			update('requirement', 'remove', path(edit));

			var link = $(spy.nav())
				.find('a[href="#' + req.attr('id') + '"]')
				.closest('li');
			var parent = link
				.closest('ul');

			link.remove();
			if(parent.children().length === 0) {
				parent.closest('li').removeClass('parent');
				parent.closest('li').find('a')
					.off('dblclick')
					.click(handlers.goto);
			}
			edit.remove();
			spy.refresh();
		});
	}

	function sectionContext() {
		return [{
			html: '<li>Edit</li>',
			handler: function(e) { editSection.call(e.context); }
		}];
	}

	function definitionContext() {
		return [{
			html: '<li>New</li>',
			handler: function(e) { newDefinition.call(e.context.parentNode); }
		}, {
			html: '<li>Edit</li>',
			handler: function(e) { editDefinition.call(e.context); }
		}, {
			html: '<li>Delete</li>',
			handler: function(e) { deleteDefinition.call(e.context); }
		}];
	}

	function requirementContext() {
		return [{
			html: '<li>Insert Before</li>',
			handler: function(e) { insertRequirement.call(e.context, 'before'); }
		}, {
			html: '<li>Insert After</li>',
			handler: function(e) { insertRequirement.call(e.context, 'after'); }
		}, {
			html: '<li>Insert Child</li>',
			handler: function(e) { insertRequirement.call(e.context, 'append'); }
		}, {
			html: '<hr>'
		}, {
			html: '<li>Edit</li>',
			handler: function(e) { editRequirement.call(e.context); }
		}, {
			html: '<li>Delete</li>',
			handler: function(e) { deleteRequirement.call(e.context); }
		}];
	}

	$('#purpose')
		.contextmenu(sectionContext());
	$('#definitions ul > li')
		.contextmenu(definitionContext());
	$('#overview')
		.contextmenu(sectionContext());
	$('#references')
		.contextmenu(sectionContext());
	$('#description')
		.contextmenu(sectionContext());
	$('div[data-role="requirement"]')
		.contextmenu(requirementContext());

	$('#requirements > .header')
		.contextmenu([{
			html: '<li>New</li>',
			handler: function(e) { insertRequirement.call(e.context, 'append'); }
		}]);
	$('#definitions > .header')
		.contextmenu([{
			html: '<li>New</li>',
			handler: function(e) { newDefinition.call($('#definitions').find('ul:not(.context-menu)')); }
		}]);
}
