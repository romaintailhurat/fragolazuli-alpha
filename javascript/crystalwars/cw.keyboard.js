/*
Handling keyboard with Mousetrap

*/

CW = CW || {};

CW.flags = {
	destroy : false
};

require(['http://cdn.craig.is/js/mousetrap/mousetrap.min.js'], function(Mousetrap) {

	Mousetrap.bind(['d', 'D'], function() {
		console.debug('d or D via Mousetrap');

		CW.flags.destroy ? CW.flags.destroy = false : CW.flags.destroy = true;

		console.debug('destroy flags : ' + CW.flags.destroy); 

	});
});