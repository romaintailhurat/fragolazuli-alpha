/*
MAIN LOAD FILE
with help from RequireJS
*/

require(
	[
	'/javascript/crystalwars/lib/superagent.js',
	'/javascript/crystalwars/lib/jquery-2.0.3.min.js',
	'/javascript/crystalwars/lib/crafty.0.5.3.js',
	'/javascript/crystalwars/cw.messaging.js',
	'/javascript/crystalwars/cw.components.js'
	],

 	function(sa, 
 			jquery,
 			crafty,
 			messaging,
 			components) {

	console.info('Main script begins');

	// ---------- CONSTS

	var LOADING = 'LOADING',
		MAIN = 'MAIN';
	
	CW = CW || {};

	CW.tiles = {
		W : 64,
		H : 64
	};

	CW.screen = {
		W : 20 * CW.tiles.W,
		H : 20 * CW.tiles.H
	};
	
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
	Crafty.init(CW.screen.W, CW.screen.H, 'game-view');
	Crafty.background('#666666');

	Crafty.load(['/images/crystalwars/nexus.png'], function(){

		// Load intro scene; Should be 'ready' screen
		Crafty.scene(MAIN);
	});

	/*
	Loading screen
	TODO add ready button
	*/
	Crafty.scene(LOADING, function() {
		var intro = Crafty.e('2D, Canvas, HTML'),
			html = '<h2>Are you ready ?</h2>';

		intro
			.replace(html)
			.attr({ x : 64, y : 64, w : 400, h : 200 })
			.textColor('#FFFFFF');
	});

	/*
	The game scene, once each player is ready
	*/
	Crafty.scene(MAIN, function() {

		// TODO extract in utils package ?
		// FIXME underscore map !!!
		for (var i = 0 ; i < CW.grid.length ; i++) {
			
			for (var j = 0 ; j < CW.grid[i].length ; j++) {
				
				var tileType = CW.grid[i][j],
					tileSuffix = 'Tile'; // FIXME must be a constant

				console.debug('Creating tile of type : ' + tileType + tileSuffix);


				console.debug(i * CW.tiles.W);
				Crafty.e(tileType+tileSuffix)
					.attr({
					 x : i * CW.tiles.W,
					 y : j * CW.tiles.H,
					 w : CW.tiles.W,
					 h : CW.tiles.H
					});

			}
		}
	});


});

