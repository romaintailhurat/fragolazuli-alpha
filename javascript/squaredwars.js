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

var playerResources = 0;

//----- Models

var GridModel = Backbone.Model.extend({});

var SondeModel = Backbone.Model.extend({
  defaults : {
    'value' : 3 
  }
});

//----- Views

var GridView = Backbone.View.extend({
  render : function() {
    debug("this.el.id : " + this.el.id);

    var gridToBeDisplayed = this.model.get('grid'),
        elId = '#'+this.el.id;
    displayGrid(elId,gridToBeDisplayed);
    
  }
});

var SondeView = Backbone.View.extend({});

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

  