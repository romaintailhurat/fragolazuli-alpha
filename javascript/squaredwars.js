//---------------
// SQUAREDWARS MAIN JAVASCRIPT
//---------------

//-------------- CONSTS

var VALUES = {
    //resource costs
      'sonde' : 3,
      'dome' : 5,
      'missile' : 3,
      'starting-stack' : 10
    },
    TIMINGS = {
      //seconds to build complete
      'buildings' : {
        'sonde' : 3
      }
    },
    DEBUG = true;

//-------------- GAME
//----- Module contenant la partie en cours
var GAME = {};

GAME.state = 'created'; // /!\ already exists on the server #TODO synchronize ?

//game time in seconds
GAME.clock = 0;

//----- Timer

YUI().use('event', function(Y) {
  //-tick
  setInterval(function() {Y.fire('clock:tick');},1000);
  //-event listener
  Y.on('clock:tick', function() {
    GAME.clock += 1;
    //debug('clock : ' + clock);
    //display seconds on page
    $('#clock').html(GAME.clock + "secs");
  });
});


  //------------//
 //   MODELS   //
//------------//

//--- Grid

var GridModel = Backbone.Model.extend({});

//--- Sonde

var SondeModel = Backbone.Model.extend({
  defaults : {
    'value' : VALUES['sonde']
  }
});

//--- ResourceStack

/*
Holds resources of the player
*/
var ResourceStackModel = Backbone.Model.extend({
  //player starts with x resources
  defaults : {
    'stack' : VALUES['starting-stack']
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

   //-------------//
  // COLLECTIONS //
 //-------------//

 //----- Sondes of the player
 var SondesCollection =  Backbone.Collection.extend({
  model : SondeModel
 });


  //------------//
 //   VIEWS    //
//------------//

//----- GridView
/*
  Display the grid
*/
var GridView = Backbone.View.extend({
  render : function() {
    debug("rendering grid view to div with id : " + this.el.id);

    var gridToBeDisplayed = this.model.get('grid'),
        elId = '#'+this.el.id;
    displayGrid(elId,gridToBeDisplayed);
    
  }
});

//----- SondesView
/*
  Representing sondes stack
 */
var SondesView = Backbone.View.extend({

  el : '#sondes-area',

  render : function(numberOfSondes) {
    debug('rendering sondes collection');
    debug('numberOfSondes : ' + numberOfSondes);
    var context = { 'numberOfSondes' : numberOfSondes },
        template = _.template($('#template-sondes').html()),
        html = template(context);

    $(this.el).html(html);
  }
});


//------ ResourceStackView
/*
Display the resources available to the player through the
#template-resource
*/
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

//-------------- UTILS

function debug(message) {
  if(DEBUG) {
    console.log("[DEBUG] " + message);
  }
}

/**
@param elId id of the element in which the grid will be displayed
@param grid the grid, as given by the server
*/
function displayGrid(elId, grid) {
  
  //chaque ligne du grid
  _.map(grid, function(row, rowIndex) {
    $(elId).append('<div id="'+rowIndex+'" class="g-row"></div>');
    _.map(row, function(cell, cellIndex) {
      $('#'+rowIndex).append('<div id="'+rowIndex+cellIndex+'" class="cube g-cell hidden">'+cell+'</div>');
    });
  });
}

  //------------//
 // GAME LOOP  //
//------------//

GAME.start = function() {
  debug('Game has started !');
  GAME.state = 'started';
  var count = 0;
  /*while(true) {
  }*/
};