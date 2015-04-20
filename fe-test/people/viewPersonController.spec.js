describe('tbViewPersonController', function() {
  beforeEach(module('tbViewPerson'));

  var scope;
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controller('ViewPersonController', {
      $scope: scope,
      $location: null, // TODO
      execute: null, // TODO
      apiService: null, // TODO
      person: {
        id: 123,
        name: 'john'
      }
    });
  }));

  it('should publish a person id', function() {
    expect(scope.person).toBeDefined();
    expect(scope.person.id).toBe(123);
    expect(scope.person.name).toBe('john');
  });

  it('should register at /people/{id}', inject(function($route) {
    var route = $route.routes['/people/:id'];
    expect(route).toBeDefined();
    expect(route.controller).toBe('ViewPersonController');
    expect(route.templateUrl).toBe('people/viewPerson.html');
    expect(route.resolve.person).toBeDefined();
  }));
});
