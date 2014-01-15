/*
Handling keyboard with Mousetrap

*/

CW = CW || {};

CW.flags = {
	destroy : false,
	sonde : false
};

require(['http://cdn.craig.is/js/mousetrap/mousetrap.min.js'], function(Mousetrap) {

	Mousetrap.bind(['d', 'D'], function() {
		console.debug('d or D via Mousetrap');

		CW.flags.destroy ? CW.flags.destroy = false : CW.flags.destroy = true;

		console.debug('destroy flags : ' + CW.flags.destroy); 

	});

	Mousetrap.bind(['s', 'S'], function() {
		console.debug('s or S via Mousetrap');

		CW.flags.sonde ? CW.flags.sonde = false : CW.flags.sonde = true;

		console.debug('sonde flags : ' + CW.flags.sonde);		
	});
});