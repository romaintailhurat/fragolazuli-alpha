//---------------
// SQUAREDWARS MAIN JAVASCRIPT
//---------------

//-------------- GAME
//----- Module contenant la partie en cours
var GAME = {};

//-------------- CONSTS

GAME.VALUES = {
    //resource costs
      'sonde' : 3,
      'dome' : 5,
      'missile' : 3,
      'startingStack' : 10,
      'winningLimit' : 1000
    };

GAME.TIMINGS = {
      //seconds to build complete
      'buildings' : {
        'sonde' : 3
      }
    };

GAME.DEBUG = false;

GAME.state = 'created'; // /!\ already exists on the server #TODO synchronize ?

//game time in seconds
GAME.clock = 0;

//----- Timer

//tick every second
createjs.Ticker.setInterval(1000);

// the clock listener
createjs.Ticker.addListener(function() {
  GAME.clock += 1;
  $('#clock').html(GAME.clock + "secs");
});

// the dome listener, in charge for loading the resource stack
createjs.Ticker.addListener(function() {
  var resourcesPerTick = GAME.domes.length;
  GAME.resourceStackModel.add(resourcesPerTick);
});

  //------------//
 //   MODELS   //
//------------//

//--- Grid

var GridModel = Backbone.Model.extend({});

//--- Sonde

var SondeModel = Backbone.Model.extend({
  defaults : {
    'value' : GAME.VALUES['sonde']
  }
});

var DomeModel = Backbone.Model.extend({
  defaults : {
    'value' : GAME.VALUES['dome']
  }
});

//--- ResourceStack

/*
Holds resources of the player
*/
var ResourceStackModel = Backbone.Model.extend({
  //player starts with x resources
  defaults : {
    'stack' : GAME.VALUES['startingStack']
  },

  add : function(quant) {
    debug('adding ' + quant + ' resources to stack');
    var currentStack = this.get('stack');
    this.set('stack',currentStack + quant);
    //associated view will (must) be updated 'change' is triggered
    this.trigger('change'); 
    if (this.get('stack') >= GAME.VALUES['winningLimit']) {
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

 //----- A player's dome
 var DomesCollection = Backbone.Collection.extend({
  model : DomeModel
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
    
  },

  displayStartingDome: function(player) {
    var grid = this.model.get('grid'),
        cellValue;

    if (player === 'player1') { cellValue = 'D1'; }
    else if (player === 'player2') { cellValue = 'D2'; }

    for (var i in grid) { 
      for (var j in grid[i]) {
        var cell = grid[i][j],
            index = i.toString()+j.toString();
        if (cell === cellValue) {
          debug('index : ' + index);
          $('#'+index).removeClass('hidden');
        }
      }
    }
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
          'stack' : this.model.get('stack'),
          'winningLimit' : GAME.VALUES['winningLimit']
        },
        //ideally, would be a view property ! but this.template won't work !  =(
        template = _.template($('#template-resource').html()),

        html = template(context);

        $(this.el).html(html);
  }
});

//-------------- UTILS

function debug(message) {
  if(GAME.DEBUG) {
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
    //every cell of the current row
    _.map(row, function(cell, cellIndex) {
      if(cell === 'D1' || cell === 'D2') {
        $('#'+rowIndex).append('<div id="'+rowIndex+cellIndex+'" class="cube g-cell hidden">'+cell+'</div>');
      }
      else {
        // a space is appended to the letter to get tiles of the same width
        $('#'+rowIndex).append('<div id="'+rowIndex+cellIndex+'" class="cube g-cell hidden">'+cell+' '+'</div>');  
      }
      
    });
  });
}

  //------------//
 // GAME LOOP  //
//------------//


// TODO implements stopping condition
GAME.start = function() {
  debug('Game has started !');
  GAME.state = 'started';
  var count = 0;
};