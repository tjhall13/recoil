function controller(model) {
	function filesystem(patch) {
		function add(reference, params) {
			
		}

		function edit(reference, params) {
			
		}

		function remove(reference, params) {
			
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
				throw new Error('Unsupported Method:', patch.method);
		}
	}

	return function(patch) {
		var ref = patch.reference.match(/([a-zA-Z]+)((?:\[[0-9a-zA-Z]+\])*)/);
		patch.reference = {
			scope: ref[1]
		};
		if(ref.length > 1) {
			patch.reference.members = ref[2].substr(1, ref[2].length - 2).split('][');
		}

		if(patch.type == 'fs') {
			filesystem(patch);
		} else {
			throw new Error('Unsupported Type:', patch.type);
		}
	};
}

module.exports = controller;
