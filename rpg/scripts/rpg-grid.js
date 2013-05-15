var RPG = RPG || {};

RPG.grid = {
	// number of tiles on y
	height : 16,
	// number of tiles on x
	width : 16,
	tile : {
		height : 16,
		width : 16
	},

	getGameHeight :  function() {
		return this.height * this.tile.height;
	},

	getGameWidth : function() {
		return this.width * this.tile.width;
	}
};