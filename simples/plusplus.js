/*
PlusPlus

*/

var PP = angular.module('PlusPlus', {});


/*
This module contains various game logic functions.
*/
PP.factory('logic', function () {

  return {
    isLastColumn : function (extract, row, grid) {
      return extract.position(row) === _.size(grid);
    }
  };
});

/*
Extraction module
*/
PP.factory('extract', function () {

  return {
    position : function(item) {
        // Extract Num from an item : 2 for r2 for example
        // item here is a row, or a cell, or a target
        // TODO test if it's a string
      return parseInt(item.charAt(1));
    }
  };

});

/*
Computation module.
*/
PP.factory('compute', function () {
  return {
    /* FIXME delete this function ? */
    getFactorNum : function (cellNum) {
      return cellNum;
    },
    getNewValue : function (currentValue, factor) {
      return (currentValue + factor) % 10;
    },
    getRandomZeroNine : function () {
      return Math.floor(Math.random() * 10);
    },
    // Maybe in another module ?
    glideArray : function (array) {
      var item = array.pop();
      array.unshift(item);
      return array;
    },
    /*
    Mutate factors object by "gliding" them.
     */
    glideFactors : function (currentFactors, glideFunction) {
      // FIXME make the code clearer using a codeFactors parameter
      // Factors object values are put in an array that is "glided".
      // Then we mutate the current factors object
      var newFactorsArray = glideFunction(_.values(currentFactors));
      var factorPosition = 1;
      _(currentFactors).forEach( function() {
        currentFactors['f'+factorPosition] = newFactorsArray[factorPosition - 1];
        factorPosition++;
        } );
      return currentFactors;

    }
  };
});


/*
This is the controller of the main game UI.
*/
PP.controller('MainCtrl',
              ['$scope',
               'extract',
               'compute',
               'logic',
               function($scope, extract, compute, logic) {

  $scope.data = {
  factors : {
    f1 : compute.getRandomZeroNine(),
    f2 : compute.getRandomZeroNine(),
    f3 : compute.getRandomZeroNine(),
    f4 : compute.getRandomZeroNine()
  },
  grid : {
    r1 : {
      c1 : compute.getRandomZeroNine(),
      c2 : compute.getRandomZeroNine(),
      c3 : compute.getRandomZeroNine(),
      c4 : compute.getRandomZeroNine()},
    r2 : {c1 : '-', c2 : '-', c3 : '-', c4 : '-'},
    r3 : {c1 : '-', c2 : '-', c3 : '-', c4 : '-'},
    r4 : {c1 : '-', c2 : '-', c3 : '-', c4 : '-'}
  },
  targets : {
    t1 : 0,
    t2 : 0,
    t3 : 0,
    t4 : 0
  }
};

  $scope.clickCell = function (e) {
    var currId = e.currentTarget.id,
        split = currId.split('-'),
        row = split[0],
        column = split[1],
        nextRowPos = extract.position(row)+1,
        factorNum = compute.getFactorNum(extract.position(column)),
        factor = 'f' + factorNum,
        currentValue = $scope.data.grid[row][column],
        newValue = compute.getNewValue(currentValue, $scope.data.factors[factor]);

    if (currentValue !== '-') {
      // It's a number cell, act !
      if (!logic.isLastColumn(extract, row, $scope.data.grid)) {
        // FIXME Refactor to a method
        $scope.data.grid[row][column] = '-';
        $scope.data.grid['r'+nextRowPos][column] = newValue;
        $scope.data.factors = compute.glideFactors($scope.data.factors, compute.glideArray);
      } else {
        // FIXME Refactor to a method
        $scope.data.grid[row][column] = '-';
        $scope.data.targets['t'+extract.position(column)] = newValue;
        $scope.data.factors = compute.glideFactors($scope.data.factors, compute.glideArray);
      }
    }

  };

}]);
