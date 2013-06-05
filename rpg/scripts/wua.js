var WUA = {};

WUA.mapSources = {
	chapter1 : undefined
};

WUA.start = function () {
	
	// Game window
	//Crafty.init(window.innerWidth - 20, window.innerHeight - 20);
	Crafty.init(800, 600);

	Crafty.background('black');

	// SPRITES
	Crafty.sprite(32, 'images/wua-sprites.png', {
		AlexArmorSprite : [0,0],
		AlexNakedSprite : [0,32]
	});

	// ---------- COMPONENTS

	// Ales
	Crafty.c('Alex', {
		init : function () {
			this.requires('2D, Canvas, Multiway, SpriteAnimation, AlexArmorSprite');

			this.bind('enterframe', function() {

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
	// du chapitre 1
	Crafty.scene('wua', function() {

		$.getJSON('images/wua-decors-murs-tilemap.json', function(data) {
			// l'objet correspondant à la carte du chapter1
			WUA.mapSources.chapter1 = data;
		});
		
		Crafty.e('HTML')
			.attr({ x : 128, y : 128, w : 40, h : 400 })
			.append('<div id="intro-text" class="hero-text">Wake up, Alex</div>');

		setTimeout(function() {
			console.log('switching to chapter-1');
			Crafty.scene('chapter1');
		}, 3000);

	});

	Crafty.scene('chapter1', function() {

		// CREATION CARTE
		Crafty.e('2D, Canvas, TiledMapBuilder')
			.setMapDataSource(WUA.mapSources.chapter1)
			.createWorld( function (tiledmap) {

				var numOfMurs = 0;

				_.each(tiledmap.getEntitiesInLayer('murs'), function(v, k, l) {
					numOfMurs += 1;
				});

				console.log('il y a ' + numOfMurs + ' murs.');
			});

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


	// ---------- START

	Crafty.scene('wua');

}

// ---------------

window.addEventListener('load', WUA.start);