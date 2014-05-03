/*
COMPONENTS
*/

require([
	'/javascript/lib/crafty-min.0.6.2.js',
	'/javascript/crystalwars/lib/superagent.js',
	'/javascript/lib/underscore-min.js'],

	function(crafty, superagent, underscore) {

		var localNexus = '/images/crystalwars/nexus.png',
			testNexus = 'http://icons.iconarchive.com/icons/aha-soft/perfect-city/32/commercial-building-icon.png';

		// ---------- SPRITES

		Crafty.sprite(CW.tiles.W, testNexus, {

			Nexus1Sprite : [0, 0]

		});

		Crafty.sprite(CW.tiles.W, localNexus, {

			Nexus2Sprite : [0, 0]

		});

		Crafty.sprite(CW.tiles.W, 'https://wiki.srb2.org/w/images/f/f9/GRASS3.png', {

			LandSprite : [0, 0]
		});

		Crafty.sprite(CW.tiles.W, 'http://fc08.deviantart.net/fs40/f/2009/042/d/5/64x64_RPG_2d_rock_tile_by_lendrick.png', {

			RockSprite : [0, 0]

		});

		Crafty.sprite(CW.tiles.W, 'http://fr.aiondatabase.com/res/icons/32/icon_item_crystal02b.png', {

			ResourceSprite : [0, 0]

		});

		Crafty.sprite(CW.tiles.W, 'http://userserve-ak.last.fm/serve/64/91490815.jpg', {

			BlackTileSprite : [0, 0]

		});

		// ---------- COMMUNICATOR

		/*
		This component is in charge with sending message
		and handling messages (in 'onmessage' function)
		from the server
		*/
		Crafty.c('Communicator', {

			init : function() {},

			update : function(operation, position) {
				/*
				Method use for transmitting update from a player to the server
				*/

				// FIXME check that position is an array of two int

				// PUT request using superagent
				superagent
					.put(CW.gameURL)
					.query({
						sender : CW.currentPlayer,
						operation : operation,
						position : position
					 })
					.end(function(res) {
						if (res.ok) {
							var responseHash = JSON.parse(res.text);
							console.log('PUT was ok.');
							console.log(responseHash.isOk);
							console.log(responseHash.message);
							return responseHash.isOk;
						} else {
							console.log('Oops, something went wrong with PUT request!')
							return false;
						}
					});

			},

			disco_nexus : function(x, y) {
				/*
				This method is called when a 'disco_nexus' message is sent by the
				server
				@param x the x of the discovered nexus
				@param y the y of the discovered nexus
				*/
				console.debug('type de x :' + typeof x);
				if (typeof x !== 'number' || typeof y!== 'number') {
					throw new Error('One of the two parameters is not an int');
				}
				console.log('The communicator says : disco nexus in ' + x + '-' + y);


			},

			destroy_nexus : function(x, y) {
				/*
				This method is called when a 'destroy_nexus' message is sent by the
				server
				@param x the x of the nexus
				#param y the y of the nexus
				*/
				if (typeof x !== 'number' || typeof y!== 'number') {
					throw new Error('One of the two parameters is not an int');
				}
				console.debug('The communicator says : destroy nexus in ' + x + '-' + y);

				// FIXME maybe not the better implementation
				// Find and destroy the nexus
				CW.entities.map(function(ent) {
					// Looking for the right entities
					if (ent.x === x && ent.y === y) {
						//destroy the nexus
						ent.toLandTile();
					}
				});
				//
				CW.playerNexusCount -= 1;
			}

		});

		// ---------- FOG OF WAR

		Crafty.c('Beacon', {

		  init : function(){

		  },

		  emit : function(x, y, entities) {

		  	console.debug('Emitting for this beacon');

		    var xx = x,
		        yy = y;

				// FIXME poor implementation
				// it should be better to calculate the xs and ys of
				// the neighbours...
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
		      			var realX = ent._x / CW.tiles.W,
		      				realY = ent._y / CW.tiles.H;
		      			CW.communicator.update('disco_nexus', [realX, realY]);

		      		}
		      	} else if (CW.currentPlayer === 'player2') {
		      		if (ent.__c.NexusP1Tile) {
		      			console.warn('you just discovered a player2 Nexus !');
		      			var realX = ent._x / CW.tiles.W,
		      				realY = ent._y / CW.tiles.H;
		      			CW.communicator.update('disco_nexus', [realX, realY]);
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

		/*
		Nexus
		*/
		Crafty.c('NexusTile', {

			init: function() {
				this.addComponent('Tile, SpriteAnimation, BlackTileSprite, Foggable, Beacon, Life');

				// Life bar
				this.setLife(100);

				// FIXME add the sonde action to the click !!!
				this.bind('Click', function() {
					console.log('you clicked on a nexus.');
					// FIXME what is the best condition ???
					if (!this.__c.BlackTileSprite) {
						// destroy if it is an ennemy nexus
						if(this._player !== CW.currentPlayer) {
							// Send the destroy command !
							console.debug('Destroy nexus in x : ' + this._x +' y : '+ this._y);
							CW.communicator.update('destroy_nexus', [this._x, this._y]);
							this.toLandTile();
						}

					} else {
						// FIXME put that in a function !
						CW.playerResources -= CW.operationCost['use-sonde'];
						document.querySelector('#resources-meter').value = CW.playerResources;
						document.querySelector('#resources-counter').value = CW.playerResources;

						console.debug('adding Beacon component to this tile');
						this.addComponent('Beacon');
						this.emit(this.x, this.y, CW.entities);
					}
				});
			},

			/*
			This function transform a nexus tile into a land tile
			by removing and adding the right components.
			*/
			toLandTile : function() {
				console.log('this Nexus --> to LandTile');
				console.debug('Components list before : ' + _.keys(this.__c));

				// Check what is the ennemy nexus sprite name
				if (CW.currentPlayer === 'player1') {
					var otherPlayerNexus = 'Nexus2',
							otherPlayerNexusTile = 'NexusP2Tile';
				} else {
					var otherPlayerNexus = 'Nexus1',
							otherPlayerNexusTile = 'NexusP1Tile';
				}

				var otherSprite = otherPlayerNexus + 'Sprite';

				// Remove
				this.removeComponent('NexusTile');
				this.removeComponent(otherSprite);
				this.removeComponent(otherPlayerNexusTile);

				// Add
				this.addComponent('LandTile');
				console.debug('Components list after : ' + _.keys(this.__c));

				// Now this tile is known, so it must be visible
				this.toOriginalTile();
			}

		});

		// Nexus player1
		Crafty.c('NexusP1Tile', {

			_player : 'player1',
			_originalSprite : 'Nexus1Sprite',

			init : function() {
				this.addComponent('NexusTile');
			}

		});

		// Nexus player2
		Crafty.c('NexusP2Tile', {

			_player : 'player2',
			_originalSprite : 'Nexus2Sprite',

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

					if (CW.playerResources >= CW.operationCost['use-sonde']) {
						// FIXME put that in a function !
						CW.playerResources -= CW.operationCost['use-sonde'];
						document.querySelector('#resources-meter').value = CW.playerResources;
						document.querySelector('#resources-counter').value = CW.playerResources;

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

					if (CW.playerResources >= CW.operationCost['use-sonde']) {
						// FIXME put that in a function !
						CW.playerResources -= CW.operationCost['use-sonde'];
						document.querySelector('#resources-meter').value = CW.playerResources;
						document.querySelector('#resources-counter').value = CW.playerResources;

						console.debug('adding Beacon component to this tile');
						this.addComponent('Beacon');
						this.emit(this.x, this.y, CW.entities);
					}
				});
			}

		});

		Crafty.c('ResourceTile', {

			_originalSprite : 'ResourceSprite',

			init : function() {
				this.addComponent('Tile, SpriteAnimation, BlackTileSprite, Foggable');

				this.bind('Click', function() {
					console.log('you clicked on a tile :' + _.keys(this.__c));

					if (CW.playerResources >= CW.operationCost['use-sonde']) {

						console.debug('beacon? ' + this.__c.Beacon);

						// FIXME what is the best condition ???
						if (!this.__c.BlackTileSprite) {
							this.toNexus();
						} else {
							// FIXME put that in a function !
							CW.playerResources -= CW.operationCost['use-sonde'];
							document.querySelector('#resources-meter').value = CW.playerResources;
							document.querySelector('#resources-counter').value = CW.playerResources;

							console.debug('adding Beacon component to this tile');
							this.addComponent('Beacon');
							this.emit(this.x, this.y, CW.entities);
						}


					}
				});
			},

			toNexus : function() {
				console.log('to Nexus');
				console.debug('Components list before : ' + _.keys(this.__c));
				this.removeComponent('ResourceTile');
				this.removeComponent('ResourceSprite');
				this.addComponent('NexusP1Tile, Nexus1Sprite');
				CW.playerNexusCount += 1 ;
				console.debug('Components list after : ' + _.keys(this.__c));
			}

		});

	});
