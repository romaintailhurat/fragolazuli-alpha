/*
MAIN LOAD FILE
with help from RequireJS
*/

require(
	[
	'/javascript/crystalwars/lib/superagent.js',
	'/javascript/crystalwars/lib/jquery-2.0.3.min.js',
	'/javascript/lib/crafty-min.0.6.2.js',
	'/javascript/crystalwars/lib/soundjs-0.5.2.min.js',
	'/javascript/crystalwars/cw.keyboard.js',
	'/javascript/crystalwars/cw.messaging.js',
	'/javascript/crystalwars/cw.components.js',
	'/javascript/crystalwars/cw.grid.js',
	],

 	function(superagent, 
 			jquery,
 			crafty,
 			messaging,
 			components) {

	console.info('Main script begins');

	// ---------- CONSTS

	var LOADING = 'LOADING',
		MAIN = 'MAIN';
	
	CW = CW || {};

	// FIXME la taille des sprites est 32x32 à cause d'un bug de décalage
	// lors du scroll de la page =(

	CW.tiles = {
		W : 32,
		H : 32
	};

	CW.screen = {
		W : 20 * CW.tiles.W,
		H : 20 * CW.tiles.H
	};

	// Actions cost
	// FIXME naming !!!!
	CW.operationCost = {
		'use-sonde' : 10,
		'destroy-nexus' : 10
	};

	// Tracks this player Nexus count
	CW.playerNexusCount = 0;


	/*
	Crafty initialization
	*/
	Crafty.init(CW.screen.W, CW.screen.H, 'game-view');
	Crafty.background('#666666');

	Crafty.load(['/images/crystalwars/nexus.png'], function(){

		// Load intro scene; it should be 'ready' screen
		Crafty.scene(LOADING);
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
			.attr({ x : 64, y : 64, w : 400, h : 200 });

		// Loading the main theme
		// FIXME déplacer   =(
		CW.theme = createjs.Sound.play('/music/crystalwars/gameromV1.mp3');
		CW.theme.volume = 0.3;

		// Load the main scene after 2 sec
		setTimeout(function() {
			console.debug('loading main scene');
			Crafty.scene(MAIN);
		}, 2000);
	});

	/*
	The game scene, once each player is ready
	*/
	Crafty.scene(MAIN, function() {

		CW.theme.play();

		// Communicator entity
		CW.communicator = Crafty.e('Communicator');

		CW.createEntitiesFromGrid(CW.grid);

		CW.playerResources = 0;

		// TICKER
		var intervalID = setInterval(function() {

			CW.playerResources += 10 * CW.playerNexusCount;
			document.querySelector('#resources-meter').value = CW.playerResources;
			document.querySelector('#resources-counter').innerText = CW.playerResources.toString();

			//console.log('GLOBAL_RESOURCES : ' + GLOBAL_RESOURCES);

		}, 1000);
		console.debug('intervalID is : ' +  intervalID);
		
	});


});

