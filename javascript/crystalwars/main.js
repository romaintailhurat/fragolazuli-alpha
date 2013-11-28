/*
MAIN LOAD FILE
with help from RequireJS
*/

require(
	[
	'/javascript/crystalwars/cw.components.js',
	'/javascript/crystalwars/lib/superagent.js',
	'/javascript/crystalwars/lib/jquery-2.0.3.min.js',
	'/javascript/crystalwars/lib/crafty.0.5.3.js',
	'/javascript/crystalwars/cw.messaging.js'
	],

 	function(
 		components, 
 		jsapi,
 		superagent, 
 		jquery,
 		crafty, 
 		messaging) {

	console.log('dependencies have been loaded.');

	// ----------

	console.log('ready');

	// Name declared as parameters cannot be used
	truc();
	
	/*
	TEST
	*/
	$('#test').click(function() {

		console.log('sending a PUT to ' + window.location.host + '' + CW.gameURL);
		// sending request with SuperAgent
		superagent
			.put(CW.gameURL)
			.query({ p : CW.currentPlayer })
			.end(function(res) {
				if (res.ok) {
					console.log('PUT was ok.');
				} else {
					console.log('Oops, something went wrong with PUT request!')
				}
			});
	});

	/*
	Crafty initialization
	*/
	Crafty.init(400,200,'game-view');
	Crafty.background('#666666');

});

