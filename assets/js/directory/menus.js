jQuery.fn.textselect = function() {
	var range;
	if(document.body.createTextRange) {
		range = document.body.createTextRange();
		range.moveToElementText(this[0]);
		range.select();
	} else if(window.getSelection) {
		selection = window.getSelection();
		range = document.createRange();
		range.selectNodeContents(this[0]);
		selection.removeAllRanges();
		selection.addRange(range);
	}
	return this;
};

function registerMenus(iconizer, handlers, update) {
	function openIcon(e) {
		handlers.follow.call($(this));
	}

	function openAll(e) {
		console.log(iconizer.active());
		iconizer.active().forEach(function(icon) {
			handlers.open.call(icon);
		});
	}

	function renameIcon(e) {
		var icon = this;
		var name = $(icon).find('span:not(.img)');
		var original = name.text();

		$(icon).addClass('icon-edit');
		name.attr('contenteditable', 'true');
		name.textselect()
			.focus();

		name.blur(function() {
			$(icon).removeClass('icon-edit');
			var value = name.text();
			update('fs', 'edit', 'inode[' + original + ']', { name: value })
				.success(function() {
					$(icon).text(value);
				});
			name.text(original);
			name.attr('contenteditable', false);
			$(icon).removeClass('icon-edit');
		});
	}

	function deleteIcon(e) {
		var icon = this;
		update('fs', 'remove', 'inode[' + $(icon).find('span:not(.img)').text() + ']')
			.success(function() {
				iconizer.remove(icon);
				$(icon).remove();
			});
	}

	function newFolder(e) {
		var $name, $icon;
		$icon = $('<div class="icon icon-folder icon-edit">')
			.append(
				$('<span class="img">'),
				$name = $('<span contenteditable="true">Untitled Folder</span>')
			);

		var inodes = $(this).find('.row');
		inodes.append($icon);
		$name.textselect()
			.focus();

		$name.blur(function() {
			update('fs', 'add', 'directory[]', { name: $name.text() })
				.success(function() {
					$icon.removeClass('icon-edit');
					$name.attr('contenteditable', false);
					inodes.append($icon);
				});
			$icon.detach();
		});
	}

	function newDocument(e) {
		var $name, $icon;
		$icon = $('<div class="icon icon-file icon-edit">')
			.append(
				$('<span class="img">'),
				$name = $('<span contenteditable="true">Untitled Document</span>')
			);

		var inodes = $(this).find('.row');
		inodes.append($icon);
		$name.textselect()
			.focus();

		$name.blur(function() {
			update('fs', 'add', 'document[]', { name: $name.text() })
				.success(function() {
					$icon.removeClass('icon-edit');
					$name.attr('contenteditable', false);
					inodes.append($icon);
				});
			$icon.detach();
		});
	}

	$('main').contextmenu(function(e) {
		var contains;
		iconizer.all().forEach(function(element) {
			var position = $(element).box();
			if(e.pageX > position.left && e.pageX < position.right && e.pageY > position.top && e.pageY < position.bottom) {
				contains = element;
			}
		});
		if(contains) {
			return [{
				html: '<li>Open</li>',
				handler: openIcon.bind(contains)
			}, {
				html: '<li>Open in ' + iconizer.active().length + ' Tabs</li>',
				handler: openAll.bind(contains)
			}, {
				html: '<li>Rename</li>',
				handler: renameIcon.bind(contains)
			}, {
				html: '<hr>'
			}, {
				html: '<li>Delete</li>',
				handler: deleteIcon.bind(contains)
			}];
		} else {
			return [{
				html: '<li>New Folder</li>',
				handler: function(e) { newFolder.call(e.context, e); }
			}, {
				html: '<li>New Document</li>',
				handler: function(e) { newDocument.call(e.context, e); }
			}];
		}
	});
}
