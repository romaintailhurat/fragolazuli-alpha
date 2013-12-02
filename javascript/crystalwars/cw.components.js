/*
COMPONENTS
*/

require([
	'/javascript/crystalwars/lib/crafty.0.5.3.js'],
	function(crafty) {

		// ---------- SPRITES
		Crafty.sprite(64, '/images/crystalwars/nexus.png', {
			
			Nexus1 : [0, 0]

		});

		// ---------- TILES

		Crafty.c('Tile', {

			init: function() {
				this.addComponent('2D, Canvas, Mouse');
			}

		});

		Crafty.c('NexusTile', {

			init: function() {
				this.addComponent('Tile, SpriteAnimation, Nexus1');

				this.bind('Click', function() {
					console.log('you clicked on a nexus.');
				});
			}

		});

	});

