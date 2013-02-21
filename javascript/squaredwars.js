//---------------
// SQUAREDWARS MAIN JAVASCRIPT
//---------------

//-------------- GAME
//----- Module contenant la partie en cours
var GAME = {};

//-------------- CONSTS

GAME.VALUES = {
    //resource costs
      'sonde' : 1,
      'dome' : 3,
      'missile' : 1,
      'startingStack' : 10,
      'winningLimit' : 100
    };

GAME.TIMINGS = {
      //seconds to build complete
      'buildings' : {
        'sonde' : 3
      }
    };

GAME.MESSAGES = {
  'not-enough-money' : 'You dont have enough money !'
}

GAME.DEBUG = true;

//-------------- GLOBAL VARS

GAME.state = 'created'; // /!\ already exists on the server #TODO synchronize ?

// Each time we click a cell in the grid, this global var tells what action
// should be perform : donothing, setsonde, setdome, destroydome
GAME.actionVerb = 'donothing';

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
  var resourcesPerTick = GAME.domesSet.length;
  GAME.resourceStackModel.add(resourcesPerTick);
});

// Players progress is sent to the opponent
createjs.Ticker.addListener(function() {
  debug('sending progress to opponent : ' + GAME.resourceStackModel.get('stack'));

  send(GAME.currentPlayer, {
    "action" :  "progress",
    "score" : GAME.resourceStackModel.get('stack')
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
    'value' : GAME.VALUES['sonde']
  }
});


//--- Dome

var DomeModel = Backbone.Model.extend({
  defaults : {
    'value' : GAME.VALUES['dome']
  }
});

//--- Missile

var MissileModel = Backbone.Model.extend({
  defaults : {
    'value' :  GAME.VALUES['missile']
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
      $('#grid-area').html('<h1>You win, bad boy !</h1>');
      send(GAME.currentPlayer, {"action" : "other-win"});
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

 //----- A player's domes
 // Ici, deux collections : les domes produits pas encore installés et les domes installés
 var DomesStack = Backbone.Collection.extend({
  model : DomeModel
 });

 var DomesSet = Backbone.Collection.extend({
  model : DomeModel
 });

 //----- A player's missiles
 var MissilesCollection = Backbone.Collection.extend({
  model : MissileModel
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
            index = i.toString()+'-'+j.toString();
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
    // Rebind, because for every rendering, the binding disappear
    $('#launcher-sonde').on('click', function() {
      console.debug('actionVerb set to : setsonde');
      GAME.actionVerb = "setsonde";
    });
  }
});

//----- DomeView
var DomesView = Backbone.View.extend({

  el : '#domes-area',

  render : function(numberOfDomes) {
    debug('rendering domes collection');

    var context = {'numberOfDomes' : numberOfDomes},
        template = _.template($('#template-domes').html()),
        html = template(context);

    $(this.el).html(html);
    // Rebind
    $('#launcher-dome').on('click', function(){
      console.debug('actionVerb set to : setdome');
      GAME.actionVerb = "setdome";
    })
  }
});

//----- MissileView
var MissilesView = Backbone.View.extend({

  el : '#missiles-area',

  render : function(numberOfMissiles) {
    debug('rendering missiles collection');

    var context = {'numberOfMissiles' : numberOfMissiles},
        template = _.template($('#template-missiles').html()),
        html = template(context);

    $(this.el).html(html);
    // Rebind
    $('#launcher-missile').on('click', function(){
      console.debug('actionVerb set to : launchmissile');
      GAME.actionVerb = "launchmissile";
    })
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

GAME.displayMessage = function(message) {
  $('#message-area').html(message);
};

/**
@param elId id of the element in which the grid will be displayed
@param grid the grid, as given by the server
*/
function displayGrid(elId, grid) {

  // First emptying div html, to avoid side-effect when re-rendering
  $(elId).html("");
  
  //chaque ligne du grid
  _.map(grid, function(row, rowIndex) {
    $(elId).append('<div id="'+rowIndex+'" class="g-row"></div>');
    //every cell of the current row
    _.map(row, function(cell, cellIndex) {
      if(cell === 'D1' || cell === 'D2') {
        $('#'+rowIndex).append('<div id="'+rowIndex+'-'+cellIndex+'" class="cube g-cell hidden">'+cell+'</div>');
      }
      else {
        // a space is appended to the letter to get tiles of the same width
        $('#'+rowIndex).append('<div id="'+rowIndex+'-'+cellIndex+'" class="cube g-cell hidden">'+cell+' '+'</div>');  
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