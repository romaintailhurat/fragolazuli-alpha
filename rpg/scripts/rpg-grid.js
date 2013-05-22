var RPG = RPG || {};

RPG.grid = {
	// number of tiles on y
	height : 20,
	// number of tiles on x
	width : 20,
	tile : {
		height : 32,
		width : 32
	},

	getGameHeight :  function() {
		return this.height * this.tile.height;
	},

	getGameWidth : function() {
		return this.width * this.tile.width;
	}
};