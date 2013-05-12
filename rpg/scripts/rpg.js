var RPG = RPG || {};

RPG.boot =  {
  
  start : function() {
    //
    Crafty.init(RPG.grid.getGameWidth(), RPG.grid.getGameHeight());
    Crafty.background('green');

    // Création des composants de type sprite
    RPG.initSprite();
    
    // ENTITIES
    
    Crafty
    .e('Rock')
    .attr({
      x : 128,
      y : 64      
    });
    
    //Player entity
    Crafty
    .e('Player') // see components
    .attr({
      x : 0,
      y : 0,
      h : 16,
      w : 16})
    .color('red')
    .multiway(5, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180});
  }
};



//-------------------

window.addEventListener('load', RPG.boot.start);