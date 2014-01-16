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
			
			Nexus1Sprite : [0, 0]

		});

		Crafty.sprite(64, 'https://wiki.srb2.org/w/images/f/f9/GRASS3.png', {

			LandSprite : [0, 0]
		});

		Crafty.sprite(64, 'http://fc08.deviantart.net/fs40/f/2009/042/d/5/64x64_RPG_2d_rock_tile_by_lendrick.png', {

			RockSprite : [0, 0]

		});

		Crafty.sprite(64, 'http://userserve-ak.last.fm/serve/64/91490815.jpg', {

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
		        ent.x === xx - 64  && ent.y === yy - 64 ||
		        ent.x === xx && ent.y === yy - 64 ||
		        ent.x === xx + 64 && ent.y === yy - 64 ||
		        ent.x === xx - 64  && ent.y === yy ||
		        ent.x === xx + 64  && ent.y === yy ||
		        ent.x === xx - 64  && ent.y === yy + 64 ||
		        ent.x === xx && ent.y === yy + 64 ||
		        ent.x === xx + 64  && ent.y === yy + 64 ||
		        ent.x === xx && ent.y === yy;
		      
		      if ( entityNeighboursConditions ) {
		      	console.debug('One entity is neighbour of a beacon');
		        ent.receive('add');
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
					if (CW.flags.sonde) {
						console.debug('adding Beacon component to this tile');
						this.addComponent('Beacon');
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
					if (CW.flags.sonde) {
						console.debug('adding Beacon component to this tile');
						this.addComponent('Beacon');
						this.emit(this.x, this.y, CW.entities);
					}
				});
			}

		});

	});

