/*
PlusPlus

*/

var PP = angular.module('PlusPlus', {});


/*
This module contains various game logic functions.
*/
PP.factory('logic', function () {

  return {
    isLastCell : function (extract, row, grid) {
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
    /* FIXME the factor must be get from factors value */
    getFactorNum : function (cellNum) {
      if(cellNum === 4) {
        return 1;
      } else {
        return cellNum + 1;
      }
    },
    getNewValue : function (currentValue, factor) {
      return (currentValue + factor) % 10;
    },
    getRandomZeroNine : function () {
      return Math.floor(Math.random() * 10);
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
        cell = split[1],
        nextRowPos = extract.position(row)+1,
        factorNum = compute.getFactorNum(extract.position(cell)),
        factor = 'f' + factorNum,
        currentValue = $scope.data.grid[row][cell],
        newValue = compute.getNewValue(currentValue, $scope.data.factors[factor]);

    if (currentValue !== '-') {
      // It's a number cell, act !
      if (!logic.isLastCell(extract, row, $scope.data.grid)) {
        $scope.data.grid[row][cell] = '-';
        $scope.data.grid['r'+nextRowPos][cell] = newValue;
      } else {
        $scope.data.grid[row][cell] = '-';
      }
    }


    // TODO
    // check if it is the last column being dropped to zero
    // if it is, the game is finished, show the result

  };

}]);
