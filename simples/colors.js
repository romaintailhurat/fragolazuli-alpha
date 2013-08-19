// ----- GLOBAL

var ELEMS = {};

ELEMS.display = {
  
  scale : 10,
  
  tiles : {
    w : 64,
    h : 64
  },
  
  colorsCount : {'#FF2244':0, '#AAFFAA':0, '#565656':0, '#127676':0, '#88CCCC':0}
};

ELEMS.display.colors = _.keys(ELEMS.display.colorsCount);

ELEMS.utils = {
  
  /**/
  getRandomColor : function() {
    var randomColor = ELEMS.display.colors[Math.floor(
          Math.random() * ELEMS.display.colors.length
        )];
    return randomColor;
  },
  
  /**/
  getNextColor : function(color) {
    var indexCurr;
    
    indexCurr = ELEMS.display.colors.indexOf(color);
    
    if (indexCurr === ELEMS.display.colors.length - 1) {
      return ELEMS.display.colors[0];
    } else {
      return ELEMS.display.colors[indexCurr + 1];
    }
  }
};

ELEMS.counters = {
  clicks : 55
};

Crafty.init(
  ELEMS.display.tiles.w * ELEMS.display.scale,
  ELEMS.display.tiles.h * ELEMS.display.scale,
  'canvas'
);

// ----- COMPONENTS

// 
Crafty.c('Tiles', {

  init : function() {
    this.addComponent('2D, Canvas, Color, Mouse');
  }
});


// ----- ENTITIES

// generating tiles
for (var i = 0 ; i < ELEMS.display.scale ; i++) {
  for (var j = 0 ; j < ELEMS.display.scale ; j++) {
    Crafty.e('2D, Canvas, Color, Mouse')
    .attr({ 
      x : i * ELEMS.display.tiles.w, 
      y : j * ELEMS.display.tiles.h,
      w : ELEMS.display.tiles.w,
      h : ELEMS.display.tiles.h
    })
    .color(ELEMS.utils.getRandomColor())
    // FIXME extraire cette fonction de la boucle
    .bind('Click', function(e) {
      var currentColor = this.color();
      ELEMS.counters.clicks -= 1;
      $('#counter').html(ELEMS.counters.clicks);
      this.color(ELEMS.utils.getNextColor(currentColor));
    });
  }
}

$('#counter').html(ELEMS.counters.clicks);