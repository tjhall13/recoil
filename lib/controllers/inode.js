function controller(model) {
	function filesystem(patch) {
		function add(reference, params) {
			switch(reference.scope) {
				case 'directory':
					model.mkdir(params.name);
					break;
				case 'document':
					model.mkdoc(params.name);
					break;
				default:
					throw new Error('Undefined Reference: ' + reference.scope);
			}
		}

		function edit(reference, params) {
			if(reference.scope == 'inode') {
				model.rename(reference.indices[0], params.name);
			} else {
				throw new Error('Undefined Reference: ' + reference.scope);
			}
		}

		function remove(reference) {
			if(reference.scope == 'inode') {
				model.rm(reference.indices[0]);
			} else {
				throw new Error('Undefined Reference: ' + reference.scope);
			}
		}

		switch(patch.method) {
			case 'add':
				add(patch.reference, patch.params);
				break;
			case 'edit':
				edit(patch.reference, patch.params);
				break;
			case 'remove':
				remove(patch.reference, patch.params);
				break;
			default:
				throw new Error('Unsupported Method: ' + patch.method);
		}
	}

	return function(patch) {
		var ref = patch.reference.match(/([a-zA-Z]+)((?:\[[0-9a-zA-Z_. ]*\])*)/);
		patch.reference = {
			scope: ref[1]
		};
		if(ref.length > 1) {
			patch.reference.indices = ref[2].substr(1, ref[2].length - 2).split('][');
		}

		if(patch.type == 'fs') {
			filesystem(patch);
		} else {
			throw new Error('Unsupported Type: ' + patch.type);
		}
	};
}

module.exports = controller;
