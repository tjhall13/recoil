jQuery.fn.swap = function(element) {
	$(this).after(element);
	$(this).detach();
	return this;
};

function registerMenus() {
	function editSection() {
		var text, ok, cancel;
		var p = $(this).find('p');
		var edit = $('<div class="edit edit-block">')
			.append(
				text = $('<textarea>' + p.text() + '</textarea>'),
				cancel = $('<input type="button" value="Cancel">'),
				ok = $('<input type="button" value="OK">')
			);
		p.swap(edit);
		cancel.click(function() {
			edit.swap(p).remove();
		});
		ok.click(function() {
			p.text(text.val());
			edit.swap(p).remove();
			console.log('save');
		});
	}

	function newDefinition() {
		var ul, edit, word, definition, cancel, ok;

		(ul = $(this).closest('ul'))
			.append(edit = $('<div class="edit edit-inline">')
				.append(
					word = $('<input type="text" class="flex-wt-1">'),
					definition = $('<input type="text" class="flex-wt-11">'),
					cancel = $('<input type="button" value="Cancel">'),
					ok = $('<input type="button" value="Add">')
				)
			);

		cancel.click(function() {
			edit.remove();
		});
		ok.click(function() {
			var li = $('<li>')
				.append(
					$('<span data-role="word">').text(word.val()),
					': ',
					$('<span data-role="definition">').text(definition.val())
				);
			edit.remove();
			ul.append(li);
			console.log('save');
		});
	}

	function editDefinition() {
		var word, definition, ok, cancel;
		var li = $(this);
		var edit = $('<div class="edit edit-inline">')
			.append(
				word = $('<input type="text" class="flex-wt-1" value="' + li.find('span[data-role="word"]').text() + '">'),
				definition = $('<input type="text" class="flex-wt-11" value="' + li.find('span[data-role="definition"]').text() + '">'),
				cancel = $('<input type="button" value="Cancel">'),
				ok = $('<input type="button" value="OK">')
			);

		li.swap(edit);
		cancel.click(function() {
			edit.swap(li).remove();
		});
		ok.click(function() {
			li.find('span[data-role="word"]').text(word.val());
			li.find('span[data-role="definition"]').text(definition.val());
			edit.swap(li).remove();
			console.log('save');
		});
	}

	function deleteDefinition() {
		var li = $(this);
		var edit = $('<div class="edit edit-block">')
			.append(
				$('<div class="row">').append(
					$('<span data-role="word">').text(li.find('span[data-role="word"]').text()),
					':&nbsp;',
					$('<span data-role="definition">').text(li.find('span[data-role="definition"]').text())
				),
				cancel = $('<input type="button" value="Cancel">'),
				ok = $('<input type="button" value="Remove">')
			);

		li.swap(edit);
		cancel.click(function() {
			edit.swap(li).remove();
		});
		ok.click(function() {
			edit.remove();
			li.remove();
			console.log('save');
		});
	}

	$('#introduction-purpose').contextmenu([{
		html: '<li>Edit</li>',
		handler: function(e) { editSection.call(e.context); }
	}]);
	$('#introduction-definitions ul > li').contextmenu([{
		html: '<li>New</li>',
		handler: function(e) { newDefinition.call(e.context); }
	}, {
		html: '<li>Edit</li>',
		handler: function(e) { editDefinition.call(e.context); }
	}, {
		html: '<li>Delete</li>',
		handler: function(e) { deleteDefinition.call(e.context); }
	}]);
	$('#introduction-overview').contextmenu([{
		html: '<li>Edit</li>',
		handler: function(e) { editSection.call(e.context); }
	}]);
	$('#introduction-references').contextmenu([{
		html: '<li>Edit</li>',
		handler: function(e) { editSection.call(e.context); }
	}]);

	$('#description').contextmenu([{
		html: '<li>Edit</li>',
		handler: function(e) { editSection.call(e.context); }
	}]);
}
