describe('AppController', function() {
  var $scope;
  var $location;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope, _$location_) {
    $scope = $rootScope;
    $location = _$location_;

    $controller('AppController', { 
      $scope: $scope,  
      $location: $location
    });
  }));

  it('should say that "notes" is active when location is /notes', function() {    
    $location.path('/notes');
    $scope.$apply();

    expect($scope.isNavBarActive('notes')).toBe(true);
    expect($scope.isNavBarActive('categories')).toBe(false);
  });

  it('should say that "categories" is active when location is /categories', function() {    
    $location.path('/categories');
    $scope.$apply();

    expect($scope.isNavBarActive('notes')).toBe(false);
    expect($scope.isNavBarActive('categories')).toBe(true);
  });

  it('should say that no tab is active when location is unknown', function() {
    $location.path('/google');
    $scope.$apply();

    expect($scope.isNavBarActive('notes')).toBe(false);
    expect($scope.isNavBarActive('categories')).toBe(false);
  });

  it('should say that tab is not activate when the tab is unknown', function() {
    $location.path('/notes');
    $scope.$apply();

    expect($scope.isNavBarActive('google')).toBe(false);
  });
});
