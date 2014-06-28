
var PP = angular.module('PlusPlus', {});

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

PP.factory('compute', function () {
  return {
    getFactorNum : function (cellNum) {
      if(cellNum === 4) {
        return 1;
      } else {
        return cellNum + 1;
      }
    }
  };
});

PP.controller('MainCtrl',
              ['$scope',
               'extract',
               'compute',
               function($scope, extract, compute) {

  $scope.data = {
  factors : {
    f1 : 1,
    f2 : 2,
    f3 : 3,
    f4 : 4
  },
  grid : {
    r1 : {c1 : 2, c2 : 0, c3 : 9, c4 : 2},
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

  $scope.test = function(e) {
    var currId = e.currentTarget.id,
        split = currId.split('-'),
        row = split[0],
        cell = split[1],
        nextRowPos = extract.position(row)+1,
        factorNum = compute.getFactorNum(extract.position(cell)),
        factor = 'f' + factorNum,
        currentValue = $scope.data.grid[row][cell];

    console.debug(factorNum);

    if($scope.data.grid[row][cell] === '-') {
      // NUTHING
    } else {
      $scope.data.grid[row][cell] = '-';
      $scope.data.grid['r'+nextRowPos][cell] = currentValue + $scope.data.factors[factor];
    }



  };
}]);
