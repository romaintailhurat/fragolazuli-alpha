
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
			var ent = Crafty.e(tileType+tileSuffix)
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

		if (ent.__c.Beacon) {
			ent.emit(ent.x, ent.y, CW.entities);
		}
	});
};