
CW = CW || {};
/*
Create relevant entities from grid
*/
CW.createEntitiesFromGrid = function(grid) {
	for (var i = 0 ; i < grid.length ; i++) {
		
		for (var j = 0 ; j < grid[i].length ; j++) {
			
			var tileType = grid[i][j],
				tileSuffix = 'Tile'; // FIXME must be a constant

			console.debug('Creating tile of type : ' + tileType + tileSuffix);


			console.debug(i * CW.tiles.W);
			Crafty.e(tileType+tileSuffix)
				.attr({
				 x : i * CW.tiles.W,
				 y : j * CW.tiles.H,
				 w : CW.tiles.W,
				 h : CW.tiles.H
				});

		}
	}
};