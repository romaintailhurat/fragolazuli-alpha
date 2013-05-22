var RPG = RPG || {};

RPG.boot =  {
  
  start : function() {
    //
    Crafty.init(RPG.grid.getGameWidth(), RPG.grid.getGameHeight());
    Crafty.background('black');

    console.log(RPG.grid.getGameWidth() + ' x ' + RPG.grid.getGameHeight());

    // Création des composants de type sprite
    RPG.initSprite();
    
    // ENTITIES
    
    Crafty
      .e('Wall')
      .attr({
        x : 128,
        y : 64,
        h : RPG.grid.tile.height,
        w : RPG.grid.tile.width     
      });

    // Doors
    Crafty
      .e('ClosedDoor')
      .attr({
        x : 120,
        y : 120,
        h : RPG.grid.tile.height,
        w : RPG.grid.tile.width     
      });
    Crafty
      .e('ClosedDoor')
      .attr({
        x : 56,
        y : 12,
        h : RPG.grid.tile.height,
        w : RPG.grid.tile.width     
      });

    Crafty
      .e('BluePotion')
      .attr({
        x : 160,
        y : 16,
        h : RPG.grid.tile.height,
        w : RPG.grid.tile.width
      });
    
    //Player entity
    Crafty
      .e('Player') // see components
      .attr({
        x : 0,
        y : 0,
        h : RPG.grid.tile.height,
        w : RPG.grid.tile.width
      })
      .multiway(4, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
      .collision();
  }
};



//-------------------

window.addEventListener('load', RPG.boot.start);