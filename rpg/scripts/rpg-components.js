// COMPONENTS
Crafty.c('Actor', {
  init : function() {
    this.requires('2D, Canvas, Color');
  }
});

// Rock
Crafty.c('Rock', {
  init : function() {
    this.requires('Actor, Solid')
      .color('grey').attr({
    h : 32,
    w : 32
    });
  }
});

// Player components
Crafty.c('Player', {
  init : function() {
    this.requires('Actor, Multiway, Collision, spriteBard')
      .stopOnSolids();
  },
  
  stopOnSolids : function() {
    this.onHit('Solid', function() {
      $('#info').html('this is a rock');
      this.stopMovement();
    });
    return this;
  },
  
  stopMovement : function() {
    this._speed = 0;
    if(this._movement) {
      this.x -= this._movement.x + 1;
      this.y -= this._movement.y + 1;
    }
  }
});