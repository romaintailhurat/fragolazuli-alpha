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
        h : 16,
        w : 16     
      });

    // Doors
    Crafty
      .e('ClosedDoor')
      .attr({
        x : 120,
        y : 120,
        h : 16,
        w : 16     
      });
    Crafty
      .e('ClosedDoor')
      .attr({
        x : 56,
        y : 12,
        h : 16,
        w : 16     
      });

    Crafty
      .e('BluePotion')
      .attr({
        x : 16,
        y : 16
      });
    
    //Player entity
    Crafty
      .e('Player') // see components
      .attr({
        x : 0,
        y : 0,
        h : 16,
        w : 16
      })
      .multiway(4, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
      .collision();
  }
};



//-------------------

window.addEventListener('load', RPG.boot.start);