//---------------
// SQUAREDWARS MAIN JAVASCRIPT
//---------------

//-------------- CONSTS

var TYPES = ['T','R'],
    TYPES_WITH_WEIGHT = {'T':0.9,'R':0.2},
    TYPES_FREQ = {'T': 0,'R' : 0},
    DEBUG = true;

//-------------- GAME
//----- Module contenant la partie en cours
var GAME = {};

//duration in seconds
GAME.duration = 0;

//----- Timer

YUI().use('event', function(Y) {
  //-tick
  setInterval(function() {Y.fire('clock:tick');},1000);
  //-event listener
  Y.on('clock:tick', function() {
    GAME.duration += 1;
    //debug('duration : ' + duration);
    //display seconds on page
    $('#duration').html(GAME.duration + "secs");
  });
});


//----- Models
//--- Grid
var GridModel = Backbone.Model.extend({});

//--- Sonde
var SondeModel = Backbone.Model.extend({
  defaults : {
    'value' : 3 
  }
});

//--- ResourceStack
/*
Holds resources held by the player
*/
var ResourceStackModel = Backbone.Model.extend({
  //player starts with 3 resources
  defaults : {
    'stack' : 5
  },

  add : function(quant) {
    debug('adding ' + quant + ' resources to stack');
    var currentStack = this.get('stack');
    this.set('stack',currentStack + quant);
    //associated view will (must) be updated 'change' is triggered
    this.trigger('change'); 
    if (this.get('stack') >= 30) {
      alert('GAME OVER - YOU WIN');
    }
  },

  subtract : function(quant) {
    debug('subtracting ' + quant + ' to resource stack');
    if(this.isSubtractionPossible(quant)) {
      var currentStack = this.get('stack');
      this.set('stack', currentStack - quant);
      return true;
    }
    else {
      return false;
    }
  },

  isSubtractionPossible : function(quant) {
    if(this.get('stack') - quant >= 0) {
      return true;
    }
    else {
      return false;
    }
  }
});

//----- Views

var GridView = Backbone.View.extend({
  render : function() {
    debug("rendering grid view to div with id : " + this.el.id);

    var gridToBeDisplayed = this.model.get('grid'),
        elId = '#'+this.el.id;
    displayGrid(elId,gridToBeDisplayed);
    
  }
});

var SondeView = Backbone.View.extend({});

var ResourceStackView = Backbone.View.extend({
  el : '#resource-area',

  //template : _.template($('#template-resource').html()),

  render : function() {
    debug('rendering resource stack view');

    var context = {
          'stack' : this.model.get('stack')
        },
        //ideally, would be a view property ! but this.template won't work !  =(
        template = _.template($('#template-resource').html()),

        html = template(context);

        $(this.el).html(html);
  }
});
//----- Logic

//-------------- UTILS

function debug(message) {
  if(DEBUG) {
    console.log("[DEBUG] " + message);
  }
}

/**
@param grid
*/

function displayGrid(elId, grid) {
  
  //chaque ligne du grid
  _.map(grid, function(row, rowIndex) {
    $(elId).append('<div id="'+rowIndex+'" class="g-row"></div>');
    _.map(row, function(cell, cellIndex) {
      $('#'+rowIndex).append('<div id="'+rowIndex+cellIndex+'" class="g-cell hidden">'+cell+'</div>');
    });
  });
}

  