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
	var $current = $('nav .nav-tree li[data-status="current"]');
	function resolve(text) {
		return $current.children('ul').children('li').children('a:contains(' + text + ')');
	}

	function openIcon(e) {
		handlers.follow.call($(this));
	}

	function openAll(e) {
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
			var value = name.text();
			update('fs', 'edit', 'inode[' + original + ']', { name: value })
				.success(function(response) {
					if(response.status == 'success') {
						var $link = resolve(original);
						var type = $link.attr('href').slice(-1);
						var href = type == '/' ? name.text() + '/' : name.text();

						$link.attr('href', href);
						$link.text(value);
						name.text(value);
						$(icon).attr('data-href', href);
					}
				});
			$(icon).removeClass('icon-edit');
			name.text(original);
			name.attr('contenteditable', false);
			$(icon).removeClass('icon-edit');
		});
	}

	function deleteIcon(e) {
		var icon = this;
		var label = $(icon).find('span:not(.img)').text();
		update('fs', 'remove', 'inode[' + label + ']')
			.success(function(response) {
				if(response.status == 'success') {
					resolve(label).closest('li').remove();
					iconizer.remove(icon);
					$(icon).remove();
				}
			});
	}

	function deleteAll(e) {
		var updates = [];
		var active = iconizer.active();

		active.forEach(function(icon) {
			var label = $(icon).find('span:not(.img)').text();
			updates.push({
				type: 'fs',
				method: 'remove',
				reference: 'inode[' + label + ']'
			});
		});
		update(updates)
			.success(function(response) {
				active.forEach(function(icon, index) {
					if(response[index].status == 'success') {
						var label = $(icon).find('span:not(.img)').text();
						resolve(label).closest('li').remove();
						iconizer.remove(icon);
						$(icon).remove();
					}
				});
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
				.success(function(response) {
					if(response.status == 'success') {
						var $link;
						$current.children('ul').append(
							$('<li class="parent">').append(
								$link = $('<a href="' + $name.text() + '/">' + $name.text() + '</a>'),
								$('<ul>')
							)
						);
						$link.click(handlers.expand);
						$link.dblclick(handlers.goto);
						inodes.append($icon);
						iconizer.add($icon);
						$icon.attr('data-href', $name.text() + '/');
						$icon.on('follow', handlers.follow);
					}
				});
			$icon.removeClass('icon-edit');
			$name.attr('contenteditable', false);
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
				.success(function(response) {
					if(response.status == 'success') {
						var $link;
						$current.children('ul').append(
							$('<li>').append(
								$link = $('<a href="' + $name.text() + '">' + $name.text() + '</a>'),
								$('<ul>')
							)
						);
						$link.click(handlers.goto);
						inodes.append($icon);
						iconizer.add($icon);
						$icon.attr('data-href', $name.text());
						$icon.on('follow', handlers.follow);
					}
				});
			$icon.removeClass('icon-edit');
			$name.attr('contenteditable', false);
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
			}, {
				html: '<li>Delete ' + iconizer.active().length + ' Objects</li>',
				handler: deleteAll.bind(contains)
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
