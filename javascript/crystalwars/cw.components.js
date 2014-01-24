/*
COMPONENTS
*/

require([
	'/javascript/crystalwars/lib/crafty.0.5.3.js'],
	function(crafty) {

		var localNexus = '/images/crystalwars/nexus.png',
			testNexus = 'http://madmoizerg.com/wp-content/uploads/2012/05/3260126777_5da2fa24a7.jpg';

		// ---------- SPRITES

		Crafty.sprite(CW.tiles.W, localNexus, {
			
			Nexus1Sprite : [0, 0]

		});

		Crafty.sprite(CW.tiles.W, 'https://wiki.srb2.org/w/images/f/f9/GRASS3.png', {

			LandSprite : [0, 0]
		});

		Crafty.sprite(CW.tiles.W, 'http://fc08.deviantart.net/fs40/f/2009/042/d/5/64x64_RPG_2d_rock_tile_by_lendrick.png', {

			RockSprite : [0, 0]

		});

		Crafty.sprite(CW.tiles.W, 'http://userserve-ak.last.fm/serve/64/91490815.jpg', {

			BlackTileSprite : [0, 0]

		});

		// ---------- FOG OF WAR

		Crafty.c('Beacon', {
		  
		  init : function(){
		    
		  },

		  emit : function(x, y, entities) {

		  	console.debug('Emitting for this beacon');
		    
		    var xx = x,
		        yy = y;

		    entities.map(function(ent) {
		      
		      var entityNeighboursConditions = 
		        ent.x === xx - CW.tiles.W  && ent.y === yy - CW.tiles.H ||
		        ent.x === xx && ent.y === yy - CW.tiles.H ||
		        ent.x === xx + CW.tiles.W && ent.y === yy - CW.tiles.H ||
		        ent.x === xx - CW.tiles.W  && ent.y === yy ||
		        ent.x === xx + CW.tiles.W  && ent.y === yy ||
		        ent.x === xx - CW.tiles.W  && ent.y === yy + CW.tiles.H ||
		        ent.x === xx && ent.y === yy + CW.tiles.H ||
		        ent.x === xx + CW.tiles.W  && ent.y === yy + CW.tiles.H ||
		        ent.x === xx && ent.y === yy;
		      
		      if ( entityNeighboursConditions ) {
		      	console.debug('One entity is neighbour of a beacon');
		        ent.receive('add');

		        // FIXME create a method
		        // Check if player 1 has discovered a player2 Nexus
		        if (CW.currentPlayer === 'player1') {
		      		if (ent.__c.NexusP2Tile) {
		      			console.warn('you just discovered a player2 Nexus !');
		      		}
		      }

		      }

		      
		    });
		  }
		});

		Crafty.c('Foggable', {
		  
		  // component field 
		  _beacons : 0,
		  
		  receive : function(operation) {
		    
		    console.debug('receive function called on ' + this + ' with operation ' + operation);
		    
		    if (operation === 'add') {
		      this._beacons += 1;
		    } else if (operation === 'subtract') {
		      this._beacons -= 1;
		    }

		    this.updateDisplay();
		    
		    
		  },

		  updateDisplay : function() {
		  	
			if (this._beacons > 0) {
				this.toOriginalTile();

	    	} else {
	    		this.toBlackTile();
	    	}

		  },

		  toOriginalTile : function() {

		  	if (this.__c.BlackTileSprite) {
	      			delete this.__c.BlackTileSprite;
	      		}
	      		
	      	this.addComponent(this._originalSprite);
		  },

		  toBlackTile : function() {

			delete this.__c[this._originalSprite];
			this.addComponent('BlackTileSprite');

		}

		});


		// ---------- LIFE

		Crafty.c('Life', {

			_life : 0,

			init : function() {

			},

			setLife : function(lifeLevel) {
				this._life = lifeLevel;
				console.debug('Setting life to ' + lifeLevel);
				console.debug('this._life : ' + this._life);
			}

		});

		// ---------- TILES

		Crafty.c('Tile', {

			init: function() {
				this.addComponent('2D, Canvas, Mouse');
			}

		});

		// Nexus

		Crafty.c('NexusTile', {

			_originalSprite : 'Nexus1Sprite',

			init: function() {
				this.addComponent('Tile, SpriteAnimation, BlackTileSprite, Foggable, Beacon, Life');

				// Life bar
				this.setLife(100);

				// FIXME add the sonde action to the click !!!
				this.bind('Click', function() {
					console.log('you clicked on a nexus.');
					if (CW.flags.destroy) {
						console.debug('destroying this entity : ' + this._entityName);
						delete this;
					}
				});
			}

		});

		// Nexus player1
		Crafty.c('NexusP1Tile', {

			_player : 'player1',

			init : function() {
				this.addComponent('NexusTile');
			}

		});

		// Nexus player2
		Crafty.c('NexusP2Tile', {

			_player : 'player2',

			init : function() {
				this.addComponent('NexusTile');
			}

		});

		Crafty.c('LandTile', {

			_originalSprite : 'LandSprite',

			init : function() {
				this.addComponent('Tile, SpriteAnimation, BlackTileSprite, Foggable');

				this.bind('Click', function() {
					console.log('you clicked on a Land tile');

					// Action 'sonde' est sélectionnée
					if (CW.flags.sonde) {
						console.debug('adding Beacon component to this tile');
						this.addComponent('Beacon');
						
						// TODO supprimer
						console.debug('Land tile x is : ' + this.x);
						console.debug('Land tile y is : ' + this.y);
						
						this.emit(this.x, this.y, CW.entities);
					}
				});
			}

		});

		Crafty.c('RockTile', {

			_originalSprite : 'RockSprite',

			init : function() {
				this.addComponent('Tile, SpriteAnimation, BlackTileSprite, Foggable');

				this.bind('Click', function() {
					console.log('you clicked on a Land tile');

					// Action 'sonde' est sélectionnée
					if (CW.flags.sonde) {
						console.debug('adding Beacon component to this tile');
						this.addComponent('Beacon');
						
						// TODO supprimer
						console.debug('Land tile x is : ' + this.x);
						console.debug('Land tile y is : ' + this.y);

						this.emit(this.x, this.y, CW.entities);
					}
				});
			}

		});

	});

