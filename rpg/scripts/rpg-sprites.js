var BardSpriteSheet = 'images/rpg-bard.png',
 YuSpriteSheet = 'images/spr-d-yu.png',
 RPG = RPG || {};

RPG.initSprite = function () {
	console.log(YuSpriteSheet + " loaded.");

	Crafty.sprite(16, YuSpriteSheet, {
		SpriteWall : [6,1],
		SpriteBluePotion : [0,2],
		SpriteBard : [0,4],
		SpriteClosedDoor : [4,4]
	});
};