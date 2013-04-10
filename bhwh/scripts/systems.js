/**
Ensemble des systèmes *custom* utilisés par le jeu ?
*/

var InputSystem = pc.systems.Input.extend('inputSystem',
	{},
	{
		init : function() {
			this._super();
		},

		onAction : function(actionName) {
			if (actionName === 'test') {
				alert('test');
			}

			if (actionName === 'menuCtx') {
				alert('menuCtx');
			}
		}

	});