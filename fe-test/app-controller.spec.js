describe('AppController', function() {
  var $controller;
  var $rootScope;
  var $location;

  beforeEach(module('app'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$location_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $location = _$location_;
  }));

  it('should say that "notes" is active when location is /notes', function() {    
    var controller = $controller('AppController', { 
      $scope: $rootScope,  
      $location: $location
    });

    $location.path('/notes');
    $rootScope.$apply();

    expect($rootScope.isNavBarActive('notes')).toBe(true);
    expect($rootScope.isNavBarActive('categories')).toBe(false);
  });

  it('should say that "categories" is active when location is /categories', function() {    
    var controller = $controller('AppController', { 
      $scope: $rootScope,  
      $location: $location
    });

    $location.path('/categories');
    $rootScope.$apply();

    expect($rootScope.isNavBarActive('notes')).toBe(false);
    expect($rootScope.isNavBarActive('categories')).toBe(true);
  });

  it('should say that no tab is active when location is unknown', function() {
    var controller = $controller('AppController', { 
      $scope: $rootScope,  
      $location: $location
    });

    $location.path('/google');
    $rootScope.$apply();

    expect($rootScope.isNavBarActive('notes')).toBe(false);
    expect($rootScope.isNavBarActive('categories')).toBe(false);
  });

  it('should say that tab is not activate when the tab is unknown', function() {
    var controller = $controller('AppController', { 
      $scope: $rootScope,  
      $location: $location
    });

    $location.path('/notes');
    $rootScope.$apply();

    expect($rootScope.isNavBarActive('google')).toBe(false);
  });
});
