describe('tbCreatePerson', function() {
  beforeEach(module('tbCreatePerson'));

  var scope;
  beforeEach(inject(function($controller, $rootScope, $q, $location) {
    scope = $rootScope.$new();
    $controller('CreatePersonController', {
      $scope: scope,
      $q: $q,
      $location: $location,
      execute: function() {}, // TODO
      apiService: {}, // TODO
      ApiErrors: {} // TODO
    });
  }));

  it('should publish a createPerson() function on the scope', function() {
    expect(scope.createPerson).toBeDefined();
  });
});

/*'$scope', '$q', '$location', 'execute', 'apiService', 'ApiErrors',*/
