//---------------
// SQUAREDWARS MAIN JAVASCRIPT
//---------------

//-------------- CONSTS

var TYPES = ['T','R'],
    TYPES_WITH_WEIGHT = {'T':0.9,'R':0.2},
    TYPES_FREQ = {'T': 0,'R' : 0},
    DEBUG = true;

//-------------- GAME

var GAME = {};

GAME.logic = {};

GAME.models = {
  'sonde' : {
    'getCost':function() {
      return 2;
    },
    
    '' : function() {}
  }
};

//-------------- FUNCTIONS

function debug(message) {
  if(DEBUG) {
    console.log("[DEBUG] " + message);
  }
}

function generateTypeOfCell(){
  var numberOfTypes = TYPES.length,
      randomFloat = Math.random();
  
  if (randomFloat < TYPES_WITH_WEIGHT.T) {
    TYPES_FREQ.T += 1;
    return TYPES[0];
  }
  else {
    TYPES_FREQ.R += 1;
    return TYPES[1];
  }
}

/*
@param n : number of rows
@param m : number of columns
@return Array n x m
*/
function generateGrid(n,m) {
  var grid = [];
  
  for (var i = 0 ; i < m ; i++) {
    var arrayToPush = [];
    
    for (var j = 0 ; j < n ; j++) {
      var type = generateTypeOfCell();
      arrayToPush.push(type);
    }
    
    grid.push(arrayToPush);
  }
  
  //display stats
  debug("Ts : " + TYPES_FREQ.T + " -- Rs : " + TYPES_FREQ.R);

  return grid;
}

/**
@param grid
*/

function displayGrid(grid) {
  
  //loop on grid
  for (var i = 0 ; i < grid.length ; i++) {
    
    var elRow = document.createElement('div');
  
    elRow.setAttribute('class','row');
    
    //loop on grid.i
    for (var j = 0 ; j < grid[i].length ; j++) {
      var elCell = document.createElement('span');
      
      elCell.setAttribute('class','cell');      
      elRow.appendChild(elCell);      
      elCell.innerHTML = grid[i][j];
      }
    
    document.body.appendChild(elRow);    
  }
}

  