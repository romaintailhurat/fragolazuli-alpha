var WUA = {};

// CONSTANTES

WUA.constantes = {

	scenes : {
		SHIP : 'ship',
		SHIP_MAP : 'shipMap',
		SYSTEM_MAP : 'systemMap',
		GALACTIC_MAP: 'galacticMap',
		PLANET : 'onAPlanet'
	}
};

WUA.mapSources = {
	ship : undefined
};

// ---------- KEYS

Mousetrap.bind(['&','1'], function() {
	Crafty.scene(WUA.constantes.scenes.SHIP);
});

Mousetrap.bind(['é','2'], function() {
	Crafty.scene('shipMap');
});

Mousetrap.bind(['"','3'], function() {
	Crafty.scene('systemMap');
});

Mousetrap.bind(["'",'4'], function() {
	Crafty.scene('galacticMap');
});

Mousetrap.bind(['(', '5'], function() {
	Crafty.scene('onAPlanet');
});

Mousetrap.bind(['f','F'], function(e) {
	// Chrome only #TODO faire la même chose pour FF
	document.querySelector('body').webkitRequestFullScreen();
});


WUA.start = function () {
	
	// Game window
	Crafty.init(window.innerWidth - 20, window.innerHeight - 20);
	//Crafty.init(1200, 800);

	Crafty.background('black');

	// ---------- SPRITES
	Crafty.sprite(32, 'images/wua-sprites.png', {
		AlexArmorSprite : [0,0],
		AlexNakedSprite : [0,32]
	});


	// ---------- COMPONENTS

	// Alex, our hero
	Crafty.c('Alex', {
		init : function () {
			this.requires('2D, Canvas, Collision, Multiway, SpriteAnimation, AlexArmorSprite');

			this.bind('enterframe', function() {

			});

			// Gestion de la collision avec un Solid (ex : un mur)
			this.bind('Moved', function(from) {
				if( this.hit('Solid') ) {
					this.attr({ x : from.x, y : from.y });
				}
			});
		}
	});

	Crafty.c('MetalWall', {
		init : function() {
			this.requires('2D, Canvas, Color');
		}
	});

	// ---------- SCENES

	// Scene d'intro, on en profite par exemple pour charger la conf de la carte
	// du vaisseau
	Crafty.scene('wua', function() {

		$.getJSON('images/wua-decors-murs-tilemap.json', function(data) {
			// l'objet correspondant à la carte du ship
			WUA.mapSources.ship = data;
		});
		
		Crafty.e('HTML')
			.attr({ x : 128, y : 128, w : 400, h : 400 })
			.append('<div id="intro-text" class="hero-text">Wake up, Alex</div>');

		setTimeout(function() {
			console.log('switching to ship scene');
			Crafty.scene('ship');
		}, 3000);

	});

	// SHIP VIEW
	Crafty.scene(WUA.constantes.scenes.SHIP, function() {

		// CREATION CARTE
		Crafty.e('2D, Canvas, TiledMapBuilder')
			.setMapDataSource(WUA.mapSources.ship)
			.createWorld( function (tiledmap) {

				var numOfMurs = 0;

				// Entités de type murs
				_.each(tiledmap.getEntitiesInLayer('murs'), function(v, k, l) {

					// ajoute le composant de collision
					v.addComponent('Solid');

				});
			});

		// ---------- ENTITIES

		// ALEX ENTITY
		var Alex = 
		Crafty
			.e('Alex')
			.attr({
				x : 100,
				y : 100
			})
			.multiway(4, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
			.animate('blinking', 0, 0, 4)
			.animate('blinking', 100, -1);

		// A wall
		Crafty.e('MetalWall').attr({ x : 140, y : 140, w : 32, h : 32}).color('blue');

		// Camera on Alex
		Crafty.viewport.follow(Alex, 0, 0);
	});

	// SHIP MAP
	
	Crafty.scene('shipMap', function() {
		Crafty.e('HTML')
			.attr({ x : 0, y : 0, w : 400, h : 400 })
			.append('<div id="intro-text" class="hero-text">this is the ship map.</div>');
	});


	// ---------- START

	Crafty.scene('wua');

}

// ---------------

window.addEventListener('load', WUA.start);