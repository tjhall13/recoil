function controller(model) {
	function section(patch) {
		function edit(reference, params) {
			switch(reference.scope) {
				case 'purpose':
					model.document.introduction[0].purpose[0] = params.text;
					break;
				case 'overview':
					model.document.introduction[0].overview[0] = params.text;
					break;
				case 'references':
					model.document.introduction[0].references[0] = params.text;
					break;
				case 'description':
					model.document.description[0] = params.text;
					break;
				default:
					throw new Error('Undefined Reference:', reference);
			}
		}

		switch(patch.method) {
			case 'edit':
				edit(patch.reference, patch.params);
				break;
			default:
				throw new Error('Unsupported Method:', method);
		}
	}
	function definition(patch) {
		var definitions = model.document.introduction[0].definitions[0].definition;

		function add(reference, params) {
			if(reference.scope == 'definition') {
				definitions.splice(reference.indices[0], 0, {
					$: { word: params.word },
					_: params.definition
				});
			} else {
				throw new Error('Undefined Reference:', reference.scope);
			}
		}
		function edit(reference, params) {
			if(reference.scope == 'definition') {
				definitions[reference.indices[0]] = {
					$: { word: params.word },
					_: params.definition
				};
			} else {
				throw new Error('Undefined Reference:', reference.scope);
			}
		}
		function remove(reference) {
			if(reference.scope == 'definition') {
				definitions.splice(reference.indices[0], 1);
			} else {
				throw new Error('Undefined Reference:', reference.scope);
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
				remove(patch.reference);
				break;
			default:
				throw new Error('Unsupported Method:', method);
		}
	}
	function requirement(patch) {
		function resolve(req, indices) {
			if(indices.length == 1) {
				return {
					node: req,
					index: indices[0]
				};
			} else {
				var index = indices.shift();
				return resolve(req.requirement[index], indices);
			}
		}
		var requirements = model.document.requirements[0];

		function add(reference, params) {
			if(reference.scope == 'requirement') {
				var context = resolve(requirements, reference.indices);
				if(context.node.requirement) {
					context.node.requirement.splice(context.index, 0, {
						$: { title: params.title, body: params.body }
					});
				} else {
					context.node.requirement = [{
						$: { title: params.title, body: params.body }
					}];
				}
			} else {
				throw new Error('Undefined Reference:', reference.scope);
			}
		}
		function edit(reference, params) {
			if(reference.scope == 'requirement') {
				var context = resolve(requirements, reference.indices);
				context.node.requirement[context.index].$ = {
					title: params.title,
					body: params.body
				};
			} else {
				throw new Error('Undefined Reference:', reference.scope);
			}
		}
		function remove(reference) {
			if(reference.scope == 'requirement') {
				var context = resolve(requirements, reference.indices);
				context.node.requirement.splice(context.index, 1);
			} else {
				throw new Error('Undefined Reference:', reference.scope);
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
				remove(patch.reference);
				break;
			default:
				throw new Error('Unsupported Method:', method);
		}
	}

	return function(patch) {
		var ref = patch.reference.match(/([a-zA-Z]+)((?:\[[0-9]+\])*)/);
		patch.reference = {
			scope: ref[1]
		};
		if(ref.length > 1) {
			patch.reference.indices = ref[2].substr(1, ref[2].length - 2).split('][');
		}
		switch(patch.type) {
			case 'section':
				section(patch);
				break;
			case 'definition':
				definition(patch);
				break;
			case 'requirement':
				requirement(patch);
				break;
			default:
				throw new Error('Unsupported Type:', patch.type);
		}
	};
}

module.exports = controller;
