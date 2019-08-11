describe('tbAppController', function() {
  beforeEach(module('tbAppController'));

  var $scope;
  var $location;
  beforeEach(inject(function($controller, $rootScope, _$location_) {
    $scope = $rootScope.$new();
    $location = _$location_;
    $controller('AppController', {
      $scope: $scope,
      $location: $location
    });
  }));

  describe('isNavBarActive()', function() {
    it('should publish isNavBarActive() on the scope', function() {
      expect($scope.isNavBarActive).toBeDefined();
    });

    it('should say that "people" navbar is active when location is "/people"', function() {
      $scope.$apply(function() {
        $location.path('/people');
      });

      expect($scope.isNavBarActive('people')).toBe(true);
      expect($scope.isNavBarActive('teams')).toBe(false);
    });

    it('should say that "teams" navbar is active when location is "/teams"', function() {
      $scope.$apply(function() {
        $location.path('/teams');
      });

      expect($scope.isNavBarActive('people')).toBe(false);
      expect($scope.isNavBarActive('teams')).toBe(true);
    });

    it('should say that no navbar is active when location is unknown', function() {
      $scope.$apply(function() {
        $location.path('/google');
      });

      expect($scope.isNavBarActive('people')).toBe(false);
      expect($scope.isNavBarActive('teams')).toBe(false);
    })
  });
});
