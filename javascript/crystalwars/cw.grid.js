
CW = CW || {};

CW.entities = [];

/*
Create relevant entities from grid
*/
CW.createEntitiesFromGrid = function(grid) {
	for (var i = 0 ; i < grid.length ; i++) {
		
		for (var j = 0 ; j < grid[i].length ; j++) {
			
			var tileType = grid[i][j],
				tileSuffix = 'Tile'; // FIXME must be a constant

			// Create entity
			var ent = Crafty.e(tileType + tileSuffix)
				.attr({
				 x : i * CW.tiles.W,
				 y : j * CW.tiles.H,
				 w : CW.tiles.W,
				 h : CW.tiles.H
				});

			// Add entity to global entities array
			CW.entities.push(ent);

		}
	}

	// Update FoW conditions
	CW.entities.map(function(ent) {

		// If entity is of kind Beacon, we MAY have to lift the fog
		if (ent.__c.Beacon) {

			// Check if entity is owned by the current player
			// It it the init phase, so that Beacon MUST be a Nexus
			if (ent._player === CW.currentPlayer) {
				ent.emit(ent.x, ent.y, CW.entities);	
			}
			
		}
	});

	// At the beginning of a game, each player get a Nexus
	CW.playerNexusCount += 1;
};