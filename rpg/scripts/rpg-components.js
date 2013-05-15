// --------------------
// COMPONENTS
// --------------------

// Base 2D object
Crafty.c('Actor', {
  init : function() {
    this.requires('2D, Canvas, Color');
  }
});

// Item Component

Crafty.c('Item', {

});

// Potions
Crafty.c('BluePotion', {

  init : function () {
    this.requires('Actor, SpriteBluePotion, Item');
  }

});

// Wall
Crafty.c('Wall', {
  
  init : function() {
    this.requires('Actor, SpriteWall, Solid');
  }

});

// Player components
Crafty.c('Player', {
  
  init : function() {
    this.requires('Actor, Fourway, SpriteBard, Collision')
        .bind('Moved', function(from) {

          var outOfBound = 
            this.x < 0 || 
            this.y < 0 || 
            this.x > RPG.grid.getGameWidth() - RPG.grid.tile.width || 
            this.y > RPG.grid.getGameHeight() - RPG.grid.tile.height; // ???
          
          if(this.hit('Solid')) {
            this.attr({ x : from.x, y : from.y });
          }

          if (this.hit('Item')) {
            $('#info').html('you found an item !');
          }

          if (outOfBound) {
            this.attr({ x : from.x, y : from.y });
          }

        })
    }
});