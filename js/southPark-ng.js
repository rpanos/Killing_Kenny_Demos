
/*
 * 
 * Thoughts:
 *  - This is so simple!
 *  - POJOs are not bad
 * 
 * Most important point: it took about 20 minutes to convert the jQuery version to angular.  I LOVE ANGULAR!
 * 
 */


var killingKennyApp = angular.module('killingKennyApp', [

  ]);

killingKennyApp.controller('SouthParkController', ['$scope', function($scope ) { 

  $scope.initIconList = [
    "cartman",
    "ike",
    "kenny",
    "kyle",
    "stan",
    "tweak",
    "wendy"
  ];
  $scope.unselectedIconList = $scope.initIconList.slice(0); 
  $scope.selectedIconList = [
  
  ];
  
  $scope.clickAction =  function(name) {
    var index = $scope.unselectedIconList.indexOf(name);
    if (index > -1) {
        $scope.unselectedIconList.splice(index, 1);
    }
    $scope.selectedIconList.push(name); 
  };
  
  $scope.resetAll=  function() {
    $scope.unselectedIconList = $scope.initIconList.slice(0);
    $scope.selectedIconList = [];
  };

}]);