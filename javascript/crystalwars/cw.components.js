/*
COMPONENTS
*/

require([
	'/javascript/crystalwars/lib/crafty.0.5.3.js'],
	function(crafty) {

		var localNexus = '/images/crystalwars/nexus.png',
			testNexus = 'http://madmoizerg.com/wp-content/uploads/2012/05/3260126777_5da2fa24a7.jpg';

		// ---------- SPRITES
		Crafty.sprite(64, localNexus, {
			
			Nexus1 : [0, 0]

		});

		Crafty.sprite(64, 'https://wiki.srb2.org/w/images/f/f9/GRASS3.png', {

			Land : [0, 0]
		})

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

		Crafty.c('LandTile', {

			init : function() {
				this.addComponent('Tile, SpriteAnimation, Land');
			}

		});

	});

