'use strict';

/* jasmine specs for controllers go here */
describe('SouthPark controllers', function() {

  describe('SouthParkController', function(){

    beforeEach(module('killingKennyApp'));

    it('should create seven icons', inject(function($controller) {
      var scope = {},
          ctrl = $controller('SouthParkController', {$scope:scope});

      expect(scope.unselectedIconList.length).toBe(7);
    }));

  });
});
