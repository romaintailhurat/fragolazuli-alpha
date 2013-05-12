var BardSpriteSheet = 'images/rpg-bard.png',
 YuSpriteSheet = 'images/spr-d-yu.png',
 RPG = RPG || {};

RPG.initSprite = function () {
	console.log(YuSpriteSheet + " loaded.");

	Crafty.sprite(16, YuSpriteSheet, {
		spriteBard : [9,0]
	});
};